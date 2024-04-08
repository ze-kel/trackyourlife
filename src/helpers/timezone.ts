import { utcToZonedTime } from "date-fns-tz";
import type { TimeZone } from "timezones-list";

export const getDateInTimezone = (timezone?: TimeZone) => {
  return utcToZonedTime(Date.now(), timezone?.tzCode || "Europe/London");
};
