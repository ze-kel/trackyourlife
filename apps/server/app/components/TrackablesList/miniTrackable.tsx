import { cn } from "@shad/utils";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";

import DayCellWrapper from "~/components/DayCell";
import { FavoriteButton } from "~/components/FavoriteButton";
import { useTrackableMeta } from "~/components/Providers/TrackableProvider";
import { TrackableNameText } from "~/components/TrackableName";
import { useZeroTrackableData } from "~/utils/useZ";

const MiniTrackable = ({
  className,
  daysToRender,
}: {
  className?: string;
  daysToRender: { year: number; month: number; day: number }[];
}) => {
  const { id, type } = useTrackableMeta();

  const firstDay = daysToRender[0];
  const lastDay = daysToRender[daysToRender.length - 1];

  if (!firstDay || !lastDay) {
    console.error("No days to render", daysToRender);
    throw new Error("No days to render");
  }

  const [data, info] = useZeroTrackableData({
    id,
    firstDay: new Date(firstDay.year, firstDay.month, firstDay.day),
    lastDay: new Date(lastDay.year, lastDay.month, lastDay.day),
  });

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Link
          to={`/app/trackables/${id}/`}
          className={cn(
            "mb-1 block w-full text-xl font-light text-neutral-950 dark:text-neutral-50",
          )}
        >
          <TrackableNameText />
        </Link>

        <FavoriteButton onlyIcon />
      </div>

      <ErrorBoundary
        fallback={
          <div className="flex h-12 items-center justify-center bg-neutral-200 dark:bg-neutral-900">
            Error occured
          </div>
        }
      >
        <div className={"sm grid grid-cols-3 gap-x-1 gap-y-1 md:grid-cols-6"}>
          <>
            {daysToRender.map((day, index) => {
              const date = new Date(Date.UTC(day.year, day.month, day.day));
              const value = data.find((d) => d.date === date.getTime())?.value;
              return (
                <div
                  key={index}
                  className={cn(
                    "gap-1",
                    index === 0 ? "hidden md:flex" : "flex",
                    index > 3 ? "flex-col-reverse md:flex-col" : "flex-col",
                  )}
                >
                  <div className="flex justify-end gap-1 text-xs">
                    <span className="text-neutral-300 dark:text-neutral-800">
                      {format(date, "EEE")}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-600">
                      {format(date, "d")}
                    </span>
                  </div>
                  <DayCellWrapper
                    value={value}
                    isLoading={info.type !== "complete"}
                    date={date}
                    labelType="none"
                    key={index}
                    className="h-16"
                  />
                </div>
              );
            })}
          </>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default MiniTrackable;
