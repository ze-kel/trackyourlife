import type { TimeZone } from "timezones-list";
import { add, startOfMonth, sub, subDays } from "date-fns";

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
import { getNowInTimezone } from "@tyl/helpers/timezone";
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

const PG_MINUS_INFINITY = new Date(1970, 0, 1);
const PG_INFINITY = new Date(new Date().getFullYear() + 100, 0, 1);

export const getDateBounds = (
  limits: TGETLimits | undefined,
  timezone: TimeZone | undefined,
) => {
  if (!limits) {
    return { from: PG_MINUS_INFINITY, to: PG_INFINITY };
  }

  if (limits.type === "year") {
    return {
      from: new Date(limits.year, 0, 1),
      to: new Date(limits.year + 1, 0, 1),
    };
  }

  if (limits.type === "month") {
    return {
      from: new Date(limits.year, limits.month, 1),
      to: add(new Date(limits.year, limits.month, 1), {
        months: 1,
      }),
    };
  }

  if (limits.type === "range") {
    return {
      from: new Date(limits.from.year, limits.from.month, 1),
      to: add(new Date(limits.to.year, limits.to.month, 1), {
        months: 1,
      }),
    };
  }

  // limits.type === "last"
  // Note that this will return "full december and full january" for "last 7 days" on jan 3.
  // This is intentional to ensure that any month stored on a client has all its data fetched.
  const today = getNowInTimezone(timezone);

  return {
    from: startOfMonth(sub(today, { days: limits.days })),
    to: add(new Date(), { days: 1 }),
  };
};

export const makeTrackableData = (
  trackableData: DbTrackableRecordSelect[],
  limits: TGETLimits,
  timezone: TimeZone | undefined,
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
      const today = getNowInTimezone(timezone);
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
    if (!result[y][m]) {
      result[y][m] = {};
    }

    result[y][m][d] = el.value;
  });

  return result;
};

export const makeTrackableSettings = (
  trackable: Pick<DbTrackableSelect, "type" | "settings">,
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
  timezone: TimeZone | undefined,
): ITrackable => {
  return {
    ...trackable,
    data: makeTrackableData(trackable.data, limits, timezone),
    settings: makeTrackableSettings(trackable),
  } as ITrackable;
};
