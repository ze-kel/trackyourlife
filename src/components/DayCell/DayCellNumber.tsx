"use client";
import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { AnimatePresence, m } from "framer-motion";
import { makeColorString } from "src/helpers/colorTools";
import { cn } from "@/lib/utils";
import { useDayCellContextNumber } from "@components/Providers/DayCellProvider";
import { isMobile } from "react-device-detect";

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

  const [inInputEdit] = useState(false);

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

  const mouseDownSign = (e: React.MouseEvent, direction: number) => {
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

  const mouseUpSign = (e: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      intervalCounter.current = 0;
    }
  };

  const handleInputUpdate = (val: number) => {
    console.log(val);
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
        "h-20",
      )}
      style={
        {
          "--themeLight": makeColorString(color.lightMode),
          "--themeDark": makeColorString(color.darkMode),
        } as CSSProperties
      }
      onMouseEnter={() => {
        if (!isMobile) setHover(true);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        mouseUpSign(e);
      }}
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

      <input
        inputMode={"decimal"}
        type={"number"}
        value={displayedNumber}
        className={cn(
          "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
          displayedNumber === 0 && !inInputEdit
            ? "text-neutral-200 dark:text-neutral-800"
            : "text-neutral-800 dark:text-neutral-300",
          "text-sm sm:text-xl",
          "focus:outline-neutral-300 dark:focus:outline-neutral-600",
        )}
        onChange={(e) => handleInputUpdate(e.target.valueAsNumber)}
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
                onMouseDown={(e) => mouseDownSign(e, 1)}
                onMouseUp={mouseUpSign}
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
                onMouseDown={(e) => mouseDownSign(e, -1)}
                onMouseUp={mouseUpSign}
                className=" h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
              />
            </m.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
