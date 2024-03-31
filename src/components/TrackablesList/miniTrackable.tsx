"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DayCellWrapper from "@components/DayCell";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { TrackableName } from "@components/TrackablesList";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";

const MiniTrackable = ({
  className,
  daysToRender,
}: {
  className?: string;
  daysToRender: { year: number; month: number; day: number }[];
}) => {
  const { settings, settingsUpdatePartial } = useTrackableContextSafe();

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <TrackableName className="text-xl font-light" />

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() =>
            void settingsUpdatePartial({
              favorite: !settings?.favorite,
            })
          }
        >
          {settings?.favorite ? <HeartFilledIcon /> : <HeartIcon />}
        </Button>
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
              const date = new Date(day.year, day.month, day.day);
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
                    {...day}
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
