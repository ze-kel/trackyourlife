import type { TimeZone } from "timezones-list";
import { TZDate, tzOffset } from "@date-fns/tz";
import { add } from "date-fns";

export const getGMTWithTimezoneOffset = (timezone?: TimeZone): Date => {
  const off =
    tzOffset(timezone?.tzCode ?? "Europe/London", new Date()) +
    new Date().getTimezoneOffset();

  return add(new Date(), {
    minutes: off,
  });
};

export const getTimezonedDate = (timezone?: TimeZone): Date => {
  return new TZDate(Date.now(), timezone?.tzCode ?? "Europe/London");
};
