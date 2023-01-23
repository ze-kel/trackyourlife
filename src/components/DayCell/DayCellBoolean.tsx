import { useMemo } from "react";
import { useTrackableSafe } from "../../helpers/trackableContext";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import { cva } from "class-variance-authority";
import type { IColorOptions } from "src/types/trackable";

const themeList: Record<IColorOptions, ""> = {
  neutral: "",
  red: "",
  pink: "",
  green: "",
  blue: "",
  orange: "",
  purple: "",
  lime: "",
};

const activeGen: Record<IColorOptions, Record<string, string>> = {
  neutral: {
    bg: "bg-neutral-500",
    border: "hover:border-neutral-500",
  },
  red: {
    bg: "bg-red-500",
    border: "hover:border-red-500",
  },
  pink: {
    bg: "bg-pink-500",
    border: "hover:border-pink-500",
  },
  green: {
    bg: "bg-green-500",
    border: "hover:border-green-500",
  },
  blue: {
    bg: "bg-blue-500",
    border: "hover:border-blue-500",
  },
  orange: {
    bg: "bg-orange-500",
    border: "hover:border-orange-500",
  },
  purple: {
    bg: "bg-purple-500",
    border: "hover:border-purple-500",
  },
  lime: {
    bg: "bg-lime-500",
    border: "hover:border-lime-500",
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
    className: activeGen[key].border,
  });
  acc.push({
    active: true,
    themeInactive: key,
    inTrackRange: true,
    className: activeGen[key].border,
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
  ["flex rounded-sm border-transparent transition-colors select-none"],
  {
    variants: {
      style: {
        default:
          "h-16 px-2 py-1 font-semibold items-start justify-start border-2",
        mini: "text-xs h-6 justify-center items-center font-light border",
      },
      inTrackRange: {
        true: "cursor-pointer",
        false: "",
      },
      isToday: {
        true: "border-neutral-500 text-neutral-600",
        false: "text-neutral-500",
      },
      active: {
        true: "",
        false: "",
      },
      themeActive: themeList,
      themeInactive: themeList,
    },
    compoundVariants: [
      {
        active: false,
        inTrackRange: true,
        className: "text-neutral-800 dark:text-neutral-600",
      },
      {
        active: false,
        inTrackRange: false,
        className:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-700",
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
