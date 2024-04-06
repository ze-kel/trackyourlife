"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DayCellWrapper from "@components/DayCell";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { useUserSettings } from "@components/Providers/UserSettingsProvider";
import { TrackableNameText } from "@components/TrackableName";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MiniTrackable = ({
  className,
  daysToRender,
}: {
  className?: string;
  daysToRender: { year: number; month: number; day: number }[];
}) => {
  const { trackable } = useTrackableContextSafe();
  const { settings, updateSettingsPartial } = useUserSettings();

  const settingsSet = useMemo(() => {
    return new Set(settings.favorites);
  }, [settings]);

  const inFavs = trackable ? settingsSet.has(trackable.id) : false;

  const favHandler = async () => {
    if (!trackable) return;
    if (inFavs) {
      settingsSet.delete(trackable.id);
    } else {
      settingsSet.add(trackable.id);
    }
    await updateSettingsPartial({
      favorites: Array.from(settingsSet),
    });
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <Link
          href={`/trackables/${trackable?.id}/today`}
          className={cn(
            "mb-1 block w-full text-xl font-light text-neutral-950 dark:text-neutral-50",
          )}
        >
          <TrackableNameText />
        </Link>

        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => void favHandler()}
        >
          {inFavs ? <HeartFilledIcon /> : <HeartIcon />}
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
