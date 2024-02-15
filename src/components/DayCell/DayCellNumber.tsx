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
import { useMediaQuery } from "usehooks-ts";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const getNumberSafe = (v: string | undefined) => {
  if (!v) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

// To enable when https://github.com/emilkowalski/vaul/pull/258 is merged
const useDrawerEditor = false;

export const DayCellNumber = ({
  value,
  onChange,
  children,
  dateString,
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children: ReactNode;
  dateString: string;
  className?: string;
}) => {
  const isTouch = useMediaQuery("(hover: none)");
  const isDesktop = useMediaQuery("(min-width:768px)");

  const { valueToColor, valueToProgressPercentage } = useDayCellContextNumber();

  const [internalNumber, setInternalNumber] = useState(getNumberSafe(value));
  const [rawInput, setRawInput] = useState<string>(String(internalNumber));
  const [inInputEdit] = useState(false);
  const [isHover, setHover] = useState(false);

  const isBigNumber = internalNumber > 10000;

  const formatter = new Intl.NumberFormat(
    (typeof navigator !== "undefined" && navigator.languages[0]) || "en-IN",
    {
      compactDisplay: "short",
      notation: "compact",
    },
  );

  const displayedValue = isBigNumber
    ? formatter.format(internalNumber)
    : internalNumber;

  const updateValue = async (value: number) => {
    if (onChange) {
      await onChange(String(value));
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    //
    // This is needed to force decimal points to be "."
    // We need to force them because otherwise decimal input is bugged in safari
    // for people who have a language and region mismatch(i.e region with 30.2 convention an language with 30,2 convention).
    // So ios keyboard might show , as a separator, but browser will say that for value 30,2 valueasnumber is NaN
    // https://github.com/home-assistant/frontend/pull/18268#issuecomment-1769182417
    // For the same reason  input type is set to text, because otherwise it will not allow input with wrong decimal
    //
    const replaced = value.replace(",", ".");
    setRawInput(replaced);
    const numeric = Number(replaced);

    if (!Number.isNaN(numeric)) {
      setInternalNumber(numeric);
      void debouncedUpdateValue(numeric);
    }
  };

  const handleInputBlur = () => {
    if (String(internalNumber) !== rawInput) {
      setRawInput(String(internalNumber));
    }

    if (!isDesktop) {
      setDrawerOpen(false);
    }
  };

  const progress = valueToProgressPercentage(internalNumber);

  const color = useMemo(() => {
    return valueToColor(internalNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalNumber]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    updateValue,
  ]);

  const intervalRef = useRef<ReturnType<typeof setTimeout>>();
  const intervalCounter = useRef(0);

  const mouseDownSign = (e: React.MouseEvent, direction: number) => {
    e.stopPropagation();
    e.preventDefault();

    const v = internalNumber + 1 * direction;
    setInternalNumber(v);
    setRawInput(String(v));

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }

    intervalRef.current = setInterval(() => {
      intervalCounter.current++;
      const v = internalNumber + 1 * intervalCounter.current * direction;
      setInternalNumber(v);
      setRawInput(String(v));
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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = (e) => {
    if (internalNumber === 0) {
      e.target.setSelectionRange(0, rawInput.length);
    }
  };

  return (
    <div
      className={cn(
        className,
        "items-center justify-center overflow-visible",
        "transition-all ease-in-out",
        "cursor-text",
        internalNumber === 0
          ? "border-neutral-200 dark:border-neutral-900"
          : "border-[var(--themeLight)] dark:border-[var(--themeDark)]",
      )}
      style={
        {
          "--themeLight": makeColorString(color.lightMode),
          "--themeDark": makeColorString(color.darkMode),
        } as CSSProperties
      }
      onMouseEnter={() => {
        if (!isTouch) setHover(true);
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

      {isDesktop || !useDrawerEditor ? (
        <input
          inputMode={"decimal"}
          type={"text"}
          value={rawInput}
          className={cn(
            "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
            internalNumber === 0 && !inInputEdit
              ? "text-neutral-200 dark:text-neutral-800"
              : "text-neutral-800 dark:text-neutral-300",
            "text-sm sm:text-xl",
            "focus:outline-neutral-300 dark:focus:outline-neutral-600",
            "selection:bg-neutral-300 dark:selection:bg-neutral-600",
          )}
          onFocus={focusHandler}
          onChange={handleInput}
          onBlur={handleInputBlur}
        />
      ) : (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          shouldScaleBackground={false}
          modal
        >
          <DrawerTrigger
            className={cn(
              "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold transition-all",
              internalNumber === 0 && !inInputEdit
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              "text-sm sm:text-xl",
              "overflow-hidden",
              drawerOpen && "outline-neutral-300 dark:outline-neutral-600",
            )}
          >
            {displayedValue}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="m-auto mt-5">{dateString}</DrawerTitle>
            <div className="p-6">
              <input
                autoFocus={true}
                inputMode={"decimal"}
                type={"text"}
                value={rawInput}
                className={cn(
                  "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all",
                  internalNumber === 0 && !inInputEdit
                    ? "text-neutral-200 dark:text-neutral-800"
                    : "text-neutral-800 dark:text-neutral-300",
                  "text-2xl",
                  "h-20 focus:outline-neutral-300 dark:focus:outline-neutral-600",
                )}
                onFocus={focusHandler}
                onChange={handleInput}
                onBlur={handleInputBlur}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

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
