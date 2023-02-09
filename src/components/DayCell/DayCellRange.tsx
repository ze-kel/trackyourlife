import Dropdown from "@components/_UI/Dropdown";
import { Emoji } from "@components/_UI/Emoji";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { useTrackableSafe } from "src/helpers/trackableContext";
import type { IDayProps } from ".";
import { computeDayCellHelpers } from ".";
import { ThemeList } from "./DayCellBoolean";

import type { IRangeSettings } from "@t/trackable";
import clsx from "clsx";
import { AnimatePresence, motion, transform } from "framer-motion";

interface PopupSelectorProps {
  rangeMapping: IRangeSettings["labels"];
  onSelect: (v: string) => Promise<void>;
}

const PopupSelector = ({ rangeMapping, onSelect }: PopupSelectorProps) => {
  if (!rangeMapping || !rangeMapping.length) return <></>;
  const center = (rangeMapping.length - 1) / 2;
  const maxDiff = Math.abs(rangeMapping.length - center);

  const transformer = transform([0, maxDiff], [0, 0.15]);

  const getDelayByIndex = (i: number) => {
    const diff = Math.abs(i - center);
    return transformer(diff);
  };

  const isCenterElement = (i: number) => {
    return Math.abs(i - center) <= 0.5;
  };

  const getYAnimation = (i: number) => {
    if (isCenterElement(i)) return 0;
    return i < center ? "200%" : "-200%";
  };

  return (
    <motion.div
      layout
      className="flex cursor-pointer flex-col rounded-full dark:bg-neutral-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {rangeMapping.map((v, index) => {
          return (
            <motion.div
              initial={{
                translateY: getYAnimation(index),
                height: 0,
              }}
              animate={{ opacity: 1, translateY: 0, height: 45 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: getDelayByIndex(index),
                duration: 0.2,
                ease: "easeInOut",
              }}
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                void onSelect(v.internalKey);
              }}
              className={clsx(
                "rounded-full px-2 transition-colors hover:bg-lime-500",
                isCenterElement(index) && "z-[100]"
              )}
            >
              <Emoji size="30px" shortcodes={v.emojiShortcode} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

const RangeClasses = cva(
  [
    "group relative flex items-center justify-center font-light transition-colors",
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
      style: {
        default: "h-16 border-2",
        mini: "h-6 border text-xs",
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
        style: "default",
        className: "text-neutral-500 dark:text-neutral-700",
      },
      {
        inTrackRange: true,
        isToday: false,
        style: "mini",
        className: "text-neutral-500  dark:text-neutral-800",
      },
    ],
    defaultVariants: {
      style: "default",
    },
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

  const visiblePart = (
    <div
      className={RangeClasses({
        inTrackRange,
        isToday,
        style,
      })}
      key={day}
    >
      {(style !== "mini" || !dayValue) && (
        <span
          className={clsx(
            "select-none",
            style === "mini" ? "" : "absolute top-1 left-2 "
          )}
        >
          {day}
        </span>
      )}

      {dayValue && (
        <Emoji shortcodes={code} size={style === "mini" ? "14px" : "30px"} />
      )}
    </div>
  );

  const selector = (
    <PopupSelector
      rangeMapping={trackable.settings.labels}
      onSelect={handleSelect}
    />
  );

  return inTrackRange ? (
    <Dropdown
      visible={isSelecting}
      setVisible={setIsSelecting}
      mainPart={visiblePart}
      hiddenPart={selector}
      background={false}
      placeCenter={true}
    />
  ) : (
    visiblePart
  );
};
