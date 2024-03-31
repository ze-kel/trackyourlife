import type {
  ITrackable,
  ITrackableData,
  ITrackableSettings,
} from "@t/trackable";
import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
} from "@t/trackable";
import { startOfMonth, sub, subDays } from "date-fns";
import type { DbTrackableRecordSelect, DbTrackableSelect } from "src/schema";

import { z } from "zod";

export const trackableToCreate = z.discriminatedUnion("type", [
  z.object({
    settings: ZTrackableSettingsBoolean,
    type: z.literal("boolean"),
  }),
  z.object({
    settings: ZTrackableSettingsNumber,
    type: z.literal("number"),
  }),
  z.object({
    settings: ZTrackableSettingsRange,
    type: z.literal("range"),
  }),
]);

export const makeTrackableData = (
  trackableData: DbTrackableRecordSelect[],
  limits: TGETLimits,
) => {
  const result: ITrackableData = {};

  // We have to set months that are in the range of request.
  // This way client can know what months got fetched even if there is no data at all
  if (limits) {
    if (limits.type === "year") {
      result[limits.year] = {};

      for (let i = 0; i < 12; i++) {
        //@ts-expect-error ts please
        result[limits.year][i] = [];
      }
    }

    if (limits.type === "month") {
      result[limits.year] = { [limits.month]: {} };
    }

    if (limits.type === "last") {
      const today = new Date();
      const start = subDays(today, limits.days);
      const [year, month, year2, month2] = [
        today.getFullYear(),
        today.getMonth(),
        start.getFullYear(),
        start.getMonth(),
      ];

      result[year] = { [month]: {} };
      if (!result[year2]) {
        result[year2] = { [month2]: [] };
      } else {
        //@ts-expect-error ts please
        result[year2][month2] = {};
      }
    }
  }

  trackableData.forEach((el) => {
    const rawDate = new Date(el.date);
    const [y, m, d] = [
      rawDate.getFullYear(),
      rawDate.getMonth(),
      rawDate.getDate(),
    ];
    if (!result[y]) {
      result[y] = {};
    }
    if (!result[y]?.[m]) {
      //@ts-expect-error ts please
      result[y][m] = {};
    }

    //@ts-expect-error ts please
    result[y][m][d] = el.value;
  });

  return result;
};

export const makeTrackableSettings = (
  trackable: DbTrackableSelect,
): ITrackableSettings => {
  let settingsParser;
  const type = trackable.type;
  if (type === "boolean") {
    settingsParser = ZTrackableSettingsBoolean;
  }
  if (type === "number") {
    settingsParser = ZTrackableSettingsNumber;
  }
  if (type === "range") {
    settingsParser = ZTrackableSettingsRange;
  }
  if (!settingsParser) {
    throw new Error("No parser for settings of type " + trackable.type);
  }

  // Note that we store settings as JSON, therefore dates there are stored as strings.
  // Here z.coerce.date() auto converts them to JS dates.
  const parseRes = settingsParser.safeParse(trackable.settings);
  if (parseRes.success) {
    return parseRes.data;
  }

  return { name: "Error parsing settings" };
};

export const prepareTrackable = (
  trackable: DbTrackableSelect & { data: DbTrackableRecordSelect[] },
  limits: TGETLimits,
): ITrackable => {
  return {
    ...trackable,
    data: makeTrackableData(trackable.data, limits),
    settings: makeTrackableSettings(trackable),
  };
};

export const ZGETLimits = z
  .union([
    z.object({ type: z.literal("year"), year: z.number() }),
    z.object({
      type: z.literal("month"),
      year: z.number(),
      month: z.number().min(0).max(11),
    }),
    z.object({ type: z.literal("last"), days: z.number().min(7).max(31) }),
  ])
  .optional();

export type TGETLimits = z.infer<typeof ZGETLimits>;

// This goes into postgres Between, where 'infinity'\'-infinity' is a valid date boundary
const PG_MINUS_INFINITY = "-infinity";
const PG_INFINITY = "infinity";

export const getDateBounds = (
  limits: TGETLimits | undefined,
  dateNow: Date,
) => {
  if (!limits) {
    return { from: PG_MINUS_INFINITY, to: PG_INFINITY };
  }

  if (limits.type === "year") {
    return {
      from: new Date(limits.year, 0, 1).toDateString(),
      to: new Date(limits.year + 1, 0, 1).toDateString(),
    };
  }

  if (limits.type === "month") {
    return {
      from: new Date(limits.year, limits.month, 1).toDateString(),
      to: new Date(limits.year, limits.month + 1, 1).toDateString(),
    };
  }

  if (limits.type === "last") {
    // Note that this will return "full december and full january" for "last 7 days" on jan 3.
    // This is intentional to not ensure that any month stored on a client has all its data fetched.
    return {
      from: startOfMonth(sub(new Date(), { days: limits.days })).toDateString(),
      to: dateNow.toDateString(),
    };
  }

  return { from: PG_MINUS_INFINITY, to: PG_INFINITY };
};
