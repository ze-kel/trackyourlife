"use client";
import { isSameDay, isBefore, isAfter } from "date-fns";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";
import type { ITrackable, ITrackableSettings } from "../../../../../packages/validators/src/trackable";
import { DayCellRange } from "./DayCellRange";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "@tyl/ui"
import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";
import { useQuery } from "@tanstack/react-query";
import { RSAGetTrackableData } from "src/app/api/trackables/serverActions";
import { Skeleton } from "@tyl/ui/skeleton";
import { getDateInTimezone } from "src/helpers/timezone";
import { useUserSettings } from "~/components/Providers/UserSettingsProvider";

export interface IDayProps {}

export const computeDayCellHelpers = ({
  day,
  month,
  year,
  startDate,
  dateNow,
}: {
  day: number;
  month: number;
  year: number;
  startDate: ITrackableSettings["startDate"];
  dateNow: Date;
}) => {
  const dateDay = new Date(year, month, day);
  const beforeToday = isBefore(dateDay, dateNow);

  const startConvented = startDate ? new Date(startDate) : undefined;

  const afterLimit = startConvented
    ? isSameDay(dateDay, startConvented) || isAfter(dateDay, startConvented)
    : true;
  const inTrackRange = beforeToday && afterLimit;
  const isToday = isSameDay(dateNow, dateDay);

  return { inTrackRange, isToday, dateDay };
};

export const DayCellBaseClasses =
  "@container w-full h-full relative select-none overflow-hidden border-transparent outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600 border-2 rounded-sm";

const DayCellInner = ({
  type,
  value,
  children,
  isLoading = false,
  outOfRange = false,
  className,
  dateDay,
  onChange,
}: {
  children: ReactNode;
  type: ITrackable["type"];
  value?: string;
  isLoading?: boolean;
  outOfRange?: boolean;
  disabled?: boolean;
  className?: string;
  dateDay: Date;
  onChange: (v: string) => void | Promise<void>;
}) => {
  if (outOfRange)
    return (
      <div
        className={cn(
          className,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      >
        {children}
      </div>
    );

  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          className,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      />
    );
  }

  if (type === "boolean") {
    return (
      <DayCellBoolean className={className} value={value} onChange={onChange}>
        {children}
      </DayCellBoolean>
    );
  }

  if (type === "number") {
    return (
      <DayCellNumber
        className={className}
        value={value}
        onChange={onChange}
        dateDay={dateDay}
      >
        {children}
      </DayCellNumber>
    );
  }

  if (type === "range") {
    return (
      <DayCellRange className={className} value={value} onChange={onChange}>
        {children}
      </DayCellRange>
    );
  }

  throw new Error("Unsupported trackable type");
};

const DayCellWrapper = ({
  day,
  month,
  year,
  className,
  labelType = "auto",
}: {
  day: number;
  month: number;
  year: number;
  className?: string;
  noLabel?: boolean;
  labelType?: "auto" | "outside" | "none";
}) => {
  const { id, trackable, settings, update } = useTrackableContextSafe();

  const { data, isLoading } = useQuery({
    queryKey: ["trackable", trackable?.id, year, month],
    queryFn: async () => {
      const data = await RSAGetTrackableData({
        trackableId: id,
        limits: { type: "month", month, year },
      });

      return data[year]?.[month] || {};
    },
  });

  const u = useUserSettings();

  const { inTrackRange, isToday, dateDay } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: settings?.startDate,
        dateNow: getDateInTimezone(u.settings.timezone),
      }),
    [day, month, year, settings?.startDate, u.settings.timezone],
  );

  if (!trackable) return <></>;

  const updateHandler = async (value: string) => {
    await update({ value, day, month, year });
  };

  return (
    <div className="flex flex-col">
      {labelType !== "none" && (
        <div
          className={cn(
            "mr-1 text-right text-xs text-neutral-800 ",
            labelType === "outside" ? "" : "md:hidden",
            isToday ? "font-normal underline" : "font-light",
          )}
        >
          {day}
        </div>
      )}
      <DayCellInner
        className={cn(DayCellBaseClasses, className)}
        type={trackable.type}
        isLoading={isLoading}
        outOfRange={!inTrackRange}
        dateDay={dateDay}
        value={data?.[day]}
        onChange={updateHandler}
      >
        {labelType !== "none" && (
          <div
            className={cn(
              "absolute left-1 top-0 select-none text-base text-neutral-800 ",
              labelType === "outside" ? "hidden" : "max-md:hidden",
              isToday ? "font-normal underline" : "font-light",
            )}
          >
            {day}
          </div>
        )}
      </DayCellInner>
    </div>
  );
};

export default DayCellWrapper;
