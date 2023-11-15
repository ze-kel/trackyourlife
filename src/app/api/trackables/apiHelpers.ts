import type { ITrackable, ITrackableSettings } from "@t/trackable";
import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
} from "@t/trackable";
import { format, sub } from "date-fns";
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

const makeTrackableData = (trackableData: DbTrackableRecordSelect[]) => {
  const result: ITrackable["data"] = {};

  trackableData.forEach((el) => {
    result[format(new Date(el.date), "yyyy-MM-dd")] = el.value;
  });
  return result;
};

const makeTrackableSettings = (
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
): ITrackable => {
  return {
    ...trackable,
    data: makeTrackableData(trackable.data),
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

export const getDateBounds = (limits: TGETLimits | undefined) => {
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
    return {
      from: sub(new Date(), { days: limits.days }).toDateString(),
      to: "infinity",
    };
  }

  return { from: PG_MINUS_INFINITY, to: PG_INFINITY };
};
