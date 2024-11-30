import type { TimeZone } from "timezones-list";
import { TZDate } from "@date-fns/tz";
import { sub } from "date-fns";

export const getNowWithTimezoneOffset = (timezone?: TimeZone): Date => {
  const tzDate = new TZDate(Date.now(), timezone?.tzCode ?? "Europe/London");
  return sub(new Date(), { minutes: tzDate.getTimezoneOffset() });
};
