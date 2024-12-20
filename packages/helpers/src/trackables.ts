import { isAfter, isBefore, isSameDay } from "date-fns";

import {
  IBooleanSettings,
  INumberSettings,
  IRangeSettings,
  ITrackableSettings,
} from "@tyl/db/jsonValidators";
import { DbTrackableSelect } from "@tyl/db/schema";

import { range } from "./animation";
import { presetsMap } from "./colorPresets";
import { getColorAtPosition, makeColorString } from "./colorTools";

export const computeDayCellHelpers = ({
  day,
  month,
  year,
  startDate,
  dateNow,
}: {
  day: number;
  month: number;
  year: number;
  startDate: ITrackableSettings["startDate"];
  dateNow: Date;
}) => {
  const dateDay = new Date(year, month, day);
  const dateDayUTC = new Date(Date.UTC(year, month, day));
  const beforeToday = isBefore(dateDay, dateNow);

  const startConvented = startDate ? new Date(startDate) : undefined;

  const afterLimit = startConvented
    ? isSameDay(dateDay, startConvented) || isAfter(dateDay, startConvented)
    : true;
  const inTrackRange = beforeToday && afterLimit;
  const isToday = isSameDay(dateNow, dateDay);

  return { inTrackRange, isToday, dateDay, dateDayUTC };
};

export const getRangeLabelMapping = (settings: IRangeSettings) => {
  const map: Record<string, string> = {};
  if (!settings.labels) return map;
  settings.labels.forEach((v) => {
    map[v.internalKey] = v.emoji ?? "";
  });

  return map;
};

export const getValueToColorFunc = (settings: INumberSettings) => {
  return (displayedNumber: number) => {
    if (
      !settings.colorCodingEnabled ||
      !settings.colorCoding ||
      displayedNumber === 0
    ) {
      return presetsMap.neutral;
    }
    return getColorAtPosition({
      value: settings.colorCoding,
      point: displayedNumber,
    });
  };
};

export const getValueToProgressPercentage = (settings: INumberSettings) => {
  return (val: number | undefined) => {
    const progress = settings.progress;
    if (
      !progress ||
      !settings.progressEnabled ||
      typeof progress.max === "undefined" ||
      typeof progress.min === "undefined" ||
      typeof val === "undefined"
    ) {
      return null;
    }
    return range(progress.min, progress.max, 0, 100, val);
  };
};

export const getDayCellBooleanColors = (settings: IBooleanSettings) => {
  const themeActive = settings.activeColor;
  const themeInactive = settings.inactiveColor;
  const themeActiveLight = makeColorString(
    themeActive?.lightMode ?? presetsMap.green.lightMode,
  );
  const themeActiveDark = makeColorString(
    themeActive?.darkMode ?? presetsMap.green.darkMode,
  );
  const themeInactiveLight = makeColorString(
    themeInactive?.lightMode ?? presetsMap.neutral.lightMode,
  );
  const themeInactiveDark = makeColorString(
    themeInactive?.darkMode ?? presetsMap.neutral.darkMode,
  );

  return {
    themeActiveDark,
    themeActiveLight,
    themeInactiveDark,
    themeInactiveLight,
  };
};

export const sortTrackableList = <
  T extends Pick<DbTrackableSelect, "id" | "name">,
>(
  list: T[],
  favorites: string[],
) => {
  const favSet = new Set(favorites);

  const newList = list.sort((a, b) => {
    if (favSet.has(a.id) && !favSet.has(b.id)) return -1;
    if (!favSet.has(a.id) && favSet.has(b.id)) return 1;

    const aName = a.name || "";
    const bName = b.name || "";

    return aName.localeCompare(bName);
  });

  return newList;
};
