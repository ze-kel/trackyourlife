"use client";
import { isSameDay, isBefore, isAfter } from "date-fns";
import formatDateKey from "src/helpers/formatDateKey";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";
import type { ITrackableSettings } from "src/types/trackable";
import { DayCellRange } from "./DayCellRange";
import { useMemo } from "react";
import DayNumber from "@components/DayCell/dayNumber";
import { cn } from "@/lib/utils";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";

export interface IDayProps {
  day: number;
  month: number;
  year: number;
  style?: "mini";
}

export const computeDayCellHelpers = ({
  day,
  month,
  year,
  startDate,
}: {
  day: number;
  month: number;
  year: number;
  startDate: ITrackableSettings["startDate"];
}) => {
  const dateNow = new Date();
  const dateDay = new Date(year, month, day);

  const dateKey = formatDateKey({ day, month, year });
  const beforeToday = isBefore(dateDay, dateNow);

  const startCovented = startDate ? new Date(startDate) : undefined;

  const afterLimit = startCovented
    ? isSameDay(dateDay, startCovented) || isAfter(dateDay, startCovented)
    : true;
  const inTrackRange = beforeToday && afterLimit;
  const isToday = isSameDay(dateNow, dateDay);

  return { dateKey, inTrackRange, isToday };
};

const DayCell = ({ day, month, year }: IDayProps) => {
  const { trackable, update } = useTrackableContextSafe();

  const { dateKey, inTrackRange, isToday } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: trackable?.settings.startDate,
      }),
    [day, month, year, trackable?.settings.startDate],
  );

  if (!trackable) return <></>;

  const updateHanler = async (value: string) => {
    await update({ value, day, month, year });
  };

  const baseClasses =
    "w-full relative select-none overflow-hidden border-transparent outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600 h-16 border-2";

  if (!inTrackRange)
    return (
      <div
        className={cn(
          baseClasses,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      >
        <DayNumber day={day} isToday={isToday} />
      </div>
    );

  if (trackable.type === "boolean") {
    return (
      <DayCellBoolean
        className={baseClasses}
        value={trackable.data[dateKey]}
        settings={trackable.settings}
        onChange={updateHanler}
      >
        <DayNumber day={day} isToday={isToday} />
      </DayCellBoolean>
    );
  }

  if (trackable.type === "number") {
    return (
      <DayCellNumber
        className={baseClasses}
        value={trackable.data[dateKey]}
        settings={trackable.settings}
        onChange={updateHanler}
      >
        <DayNumber day={day} isToday={isToday} />
      </DayCellNumber>
    );
  }

  if (trackable.type === "range") {
    return (
      <DayCellRange
        className={baseClasses}
        value={trackable.data[dateKey]}
        settings={trackable.settings}
        onChange={updateHanler}
      >
        <DayNumber day={day} isToday={isToday} />
      </DayCellRange>
    );
  }

  throw new Error("Unsupported trackable type");
};

export default DayCell;
