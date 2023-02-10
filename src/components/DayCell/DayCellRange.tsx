import Dropdown from "@components/_UI/Dropdown";
import { Emoji } from "@components/_UI/Emoji";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { useTrackableSafe } from "src/helpers/trackableContext";
import type { IDayProps } from ".";
import { computeDayCellHelpers } from ".";
import { ThemeList } from "./DayCellBoolean";
import style from "./curstomScrollbar.module.css";

import type { IRangeSettings } from "@t/trackable";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface PopupSelectorProps {
  rangeMapping: IRangeSettings["labels"];
  onSelect: (v: string) => Promise<void>;
}

const PopupSelector = ({ rangeMapping, onSelect }: PopupSelectorProps) => {
  if (!rangeMapping || !rangeMapping.length) return <></>;

  const getDelayByIndex = (i: number) => {
    const center = 0;
    const oneOff = 0.025;
    const twoOff = 0.01;
    const arr = [twoOff, oneOff, center, oneOff, twoOff];
    return arr[i] || 0;
  };

  const getEaseByIndex = (i: number) => {
    const center = [0.4, 0, 0.4, 1.1];
    const oneOff = [0.2, 0.3, 0.4, 1.2];
    const twoOff = [0, 0.4, 0.4, 1.1];
    const arr = [twoOff, oneOff, center, oneOff, twoOff];
    return arr[i] || "linear";
  };

  const getDurationByIndex = (i: number) => {
    const center = 0.125;
    const oneOff = 0.22;
    const twoOff = 0.325;
    const arr = [twoOff, oneOff, center, oneOff, twoOff];
    return arr[i] || 0;
  };

  const getYAnimation = (i: number) => {
    const arr = ["150%", "100%", "0", "-100%", "-150%"];
    return arr[i];
  };

  const getZIndex = (i: number) => {
    const arr = [50, 75, 100, 75, 50];
    return arr[i];
  };

  return (
    <motion.div
      className={clsx(
        style.miniScrollbar,
        "relative flex w-14 cursor-pointer flex-col overflow-x-hidden rounded-full border border-neutral-200 bg-neutral-50 dark:border-transparent dark:bg-neutral-800"
      )}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "230px" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0, 1.1] }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <AnimatePresence>
          {rangeMapping.map((v, index) => {
            return (
              <motion.div
                initial={{
                  translateY: true ? getYAnimation(index) : 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  delay: getDelayByIndex(index),
                  duration: getDurationByIndex(index),
                  ease: getEaseByIndex(index),
                }}
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  void onSelect(v.internalKey);
                }}
                className={clsx(
                  "rounded-full px-2 text-center transition-colors hover:bg-lime-500"
                )}
                style={{ zIndex: getZIndex(index) }}
              >
                <Emoji size="30px" shortcodes={v.emojiShortcode} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
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
        true: "cursor-pointer border-neutral-500 dark:border-neutral-700",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800 border-transparent",
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
