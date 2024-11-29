import type { TimeZone } from "timezones-list";
import { TZDate } from "@date-fns/tz";

export const getNowInTimezone = (timezone?: TimeZone): Date => {
  return new TZDate(Date.now(), timezone?.tzCode ?? "Europe/London");
};

export const getDateInTimezone = (date: Date, timezone?: TimeZone): Date => {
  return new TZDate(date, timezone?.tzCode ?? "Europe/London");
};
