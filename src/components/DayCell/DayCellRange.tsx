import PopupSelector from "@components/DayCell/PopupSelector";
import { Emoji } from "@components/_UI/Emoji";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { useTrackableSafe } from "src/helpers/trackableContext";
import type { IDayProps } from ".";
import { computeDayCellHelpers } from ".";
import { ThemeList } from "./DayCellBoolean";

const RangeClasses = cva(
  [
    "group relative flex h-16 items-center justify-center border-2 font-light transition-colors",
  ],
  {
    variants: {
      inTrackRange: {
        true: "cursor-pointer border-neutral-700",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800 border-neutral-800",
      },
      isToday: {
        true: "text-neutral-400",
      },
      colorCode: ThemeList,
    },
    compoundVariants: [
      {
        inTrackRange: true,
        className: "text-neutral-500  dark:text-neutral-700",
      },
      {
        inTrackRange: true,
        isToday: false,
        className: "text-neutral-500 dark:text-neutral-700",
      },
    ],
  }
);

export const DayCellRange = ({ day, month, year, style }: IDayProps) => {
  const { trackable, changeDay, rangeLabelMapping } = useTrackableSafe();

  if (trackable.type !== "range") {
    throw new Error("Not range trackable passed to trackable dayCell");
  }

  if (!rangeLabelMapping) {
    throw new Error("Range label mapping error");
  }

  const [isSelecting, setIsSelecting] = useState(false);

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

  const dayValue = trackable.data[dateKey];
  const code = dayValue
    ? (rangeLabelMapping[dayValue] as string)
    : ':question"';

  const handleClick = () => {
    if (!inTrackRange) return;
    setIsSelecting(true);
  };

  const handleSelect = async (v: string) => {
    setIsSelecting(false);
    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: v,
    });
  };

  return (
    <div
      className={RangeClasses({
        inTrackRange,
        isToday,
      })}
      key={day}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleClick();
      }}
    >
      {isSelecting && (
        <PopupSelector
          rangeMapping={trackable.settings.labels}
          onSelect={handleSelect}
        />
      )}
      {dayValue && <Emoji shortcodes={code} size="30px" />}
    </div>
  );
};
