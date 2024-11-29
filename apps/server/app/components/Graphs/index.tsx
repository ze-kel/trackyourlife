/*
;

import { useMemo, useRef, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { create, windowScheduler } from "@yornaath/batshit";
import {
  eachDayOfInterval,
  format,
  getDaysInMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isSameMonth,
} from "date-fns";
import { useTheme } from "next-themes";
import { makeColorString } from "@tyl/helpers/colorTools";
import { getNowInTimezone } from "@tyl/helpers/timezone";
import { useResizeObserver } from "usehooks-ts";

import { RadioTabItem, RadioTabs } from "@shad/radio-tabs";
import { Spinner } from "@shad/spinner";

import { NumberFormatter } from "~/components/DayCell/DayCellNumber";
import { useDayCellContextNumber } from "~/components/Providers/DayCellProvider";
import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";
import { userUserContext } from "~/components/Providers/UserProvider";
import { api } from "~/trpc/react";

export type CurveProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

export const GraphWrapper = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const [mode, setMode] = useState("month");

  return (
    <div>
      <div className="flex w-full justify-end">
        <RadioTabs className="w-fit" value={mode} onValueChange={setMode}>
          <RadioTabItem value="year">{year}</RadioTabItem>
          <RadioTabItem value="month">
            {format(new Date(year, month, 1), "MMMM")}
          </RadioTabItem>
        </RadioTabs>
      </div>
      {mode === "year" && <GraphYear year={year} />}
      {mode === "month" && <GraphMonths year={year} month={month} />}
    </div>
  );
};

export const GraphYear = ({ year }: { year: number }) => {
  const { trackable } = useTrackableContextSafe();

  if (!trackable) throw new Error("no trackable in context");

  const { settings } = userUserContext();

  const now = getNowInTimezone(settings.timezone);

  const needMonths = now.getFullYear() === year ? now.getMonth() + 1 : 12;

  const monthsArray = Array(needMonths)
    .fill(null)
    .map((_, i) => i);

  // Months are stored in Tanstack Query individually, however here we need to fetch a year and do that in one request.
  // So Queries fetch through batch fetcher which requests a full year and then returns month that is being asked for.
  const batchFetcher = useMemo(
    () =>
      create({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fetcher: async (_: number[]) => {
          const res = await api.trackablesRouter.getTrackableData.query({
            id: trackable.id,
            limits: {
              type: "year",
              year,
            },
          });

          return res;
        },
        resolver: (data, requestedMonth) => {
          return data?.[year]?.[requestedMonth]??{};
        },
        scheduler: windowScheduler(10), // Default and can be omitted.
      }),
    [year, trackable.id],
  );

  const qq = useQueries({
    queries: monthsArray.map((month) => ({
      queryKey: ["trackable", trackable.id, year, month],
      queryFn: async () => {
        return await batchFetcher.fetch(month);
      },
    })),
  });

  const start = new Date(year, 0, 1);
  const end =
    needMonths >= 12 ? new Date(year + 1, 0, 1) : new Date(year, needMonths, 1);

  const isLoading = qq.some((v) => v.isLoading);

  const datapoints = monthsArray
    .map((month) => {
      const days = getDaysInMonth(new Date(year, month, 1));

      const data = qq?.[month]?.data??{};

      return Array(days)
        .fill(days)
        .map((_, i) => Number(data[i + 1]??0));
    })
    .flat();

  return (
    <Graph
      year
      isLoading={isLoading}
      datapoints={datapoints}
      start={start}
      end={end}
    />
  );
};

export const GraphMonths = ({
  year,
  month,
}: {
  year: number;
  month: number;
}) => {
  const { trackable, useTrackableQueryByMonth } = useTrackableContextSafe();

  if (!trackable) throw new Error("no trackable in context");

  const { data, isLoading } = useTrackableQueryByMonth({ month, year });

  const start = new Date(Date.UTC(year, month, 1));
  const daysInMonth = getDaysInMonth(start);
  const end = new Date(Date.UTC(year, month, daysInMonth));

  const datapoints = Array(daysInMonth)
    .fill(null)
    .map((_, i) => Number(data?.[i + 1]??0));

  return (
    <Graph
      isLoading={isLoading}
      datapoints={datapoints}
      start={start}
      end={end}
    />
  );
};

const LEFT_OFFSET = 50;
const TOP_OFFSET = 10;
const GRAPH_HEIGHT = 300;

export const Graph = ({
  datapoints,
  isLoading,
  start,
  end,
}: {
  datapoints: number[];
  start: Date;
  end: Date;
  isLoading?: boolean;
  year?: boolean;
}) => {
  const { settings } = useDayCellContextNumber();

  const limits = settings.progressEnabled && settings.progress;

  const { theme } = useTheme();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { width } = useResizeObserver({ ref: wrapperRef });

  const { valueToColor } = useDayCellContextNumber();

  if (!width??isLoading)
    return (
      <div
        ref={wrapperRef}
        className="flex w-full items-center justify-center"
        style={{ height: GRAPH_HEIGHT + 50 }}
      >
        <Spinner />
      </div>
    );

  const multiMonth = !isSameMonth(start, end);

  const days = eachDayOfInterval({ start, end });

  const daysIndexes = Array(datapoints.length)
    .fill(null)
    .map((_, i) => i);

  const ticksAt = multiMonth
    ? daysIndexes
        .map((v) => {
          const date = days[v];
          if (!date) return -1;
          const daysInMonth = getDaysInMonth(date);
          if (
            isFirstDayOfMonth(date) ||
            Math.round(daysInMonth / 2) === date.getDate()
          )
            return v;
          return -1;
        })
        .filter((v) => v >= 0)
    : daysIndexes;

  const tickLabels = ticksAt.reduce(
    (acc, v) => {
      if (!multiMonth) {
        acc[v] = String(v + 1);
        return acc;
      }

      const date = days[v];
      if (!date) return acc;

      const daysInMonth = getDaysInMonth(date);
      if (Math.round(daysInMonth / 2) === date.getDate()) {
        acc[v] = format(date, "MMM");
      }

      if (isFirstDayOfMonth(date)??isLastDayOfMonth(date)) {
        acc[v] = "|";
      }

      return acc;
    },
    {} as Record<string, string>,
  );

  const maxY = (limits && limits.max)??Math.max(...datapoints);
  const minY = (limits && limits.min)??Math.min(...datapoints);

  // scales
  const xScale = scaleBand<number>({
    range: [LEFT_OFFSET, width??600],
    padding: 0.2,
    round: true,
    domain: daysIndexes,
  });

  const yScale = scaleLinear<number>({
    domain: minY === maxY ? [0, 1] : [minY, maxY],
    range: [GRAPH_HEIGHT - TOP_OFFSET, 0],
    round: true,
  });

  const detailsColor = theme === "dark" ? "#525252" : "black";
  const textColor = theme === "dark" ? "#e5e5e5" : "black";

  return (
    <div ref={wrapperRef}>
      <svg width={width} height={GRAPH_HEIGHT + 50} className="">
        {datapoints.map((ent, i) => {
          const barHeight = yScale(Number(ent)??0);
          const barWidth = xScale.bandwidth();
          const barX = xScale(i)??0;

          const color = valueToColor(ent);

          const h = GRAPH_HEIGHT - TOP_OFFSET - barHeight;

          return (
            <BarRounded
              radius={3}
              top
              data-date={i + 1}
              data-value={ent}
              fill={makeColorString(
                theme === "dark" ? color.darkMode : color.lightMode,
              )}
              x={barX}
              width={barWidth}
              key={i}
              height={h}
              y={GRAPH_HEIGHT - h}
            />
          );
        })}
        <AxisLeft
          top={TOP_OFFSET}
          left={LEFT_OFFSET}
          scale={yScale}
          stroke={detailsColor}
          tickStroke={detailsColor}
          numTicks={6}
          tickFormat={(v) => {
            return NumberFormatter.format(Number(v));
          }}
          hideZero
          tickLabelProps={{
            fill: textColor,
            fontSize: 14,
            fontFamily: "system-ui",
          }}
        />
        <AxisBottom
          top={GRAPH_HEIGHT}
          tickLength={4}
          scale={xScale}
          tickValues={ticksAt}
          stroke={detailsColor}
          tickStroke={detailsColor}
          numTicks={31}
          hideTicks
          tickFormat={(i) => {
            return tickLabels[i];
          }}
          tickLabelProps={{
            fill: textColor,
            fontSize: 14,
            fontFamily: "system-ui",
          }}
        />
      </svg>
    </div>
  );
};
*/
