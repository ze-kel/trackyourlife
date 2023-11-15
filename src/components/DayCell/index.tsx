"use client";
import { isSameDay, isBefore, isAfter } from "date-fns";
import formatDateKey from "src/helpers/formatDateKey";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";
import type { ITrackable, ITrackableSettings } from "src/types/trackable";
import { DayCellRange } from "./DayCellRange";

export interface IDayProps {
  trackable: ITrackable;
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

const DayCell = (data: IDayProps) => {
  const trackable = data.trackable;

  if (trackable.type === "boolean") {
    return <DayCellBoolean {...data} />;
  }

  if (trackable.type === "number") {
    return <DayCellNumber {...data} />;
  }

  if (trackable.type === "range") {
    return <DayCellRange {...data} />;
  }

  throw new Error("Unsupported trackable type");
};

export default DayCell;
