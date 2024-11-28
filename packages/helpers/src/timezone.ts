import type { TimeZone } from "timezones-list";
import { toZonedTime } from "date-fns-tz";

export const getNowInTimezone = (timezone?: TimeZone) => {
  return toZonedTime(Date.now(), timezone?.tzCode ?? "Europe/London");
};

export const getDateInTimezone = (date: Date, timezone?: TimeZone) => {
  return toZonedTime(date, timezone?.tzCode ?? "Europe/London");
};

export const getStartOfDayGMT = (year: number, month: number, day: number) => {
  return toZonedTime(new Date(year, month, day), "Europe/London");
};
