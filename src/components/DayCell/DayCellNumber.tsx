"use client";
import cls from "clsx";
import type React from "react";
import type { CSSProperties } from "react";
import { useCallback, useMemo, useState } from "react";
import clamp from "lodash/clamp";
import debounce from "lodash/debounce";
import EditableText from "@components/_UI/EditableText";
import IconPlus from "@heroicons/react/24/outline/PlusIcon";
import IconMinus from "@heroicons/react/24/outline/MinusIcon";
import { cva } from "class-variance-authority";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import type { INumberSettings } from "@t/trackable";
import { AnimatePresence, m } from "framer-motion";
import DayNumber from "@components/DayCell/dayNumber";
import { RSAUpdateTrackable } from "src/app/api/trackables/serverActions";
import { presetsMap } from "@components/_UI/ColorPicker/presets";
import { makeColorString } from "src/helpers/colorTools";
import { getColorAtPosition } from "@components/TrackableSettings/numberColorSelector";

const NumberClasses = cva(
  ["group relative items-center justify-center font-light transition-colors"],
  {
    variants: {
      style: {
        default: "h-16 border-2",
        mini: "border h-6",
      },
      inTrackRange: {
        true: "cursor-text border-[var(--themeLight)] dark:border-[var(--themeDark)]",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800",
      },
    },
    compoundVariants: [
      {
        inTrackRange: false,
        className: "border-transparent",
      },
    ],

    defaultVariants: {
      style: "default",
    },
  },
);

const getProgress = (
  limits: INumberSettings["limits"],
  val: number | undefined,
) => {
  if (
    !limits ||
    !limits.showProgress ||
    typeof limits.max === "undefined" ||
    typeof limits.min === "undefined" ||
    typeof val === "undefined"
  ) {
    return null;
  }
  return Math.round(
    (clamp(val, limits.min, limits.max) / (limits.max - limits.min)) * 100,
  );
};

export const DayCellNumber = ({
  trackable,
  day,
  month,
  year,
  style,
}: IDayProps) => {
  if (trackable.type !== "number") {
    throw new Error("Not number trackable passed to number dayCell");
  }

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

  // Not using optimistic here because it resets when leaving hover for some reason
  const [displayedNumber, setDisplayedNumber] = useState(
    Number(trackable.data[dateKey] || 0),
  );

  const [inInputEdit, setInInputEdit] = useState(false);

  const [isHover, setHover] = useState(false);

  const updateValue = async (value: number) => {
    setDisplayedNumber(value);
    await RSAUpdateTrackable({
      id: trackable.id,
      day,
      month,
      year,
      value: String(value),
    });
  };

  const progress = getProgress(trackable.settings.limits, displayedNumber);

  const color = useMemo(() => {
    if (!trackable.settings.colorCoding) {
      return presetsMap.neutral;
    }
    return getColorAtPosition({
      value: trackable.settings.colorCoding,
      point: displayedNumber,
    });
  }, [displayedNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    day,
    month,
    year,
  ]);

  const handlePlus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDisplayedNumber(displayedNumber + 1);
    void debouncedUpdateValue(displayedNumber + 1);
  };
  const handleMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDisplayedNumber(displayedNumber - 1);
    void debouncedUpdateValue(displayedNumber - 1);
  };

  const handleInputUpdate = (val: number) => {
    if (val !== displayedNumber) {
      setDisplayedNumber(val);
      void debouncedUpdateValue(val);
    }
  };
  return (
    <div
      className={NumberClasses({
        inTrackRange,
        style,
      })}
      style={
        {
          "--themeLight": makeColorString(color.lightMode),
          "--themeDark": makeColorString(color.darkMode),
        } as CSSProperties
      }
      key={day}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {progress !== null && (
        <div
          className={cls(
            "z-1 absolute bottom-0 w-full bg-[var(--themeLight)] transition-all dark:bg-[var(--themeDark)]",
          )}
          style={{ height: `${progress}%` }}
        ></div>
      )}

      <DayNumber style={style} day={day} isToday={isToday} />
      {inTrackRange && (
        <>
          <EditableText
            value={displayedNumber || 0}
            isNumber={true}
            updater={handleInputUpdate}
            saveOnChange={true}
            className={cls(
              "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
              displayedNumber === 0 && !inInputEdit
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              style === "mini" ? "text-xs" : "text-xl",
            )}
            classNameInput="focus:outline-neutral-300 dark:focus:outline-neutral-600"
            editModeSetter={setInInputEdit}
          />
          <AnimatePresence>
            {!inInputEdit && isHover && style !== "mini" && (
              <>
                <m.div
                  className="absolute left-[50%] top-0 z-20"
                  initial={{
                    opacity: 0,
                    translateY: "-25%",
                    translateX: "-50%",
                  }}
                  animate={{
                    opacity: 1,
                    translateY: "-50%",
                  }}
                  exit={{ opacity: 0, translateY: "-25%" }}
                  transition={{ duration: 0.2, opacity: { duration: 0.1 } }}
                >
                  <IconPlus
                    onClick={handlePlus}
                    className="h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
                  />
                </m.div>
                <m.div
                  className="absolute bottom-0 left-[50%] z-20"
                  initial={{
                    opacity: 0,
                    translateY: "25%",
                    translateX: "-50%",
                  }}
                  animate={{
                    opacity: 1,
                    translateY: "50%",
                  }}
                  exit={{ opacity: 0, translateY: "25%" }}
                  transition={{ duration: 0.2, opacity: { duration: 0.1 } }}
                >
                  <IconMinus
                    onClick={handleMinus}
                    className=" h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
                  />
                </m.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
