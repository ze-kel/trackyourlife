"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DayCell from "@components/DayCell";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { format, getDaysInMonth } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

const generateDates = (days: number) => {
  const today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate();

  const dates: { year: number; month: number; day: number }[] = [];

  for (; days > 0; days--) {
    dates[days] = { year, month, day };

    if (day === 1) {
      if (month === 0) {
        year--;
        month = 11;
      } else {
        month--;
      }
      day = getDaysInMonth(new Date(year, month));
    } else {
      day--;
    }
  }
  return dates;
};

const NUM_OF_DAYS = 6;

const MiniTrackable = ({ className }: { className?: string }) => {
  const daysToRender = useMemo(() => generateDates(NUM_OF_DAYS), []);

  const { trackable, settings, settingsUpdatePartial } =
    useTrackableContextSafe();

  return (
    <>
      <div className="flex justify-between">
        <Link href={`/trackables/${trackable?.id}`} className="block w-fit">
          <h3 className="w-fit cursor-pointer text-xl font-light">
            {settings?.name || "unnamed"}
          </h3>
        </Link>

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
        <div
          className={cn(
            "sm grid grid-cols-3 gap-x-1 gap-y-1 md:grid-cols-6",
            className,
          )}
        >
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
                  <div className="px-1 text-xs ">
                    <span className="text-neutral-400 dark:text-neutral-700">
                      {format(date, "EEEE")}
                    </span>
                  </div>
                  <DayCell {...day} key={index} className="h-16" />
                </div>
              );
            })}
          </>
        </div>
      </ErrorBoundary>
    </>
  );
};

export default MiniTrackable;
