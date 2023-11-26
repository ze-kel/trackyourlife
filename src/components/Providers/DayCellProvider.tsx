import { getColorAtPosition } from "@components/Colors/numberColorSelector";
import { presetsMap } from "@components/Colors/presets";
import type {
  IBooleanSettings,
  IColorValue,
  INumberSettings,
  IRangeSettings,
  ITrackable,
} from "@t/trackable";
import { clamp } from "lodash";
import type { CSSProperties, ReactNode } from "react";
import { createContext, memo, useContext } from "react";
import { makeColorString } from "src/helpers/colorTools";

export interface IDayCellBooleanContext {
  type: "boolean";
  themeActiveLight: string;
  themeInactiveLight: string;
  themeActiveDark: string;
  themeInactiveDark: string;
}

export interface IDayCellNumberContext {
  type: "number";
  valueToColor: (v: number) => IColorValue;
  valueToProgressPercentage: (v: number | undefined) => number | null;
}

export interface IDayCellRangeContext {
  type: "range";
  labelMapping: Record<string, string>;
  labels: IRangeSettings["labels"];
}

export type IDayCellContext =
  | IDayCellBooleanContext
  | IDayCellNumberContext
  | IDayCellRangeContext;

const DayCellContext = createContext<IDayCellContext | null>(null);

const DayCellBooleanProvider = ({
  settings,
  children,
}: {
  settings: IBooleanSettings;
  children: ReactNode;
}) => {
  const themeActive = settings.activeColor;
  const themeInactive = settings.inactiveColor;

  const themeActiveLight = makeColorString(
    themeActive?.lightMode || presetsMap.green.lightMode,
  );
  const themeActiveDark = makeColorString(
    themeActive?.darkMode || presetsMap.green.darkMode,
  );
  const themeInactiveLight = makeColorString(
    themeInactive?.lightMode || presetsMap.neutral.lightMode,
  );
  const themeInactiveDark = makeColorString(
    themeInactive?.darkMode || presetsMap.neutral.darkMode,
  );

  return (
    <div
      style={
        {
          "--themeActiveLight": themeActiveLight,
          "--themeActiveDark": themeActiveDark,
          "--themeInactiveLight": themeInactiveLight,
          "--themeInactiveDark": themeInactiveDark,
        } as CSSProperties
      }
    >
      <DayCellContext.Provider
        value={{
          type: "boolean",
          themeActiveDark,
          themeActiveLight,
          themeInactiveDark,
          themeInactiveLight,
        }}
      >
        {children}
      </DayCellContext.Provider>
    </div>
  );
};

const DayCellNumberProvider = ({
  settings,
  children,
}: {
  settings: INumberSettings;
  children: ReactNode;
}) => {
  // Maybe we should memoize this
  const valueToColor = (displayedNumber: number) => {
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

  const valueToProgressPercentage = (val: number | undefined) => {
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
    return Math.round(
      (clamp(val, progress.min, progress.max) / (progress.max - progress.min)) *
        100,
    );
  };

  return (
    <div>
      <DayCellContext.Provider
        value={{
          type: "number",
          valueToColor,
          valueToProgressPercentage,
        }}
      >
        {children}
      </DayCellContext.Provider>
    </div>
  );
};

const getRangeLabelMapping = (settings: IRangeSettings) => {
  const map: Record<string, string> = {};
  if (!settings.labels) return map;
  settings.labels.forEach((v) => {
    map[v.internalKey] = v.emoji;
  });

  return map;
};

const DayCellRangeProvider = ({
  settings,
  children,
}: {
  settings: IRangeSettings;
  children: ReactNode;
}) => {
  const labelMapping = getRangeLabelMapping(settings);

  return (
    <div>
      <DayCellContext.Provider
        value={{
          type: "range",
          labelMapping,
          labels: settings.labels,
        }}
      >
        {children}
      </DayCellContext.Provider>
    </div>
  );
};

export const DayCellProvider = ({
  type,
  settings,
  children,
}: {
  type: ITrackable["type"] | undefined;
  settings: ITrackable["settings"] | undefined;
  children: ReactNode;
}) => {
  console.log("dc");
  if (!type || !settings) {
    return <>{children}</>;
  }

  if (type === "boolean") {
    return (
      <DayCellBooleanProvider settings={settings}>
        {children}
      </DayCellBooleanProvider>
    );
  }

  if (type === "number") {
    return (
      <DayCellNumberProvider settings={settings}>
        {children}
      </DayCellNumberProvider>
    );
  }

  if (type === "range") {
    return (
      <DayCellRangeProvider settings={settings}>
        {children}
      </DayCellRangeProvider>
    );
  }

  throw new Error("Unsupported by DayCellProvider Trackable type");
};

export const MemoDayCellProvider = memo(DayCellProvider);

export const useDayCellContextBoolean = () => {
  const data = useContext(DayCellContext);

  if (!data) {
    throw new Error("No DayCell context provided");
  }

  if (data.type === "boolean") {
    return data;
  }
  throw new Error(
    `Wrong DayCell context provided or requested. Context type is ${data.type}. Requested type is boolean`,
  );
};

export const useDayCellContextNumber = () => {
  const data = useContext(DayCellContext);

  if (!data) {
    throw new Error("No DayCell context provided");
  }

  if (data.type === "number") {
    return data;
  }
  throw new Error(
    `Wrong DayCell context provided or requested. Context type is ${data.type}. Requested type is number`,
  );
};

export const useDayCellContextRange = () => {
  const data = useContext(DayCellContext);

  if (!data) {
    throw new Error("No DayCell context provided");
  }

  if (data.type === "range") {
    return data;
  }
  throw new Error(
    `Wrong DayCell context provided or requested. Context type is ${data.type}. Requested type is range`,
  );
};
