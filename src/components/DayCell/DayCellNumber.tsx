"use client";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import clamp from "lodash/clamp";
import debounce from "lodash/debounce";
import EditableText from "@components/EditableText";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import type { INumberSettings } from "@t/trackable";
import { AnimatePresence, m } from "framer-motion";
import { presetsMap } from "@components/Colors/presets";
import { makeColorString } from "src/helpers/colorTools";
import { getColorAtPosition } from "@components/Colors/numberColorSelector";
import { cn } from "@/lib/utils";

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
  value,
  onChange,
  settings,
  children,
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  settings: INumberSettings;
  children: ReactNode;
  className?: string;
}) => {
  // Not using optimistic here because it resets when leaving hover for some reason
  const [displayedNumber, setDisplayedNumber] = useState(Number(value || 0));

  const [inInputEdit, setInInputEdit] = useState(false);

  const [isHover, setHover] = useState(false);

  const updateValue = async (value: number) => {
    if (onChange) {
      await onChange(String(value));
    }
  };

  const progress = getProgress(settings.limits, displayedNumber);

  const color = useMemo(() => {
    if (!settings.colorCoding || displayedNumber === 0) {
      return presetsMap.neutral;
    }
    return getColorAtPosition({
      value: settings.colorCoding,
      point: displayedNumber,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    updateValue,
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
      className={cn(
        className,
        "items-center justify-center overflow-visible",
        "transition-all ease-in-out",
        "cursor-text border-[var(--themeLight)] dark:border-[var(--themeDark)]",
      )}
      style={
        {
          "--themeLight": makeColorString(color.lightMode),
          "--themeDark": makeColorString(color.darkMode),
        } as CSSProperties
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {progress !== null && (
        <div
          className={
            "z-1 absolute bottom-0 w-full bg-[var(--themeLight)] transition-all dark:bg-[var(--themeDark)]"
          }
          style={{ height: `${progress}%` }}
        ></div>
      )}
      {children}
      <EditableText
        value={displayedNumber || 0}
        isNumber={true}
        updater={handleInputUpdate}
        saveOnChange={true}
        className={cn(
          "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
          displayedNumber === 0 && !inInputEdit
            ? "text-neutral-200 dark:text-neutral-800"
            : "text-neutral-800 dark:text-neutral-300",
          "text-xl",
        )}
        classNameInput="focus:outline-neutral-300 dark:focus:outline-neutral-600"
        editModeSetter={setInInputEdit}
      />
      <AnimatePresence>
        {!inInputEdit && isHover && (
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
              <PlusIcon
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
              <MinusIcon
                onClick={handleMinus}
                className=" h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
              />
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
