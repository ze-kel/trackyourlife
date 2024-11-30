import type { TimeZone } from "timezones-list";
import { TZDate } from "@date-fns/tz";
import { sub } from "date-fns";

export const getGMTWithTimezoneOffset = (timezone?: TimeZone): Date => {
  const tzDate = new TZDate(Date.now(), timezone?.tzCode ?? "Europe/London");
  return sub(new Date(), { minutes: tzDate.getTimezoneOffset() });
};

export const getTimezonedDate = (timezone?: TimeZone): Date => {
  return new TZDate(Date.now(), timezone?.tzCode ?? "Europe/London");
};
