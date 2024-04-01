"use client";
import { Bar } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { useQuery } from "@tanstack/react-query";
import { RSAGetTrackableData } from "src/app/api/trackables/serverActions";
import { getDaysInMonth } from "date-fns";
import { useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import {
  AxisBottom,
} from "@visx/axis";
import { Spinner } from "@/components/ui/spinner";
import { useDayCellContextNumber } from "@components/Providers/DayCellProvider";
import { makeColorString } from "src/helpers/colorTools";
import { useTheme } from "next-themes";

export type CurveProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

const graphHeight = 300;

export const Graph = ({
  year,
  month,
  id,
}: {
  year: number;
  month: number;
  id: string;
}) => {
  const { resolvedTheme } = useTheme();

  const { data, isLoading } = useQuery({
    queryKey: ["trackable", id, year, month],
    queryFn: async () => {
      const data = await RSAGetTrackableData({
        trackableId: id,
        limits: { type: "month", month, year },
      });

      return data[year]?.[month] || {};
    },
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { width } = useResizeObserver({ ref: wrapperRef });

  const { valueToColor } = useDayCellContextNumber();

  if (isLoading || !data || !width)
    return (
      <div
        ref={wrapperRef}
        className="flex w-full items-center justify-center"
        style={{ height: graphHeight + 40 }}
      >
        <Spinner />
      </div>
    );

  const daysInMonth = getDaysInMonth(new Date(year, month, 1));
  const daysArray = Array(daysInMonth)
    .fill(null)
    .map((_, i) => i + 1);

  const numbersArray = daysArray.map((d) => Number(data[d]) || 0);
  const maxY = Math.max(...numbersArray);
  const minY = Math.min(...numbersArray);

  // scales
  const xScale = scaleBand<number>({
    range: [0, width || 600],
    padding: 0.3,
    round: true,
    domain: daysArray,
  });
  const yScale = scaleLinear<number>({
    domain: [minY, maxY],
    range: [0, graphHeight],
    round: true,
  });

  const detailsColor = resolvedTheme === "dark" ? "#ffffff" : "black";

  return (
    <div ref={wrapperRef}>
      <svg width={width} height={graphHeight + 40} className="">
        {numbersArray.map((ent, i) => {
          const barHeight = yScale(Number(ent) || 0);
          const barWidth = xScale.bandwidth();
          const barX = xScale(i + 1);

          const color = valueToColor(ent);

          return (
            <Bar
              data-date={i + 1}
              data-value={ent}
              fill={makeColorString(
                resolvedTheme === "dark" ? color.darkMode : color.lightMode,
              )}
              x={barX}
              width={barWidth}
              key={i}
              height={barHeight}
              y={graphHeight - barHeight}
            />
          );
        })}

        <AxisBottom
          top={graphHeight}
          hideTicks
          scale={xScale}
          stroke={detailsColor}
          tickStroke={detailsColor}
          numTicks={width > 600 ? daysInMonth : Math.round(daysInMonth / 2)}
          tickLabelProps={{
            fill: detailsColor,
            fontSize: 14,
            fontFamily: "system-ui",
          }}
        />
      </svg>
    </div>
  );
};
