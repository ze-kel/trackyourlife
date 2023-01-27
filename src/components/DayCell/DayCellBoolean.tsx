import { useMemo } from "react";
import { useTrackableSafe } from "../../helpers/trackableContext";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import { cva } from "class-variance-authority";
import type { IColorOptions } from "src/types/trackable";

export const ThemeList: Record<IColorOptions, ""> = {
  neutral: "",
  red: "",
  pink: "",
  green: "",
  blue: "",
  orange: "",
  purple: "",
  lime: "",
};

const activeGen: Record<IColorOptions, Record<"bg" | "hover", string>> = {
  neutral: {
    bg: "bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-900",
    hover: "hover:text-neutral-700",
  },
  red: {
    bg: "bg-red-500",
    hover: "hover:text-red-500",
  },
  pink: {
    bg: "bg-pink-500",
    hover: "hover:text-pink-500",
  },
  green: {
    bg: "bg-green-500",
    hover: "hover:text-green-500",
  },
  blue: {
    bg: "bg-blue-500",
    hover: "hover:text-blue-500",
  },
  orange: {
    bg: "bg-orange-500",
    hover: "hover:text-orange-500",
  },
  purple: {
    bg: "bg-purple-500",
    hover: "hover:text-purple-500",
  },
  lime: {
    bg: "bg-lime-500 text-lime-700",
    hover: "hover:text-lime-500 dark:hover:text-lime-500",
  },
};

const Generated = (Object.keys(activeGen) as IColorOptions[]).reduce<
  {
    active?: boolean;
    themeActive?: IColorOptions;
    themeInactive?: IColorOptions;
    inTrackRange?: boolean;
    className: string;
  }[]
>((acc, key) => {
  acc.push({
    active: true,
    themeActive: key,
    inTrackRange: true,
    className: activeGen[key].bg,
  });
  acc.push({
    active: false,
    themeActive: key,
    inTrackRange: true,
    className: activeGen[key].hover,
  });
  acc.push({
    active: true,
    themeInactive: key,
    inTrackRange: true,
    className: activeGen[key].hover,
  });
  acc.push({
    active: false,
    themeInactive: key,
    inTrackRange: true,
    className: activeGen[key].bg,
  });

  return acc;
}, []);

const BooleanClasses = cva(
  [
    "flex border-transparent transition-all duration-400 ease-in-out select-none",
  ],
  {
    variants: {
      style: {
        default: "h-16 items-center justify-center text-xl font-semibold",
        mini: "text-xs h-6 justify-center items-center font-light border",
      },
      inTrackRange: {
        true: "cursor-pointer hover:text-2xl",
        false: "",
      },
      isToday: {
        true: "text-neutral-200",
        false: "text-neutral-100",
      },
      active: {
        true: "",
        false: "",
      },
      themeActive: ThemeList,
      themeInactive: ThemeList,
    },
    compoundVariants: [
      {
        active: false,
        inTrackRange: true,
        className: "",
      },
      {
        active: false,
        inTrackRange: false,
        className:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800",
      },
      ...Generated,
    ],
    defaultVariants: {
      style: "default",
      themeActive: "green",
      themeInactive: "neutral",
    },
  }
);

export const DayCellBoolean = ({ day, month, year, style }: IDayProps) => {
  const { trackable, changeDay } = useTrackableSafe();

  if (trackable.type !== "boolean") {
    throw new Error("Not boolena trackable passed to boolean dayCell");
  }

  const { dateKey, inTrackRange, isToday } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: trackable.settings.startDate,
      }),
    [day, month, year, trackable.settings.startDate]
  );

  const isActive = trackable.data[dateKey] === "true";

  const handleClick = async () => {
    if (!inTrackRange) return;
    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: isActive ? "false" : "true",
    });
  };

  return (
    <div
      className={BooleanClasses({
        inTrackRange,
        isToday,
        active: isActive,
        style,
        themeActive: trackable.settings.activeColor,
        themeInactive: trackable.settings.inactiveColor,
      })}
      key={day}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleClick();
      }}
    >
      {day}
    </div>
  );
};
