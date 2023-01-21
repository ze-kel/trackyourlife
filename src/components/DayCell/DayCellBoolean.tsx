import { useContext, useMemo } from "react";
import type { IContextData } from "../../helpers/trackableContext";
import { TrackableContext } from "../../helpers/trackableContext";
import type { ITrackable } from "src/types/trackable";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import { cva } from "class-variance-authority";

const BooleanClasses = cva(
  ["flex rounded-sm border-transparent transition-colors"],
  {
    variants: {
      style: {
        default:
          "h-16 px-2 py-1 font-semibold items-start justify-start border-2",
        mini: "text-xs h-6 justify-center items-center font-light border",
      },
      inFuture: {
        false: "cursor-pointer",
      },
      isToday: {
        true: "border-neutral-500 text-neutral-600",
        false: "text-neutral-500",
      },
      active: {
        true: "bg-lime-500 hover:border-neutral-400",
      },
    },
    compoundVariants: [
      {
        active: false,
        inFuture: false,
        className:
          "bg-neutral-200 dark:bg-neutral-800 hover:border-lime-400 text-neutral-800 dark:text-neutral-600",
      },
      {
        active: false,
        inFuture: true,
        className:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-700",
      },
    ],
    defaultVariants: {
      style: "default",
    },
  }
);

export const DayCellBoolean = ({ day, month, year, style }: IDayProps) => {
  const { trackable, changeDay } = useContext(
    TrackableContext
  ) as IContextData & {
    trackable: ITrackable;
  };

  const { dateKey, inFuture, isToday } = useMemo(
    () => computeDayCellHelpers({ day, month, year }),
    [day, month, year]
  );

  const isActive = trackable.data[dateKey] === "true";

  const handleClick = async () => {
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
      className={BooleanClasses({ inFuture, isToday, active: isActive, style })}
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
