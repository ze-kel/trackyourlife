"use client";
import Dropdown from "@components/_UI/Dropdown";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from ".";
import { ThemeList } from "./DayCellBoolean";
import style from "./curstomScrollbar.module.css";

import type { IRangeSettings, ITrackable } from "@t/trackable";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import DayNumber from "@components/DayCell/dayNumber";
import { changeDay } from "src/helpers/actions";
import { useOptimistic } from "react";

const getRangeLabelMapping = (trackable: ITrackable) => {
  if (trackable.type !== "range" || !trackable.settings.labels) return;

  const labels = trackable.settings.labels;

  const map: Record<string, string> = {};
  labels.forEach((v) => {
    map[v.internalKey] = v.emoji;
  });

  return map;
};

interface PopupSelectorProps {
  rangeMapping: IRangeSettings["labels"];
  onSelect: (v: string) => Promise<void>;
}

// Animation time multiplier. Keep at 1, unless you're debugging.
const AF = 1;

const EMOJI_H = 45;

type MakerProps<T> = {
  center: T;
  oneOff: T;
  twoOff: T;
  oneOffR?: T;
  twoOffR?: T;
  len: number;
};
type IndexGetter<T> = (i: number) => T;

// Might be better to use Framer Motion Variants
function makeIndexGetter<T>({
  center,
  oneOff,
  twoOff,
  oneOffR,
  twoOffR,
  len,
}: MakerProps<T>): IndexGetter<T> {
  if (len < 2) {
    return () => {
      return center;
    };
  }

  let arr: T[] = [];
  switch (len) {
    case 2: {
      arr = [oneOff, oneOffR || oneOff];
      break;
    }
    case 3: {
      arr = [oneOff, center, oneOffR || oneOff];
      break;
    }
    case 4: {
      arr = [twoOff, oneOff, oneOffR || oneOff, twoOffR || twoOff];
      break;
    }
    default: {
      arr = [twoOff, oneOff, center, oneOffR || oneOff, twoOffR || twoOff];
    }
  }

  return (i) => {
    return i >= len ? center : (arr[i] as T);
  };
}

const PopupSelector = ({ rangeMapping, onSelect }: PopupSelectorProps) => {
  if (!rangeMapping || !rangeMapping.length) return <></>;

  const getDelayByIndex = makeIndexGetter({
    center: 0 * AF,
    oneOff: 0.025 * AF,
    twoOff: 0.01 * AF,
    len: rangeMapping.length,
  });

  const getEaseByIndex = makeIndexGetter({
    center: [0.2, 0.2, 0.4, 1.1],
    oneOff: [0.2, 0.3, 0.4, 1.2],
    twoOff: [0, 0.4, 0.4, 1.1],
    len: rangeMapping.length,
  });

  const getDurationByIndex = makeIndexGetter({
    center: 0.175 * AF,
    oneOff: 0.22 * AF,
    twoOff: 0.325 * AF,
    len: rangeMapping.length,
  });

  const getYAnimation = makeIndexGetter({
    center: "0",
    oneOff: "100%",
    twoOff: "150%",
    oneOffR: "-100%",
    twoOffR: "-150%",
    len: rangeMapping.length,
  });

  const getZIndex = makeIndexGetter({
    center: 100,
    oneOff: 75,
    twoOff: 50,
    len: rangeMapping.length,
  });

  const panelH = Math.min(EMOJI_H * rangeMapping.length, EMOJI_H * 5);
  const scrollBar = rangeMapping.length > 5;

  return (
    <motion.div
      className={clsx(
        style.miniScrollbar,
        "relative flex cursor-pointer flex-col overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 dark:border-transparent dark:bg-neutral-800",
      )}
      initial={{ height: 0 }}
      animate={{ height: `${panelH}px` }}
      transition={{ duration: 0.3 * AF, ease: [0, 0, 0, 1.1] }}
    >
      <motion.div
        initial={{
          marginTop: `${panelH * -0.5}px`,
        }}
        animate={{ marginTop: "0" }}
        transition={{ duration: 0.3 * AF, ease: [0, 0, 0, 1.1] }}
        style={{ height: `${panelH}px` }}
        className={clsx(
          scrollBar && "customScrollBar overflow-x-hidden pl-0.5",
        )}
      >
        <AnimatePresence>
          {rangeMapping.map((v, index) => {
            return (
              <motion.div
                initial={{
                  translateY: getYAnimation(index),
                  scale: 0,
                }}
                animate={{
                  translateY: 0,
                  scale: 1,
                }}
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
                  "w-11  rounded-full px-2 text-center transition-colors hover:bg-lime-500",
                )}
                style={{
                  zIndex: getZIndex(index),
                  height: `${EMOJI_H}px`,
                  lineHeight: `${EMOJI_H}px`,
                }}
              >
                <div className="">{v.emoji}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const RangeClasses = cva(
  [
    "group w-full relative box-border flex items-center justify-center font-light transition-colors outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600",
  ],
  {
    variants: {
      inTrackRange: {
        true: "cursor-pointer border-neutral-200 dark:border-neutral-900",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800 border-transparent",
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
    ],
    defaultVariants: {
      style: "default",
    },
  },
);

export const DayCellRange = ({
  trackable,
  day,
  month,
  year,
  style,
}: IDayProps) => {
  const rangeLabelMapping = getRangeLabelMapping(trackable);

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
    [day, month, year, trackable.settings.startDate],
  );

  const [dayValue, setIsActive] = useOptimistic(
    trackable.data[dateKey],
    (_, value: string) => {
      return value;
    },
  );

  const em = dayValue ? (rangeLabelMapping[dayValue] as string) : "❓";

  const handleSelect = async (v: string) => {
    setIsSelecting(false);
    setIsActive(v);
    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: v,
    });
  };

  const visiblePart = (
    <button
      tabIndex={inTrackRange ? 0 : -1}
      className={RangeClasses({
        inTrackRange,
        style,
      })}
      disabled={!inTrackRange}
      key={day}
    >
      <DayNumber style={style} day={day} isToday={isToday} />

      {dayValue && <div className="text-xl">{em}</div>}
    </button>
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
