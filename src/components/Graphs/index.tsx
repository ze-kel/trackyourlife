"use client";
import { BarRounded } from "@visx/shape";
import { scaleLinear, scaleBand, scaleUtc } from "@visx/scale";
import { useQueries, useQuery } from "@tanstack/react-query";
import { RSAGetTrackableData } from "src/app/api/trackables/serverActions";
import { add, format, getDaysInMonth } from "date-fns";
import { useMemo, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Spinner } from "@/components/ui/spinner";
import { useDayCellContextNumber } from "@components/Providers/DayCellProvider";
import { makeColorString } from "src/helpers/colorTools";
import { useTheme } from "next-themes";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { NumberFormatter } from "@components/DayCell/DayCellNumber";
import { getDateInTimezone } from "src/helpers/timezone";
import { useUserSettings } from "@components/Providers/UserSettingsProvider";
import { create, windowScheduler } from "@yornaath/batshit";
import { RadioTabItem, RadioTabs } from "@/components/ui/radio-tabs";

export type CurveProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

const graphHeight = 300;

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

  const { settings } = useUserSettings();

  const now = getDateInTimezone(settings.timezone);

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
          const res = await RSAGetTrackableData({
            trackableId: trackable.id,
            limits: {
              type: "year",
              year,
            },
          });

          return res;
        },
        resolver: (data, requestedMonth) => {
          return data?.[year]?.[requestedMonth] || {};
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

      const data = qq?.[month]?.data || {};

      return Array(days)
        .fill(days)
        .map((_, i) => Number(data[i + 1] || 0));
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
  const { trackable } = useTrackableContextSafe();

  if (!trackable) throw new Error("no trackable in context");

  const { data, isLoading } = useQuery({
    queryKey: ["trackable", trackable.id, year, month],
    queryFn: async () => {
      const data = await RSAGetTrackableData({
        trackableId: trackable.id,
        limits: { type: "month", month, year },
      });
      return data[year]?.[month] || {};
    },
  });

  const start = new Date(Date.UTC(year, month, 1));
  const daysInMonth = getDaysInMonth(start);
  const end = add(start, { months: 1 });

  const datapoints = Array(daysInMonth)
    .fill(null)
    .map((_, i) => Number(data?.[i + 1] || 0));

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

export const Graph = ({
  datapoints,
  start,
  end,
  isLoading,
  year,
}: {
  datapoints: number[];
  start: Date;
  end: Date;
  isLoading?: boolean;
  year?: boolean;
}) => {
  const { resolvedTheme } = useTheme();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { width } = useResizeObserver({ ref: wrapperRef });

  const { valueToColor } = useDayCellContextNumber();

  if (!width || isLoading)
    return (
      <div
        ref={wrapperRef}
        className="flex w-full items-center justify-center"
        style={{ height: graphHeight + 40 }}
      >
        <Spinner />
      </div>
    );

  const daysArray = Array(datapoints.length)
    .fill(null)
    .map((_, i) => i + 1);

  const maxY = Math.max(...datapoints);
  const minY = Math.min(...datapoints);

  // scales
  const xScale = scaleBand<number>({
    range: [LEFT_OFFSET, width || 600],
    padding: 0.2,
    round: true,
    domain: daysArray,
  });

  const timeScale = scaleUtc({
    range: [LEFT_OFFSET, width || 600],
    domain: [start, end],
  });

  const yScale = scaleLinear<number>({
    domain: [minY, maxY],
    range: [graphHeight - TOP_OFFSET, 0],
    round: true,
  });

  const detailsColor = resolvedTheme === "dark" ? "#ffffff" : "black";

  return (
    <div ref={wrapperRef}>
      {JSON.stringify(start)}
      {JSON.stringify(end)}
      <svg width={width} height={graphHeight + 50} className="">
        {datapoints.map((ent, i) => {
          const barHeight = yScale(Number(ent) || 0);
          const barWidth = xScale.bandwidth();
          const barX = xScale(i + 1) || 0;

          const color = valueToColor(ent);

          const h = graphHeight - TOP_OFFSET - barHeight;

          return (
            <BarRounded
              radius={3}
              top
              data-date={i + 1}
              data-value={ent}
              fill={makeColorString(
                resolvedTheme === "dark" ? color.darkMode : color.lightMode,
              )}
              x={barX}
              width={barWidth}
              key={i}
              height={h}
              y={graphHeight - h}
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
          tickLabelProps={{
            fill: detailsColor,
            fontSize: 14,
            fontFamily: "system-ui",
          }}
        />

        {year ? (
          <AxisBottom
            top={graphHeight}
            scale={timeScale}
            stroke={detailsColor}
            tickStroke={detailsColor}
            numTicks={4}
            tickFormat={(v) => {
              return datapoints.length > 31
                ? format(v as Date, "MMM d")
                : format(v as Date, "d");
            }}
            tickLabelProps={{
              fill: detailsColor,
              fontSize: 14,
              fontFamily: "system-ui",
            }}
          />
        ) : (
          <AxisBottom
            top={graphHeight}
            scale={timeScale}
            stroke={detailsColor}
            tickStroke={detailsColor}
            numTicks={31}
            tickFormat={(v) => {
              return datapoints.length > 31
                ? format(v as Date, "MMM d")
                : format(v as Date, "d");
            }}
            tickLabelProps={{
              fill: detailsColor,
              fontSize: 14,
              fontFamily: "system-ui",
            }}
          />
        )}
      </svg>
    </div>
  );
};
