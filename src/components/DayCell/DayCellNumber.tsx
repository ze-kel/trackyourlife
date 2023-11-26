"use client";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import EditableText from "@components/EditableText";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, m } from "framer-motion";
import { makeColorString } from "src/helpers/colorTools";
import { cn } from "@/lib/utils";
import { useDayCellContextNumber } from "@components/Providers/DayCellProvider";

export const DayCellNumber = ({
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
  // Even though we're not using any values from context it's useful to check whether it's provided
  const { valueToColor, valueToProgressPercentage } = useDayCellContextNumber();

  const [displayedNumber, setDisplayedNumber] = useState(Number(value || 0));

  const [inInputEdit, setInInputEdit] = useState(false);

  const [isHover, setHover] = useState(false);

  const updateValue = async (value: number) => {
    if (onChange) {
      await onChange(String(value));
    }
  };

  const progress = valueToProgressPercentage(displayedNumber);

  const color = useMemo(() => {
    return valueToColor(displayedNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    updateValue,
  ]);

  const intervalRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalCounter = useRef(0);

  const mouseDown = (e: React.MouseEvent, direction: number) => {
    e.stopPropagation();
    e.preventDefault();

    setDisplayedNumber(displayedNumber + 1 * direction);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    intervalRef.current = setInterval(() => {
      intervalCounter.current++;
      setDisplayedNumber(
        displayedNumber + 1 * intervalCounter.current * direction,
      );
    }, 100);
  };

  const mouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      intervalCounter.current = 0;
    }
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
        "cursor-text",
        displayedNumber === 0
          ? "border-neutral-200 dark:border-neutral-900"
          : "border-[var(--themeLight)] dark:border-[var(--themeDark)]",
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
          "text-sm sm:text-xl",
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
                onMouseDown={(e) => mouseDown(e, 1)}
                onMouseUp={mouseUp}
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
                onMouseDown={(e) => mouseDown(e, -1)}
                onMouseUp={mouseUp}
                className=" h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
              />
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
