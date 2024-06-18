import type { TimeZone } from "timezones-list";
import { startOfMonth, sub, subDays } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import type {
  DbTrackableRecordSelect,
  DbTrackableSelect,
} from "@tyl/db/schema";
import type { TGETLimits } from "@tyl/validators/api";
import type {
  ITrackable,
  ITrackableData,
  ITrackableSettings,
} from "@tyl/validators/trackable";
import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { ZTrackableSettings } from "@tyl/validators/trackable";
import { UserSettingsFallback, ZUserSettings } from "@tyl/validators/user";

export const GetUserSettings = async ({ userId }: { userId: string }) => {
  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, userId),
  });

  if (!user) return UserSettingsFallback;

  const parsed = ZUserSettings.safeParse(user.settings);

  if (!parsed.success) {
    return UserSettingsFallback;
  }
  return parsed.data;
};

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

  // limits.type === "last"
  // Note that this will return "full december and full january" for "last 7 days" on jan 3.
  // This is intentional to not ensure that any month stored on a client has all its data fetched.
  return {
    from: startOfMonth(sub(new Date(), { days: limits.days })).toDateString(),
    to: dateNow.toDateString(),
  };
};

export const getDateInTimezone = (timezone?: TimeZone) => {
  return toZonedTime(Date.now(), timezone ? timezone.tzCode : "Europe/London");
};

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
  const parseRes = ZTrackableSettings.safeParse(trackable);
  if (parseRes.success) {
    return parseRes.data;
  }
  return {};
};

export const prepareTrackable = (
  trackable: DbTrackableSelect & { data: DbTrackableRecordSelect[] },
  limits: TGETLimits,
): ITrackable => {
  return {
    ...trackable,
    data: makeTrackableData(trackable.data, limits),
    settings: makeTrackableSettings(trackable),
  } as ITrackable;
};
