import { utcToZonedTime } from "date-fns-tz";
import type { TimeZone } from "timezones-list";

export const getDateInTimezone = (timezone?: TimeZone) => {
  const date = new Date();

  return timezone ? utcToZonedTime(Date.now(), timezone.tzCode) : date;
};
