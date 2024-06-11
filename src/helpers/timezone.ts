import { toZonedTime } from "date-fns-tz";
import type { TimeZone } from "timezones-list";

export const getDateInTimezone = (timezone?: TimeZone) => {
  return toZonedTime(Date.now(), timezone?.tzCode || "Europe/London");
};
