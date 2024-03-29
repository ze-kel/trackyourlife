"use client";
import { isSameDay, isBefore, isAfter, format } from "date-fns";
import formatDateKey from "src/helpers/formatDateKey";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";
import type { ITrackableSettings } from "src/types/trackable";
import { DayCellRange } from "./DayCellRange";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTrackableContextSafe } from "@components/Providers/TrackableProvider";
import { useQuery } from "@tanstack/react-query";
import { RSAGetTrackableData } from "src/app/api/trackables/serverActions";
import { Skeleton } from "@/components/ui/skeleton";

export interface IDayProps {}

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

  const startConvented = startDate ? new Date(startDate) : undefined;

  const afterLimit = startConvented
    ? isSameDay(dateDay, startConvented) || isAfter(dateDay, startConvented)
    : true;
  const inTrackRange = beforeToday && afterLimit;
  const isToday = isSameDay(dateNow, dateDay);

  return { dateKey, inTrackRange, isToday };
};

const DayCell = ({
  day,
  month,
  year,
  className,
  customLabel,
}: {
  day: number;
  month: number;
  year: number;
  className?: string;
  customLabel?: ReactNode;
}) => {
  const { id, trackable, settings, update } = useTrackableContextSafe();

  const { data, isLoading } = useQuery({
    queryKey: ["trackable", trackable?.id, year, month],
    queryFn: async () => {
      return await RSAGetTrackableData({
        trackableId: id,
        limits: { type: "month", month, year },
      });
    },
  });

  const { dateKey, inTrackRange, isToday } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: settings?.startDate,
      }),
    [day, month, year, settings?.startDate],
  );

  if (!trackable) return <></>;

  const updateHandler = async (value: string) => {
    await update({ value, day, month, year });
  };

  const baseClasses = cn(
    "w-full h-full relative select-none overflow-hidden border-transparent outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600 border-2 rounded-sm",
    className,
  );

  const Label = (
    <div className="absolute left-0.5 top-0.5 select-none text-neutral-800 sm:left-1 sm:top-0 sm:text-base">
      {customLabel !== undefined ? (
        customLabel
      ) : (
        <span className={cn(isToday ? "font-normal underline" : "font-light")}>
          {day}
        </span>
      )}
    </div>
  );

  if (!inTrackRange)
    return (
      <div
        className={cn(
          baseClasses,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      >
        {Label}
      </div>
    );

  if (isLoading || !data) {
    return (
      <Skeleton
        className={cn(
          baseClasses,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      />
    );
  }

  if (trackable.type === "boolean") {
    return (
      <DayCellBoolean
        className={baseClasses}
        value={data[dateKey]}
        onChange={updateHandler}
      >
        {Label}
      </DayCellBoolean>
    );
  }

  if (trackable.type === "number") {
    return (
      <DayCellNumber
        className={baseClasses}
        value={data[dateKey]}
        dateString={format(new Date(year, month, day), "d MMMM yyyy")}
        onChange={updateHandler}
      >
        {Label}
      </DayCellNumber>
    );
  }

  if (trackable.type === "range") {
    return (
      <DayCellRange
        className={baseClasses}
        value={data[dateKey]}
        onChange={updateHandler}
        number={day}
      >
        {Label}
      </DayCellRange>
    );
  }

  throw new Error("Unsupported trackable type");
};

export default DayCell;
