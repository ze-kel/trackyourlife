"use client";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@components/Dropdown";
import type { ReactNode } from "react";
import { useState } from "react";
import style from "./customScrollbar.module.css";

import type { IRangeSettings } from "@t/trackable";
import { AnimatePresence, m } from "framer-motion";
import { useOptimistic } from "react";
import { cn } from "@/lib/utils";
import { useDayCellContextRange } from "@components/Providers/DayCellProvider";

interface PopupSelectorProps {
  rangeMapping: IRangeSettings["labels"];
  onSelect: (v: string) => void;
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
    <m.div
      className={cn(
        style.miniScrollbar,
        "relative flex cursor-pointer flex-col overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 dark:border-transparent dark:bg-neutral-800",
      )}
      initial={{ height: 0 }}
      animate={{ height: `${panelH}px` }}
      transition={{ duration: 0.3 * AF, ease: [0, 0, 0, 1.1] }}
    >
      <m.div
        initial={{
          marginTop: `${panelH * -0.5}px`,
        }}
        animate={{ marginTop: "0" }}
        transition={{ duration: 0.3 * AF, ease: [0, 0, 0, 1.1] }}
        style={{ height: `${panelH}px` }}
        className={cn(scrollBar && "customScrollBar overflow-x-hidden pl-0.5")}
      >
        <AnimatePresence>
          {rangeMapping.map((v, index) => {
            return (
              <m.div
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
                onClick={() => {
                  void onSelect(v.internalKey);
                }}
                className={cn(
                  "w-11  rounded-full px-2 text-center transition-colors hover:bg-lime-500",
                )}
                style={{
                  zIndex: getZIndex(index),
                  height: `${EMOJI_H}px`,
                  lineHeight: `${EMOJI_H}px`,
                }}
              >
                <div className="">{v.emoji}</div>
              </m.div>
            );
          })}
        </AnimatePresence>
      </m.div>
    </m.div>
  );
};

export const DayCellRange = ({
  value,
  onChange,
  children,
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children: ReactNode;
  className?: string;
}) => {
  const { labelMapping, labels } = useDayCellContextRange();

  const [isSelecting, setIsSelecting] = useState(false);

  const [dayValue, setIsActive] = useOptimistic(value, (_, value: string) => {
    return value;
  });

  const em = dayValue ? (labelMapping[dayValue] as string) : "❓";

  const handleSelect = async (v: string) => {
    setIsSelecting(false);
    setIsActive(v);
    if (onChange) {
      await onChange(v);
    }
  };

  return (
    <>
      <Dropdown
        open={isSelecting}
        onOpenChange={setIsSelecting}
        background={false}
        placeCenter={true}
      >
        <DropdownTrigger>
          <button
            tabIndex={0}
            className={cn(
              className,
              "flex items-center justify-center",
              "transition-colors",
              "cursor-pointer border-neutral-200 dark:border-neutral-900",
              "text-neutral-500  dark:text-neutral-700",
            )}
          >
            {children}
            {dayValue && <div className="text-xl">{em}</div>}
          </button>
        </DropdownTrigger>
        <DropdownContent disableMobileAdaptation>
          <PopupSelector
            rangeMapping={labels}
            onSelect={(v) => void handleSelect(v)}
          />
        </DropdownContent>
      </Dropdown>
    </>
  );
};
