import type React from "react";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { format } from "date-fns";
import { useIsomorphicLayoutEffect, useMediaQuery } from "usehooks-ts";

import { debounce } from "@tyl/helpers";
import { makeColorString } from "@tyl/helpers/colorTools";

import { cn } from "~/@shad";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "~/@shad/drawer";
import { useDayCellContextNumber } from "~/components/Providers/DayCellProvider";

const getNumberSafe = (v: string | undefined) => {
  if (!v) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

export const NumberFormatter = new Intl.NumberFormat("en-US", {
  compactDisplay: "short",
  notation: "compact",
});

export const DayCellNumber = ({
  value,
  onChange,
  children,
  dateDay,
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children: ReactNode;
  dateDay: Date;
  className?: string;
}) => {
  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });

  const { valueToColor, valueToProgressPercentage } = useDayCellContextNumber();

  const [internalNumber, setInternalNumber] = useState(getNumberSafe(value));
  const [rawInput, setRawInput] = useState<string>(String(internalNumber));

  const [isEditing, setIsEditing] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (internalNumber !== getNumberSafe(value)) {
      setInternalNumber(getNumberSafe(value));
      if (!isEditing) {
        setRawInput(String(internalNumber));
      }
    }
  }, [value]);

  const internalUpdate = (val: number) => {
    setInternalNumber(val);
    void debouncedUpdateValue(val);
  };

  const isBigNumber = internalNumber >= 10000;

  const displayedValue = isBigNumber
    ? NumberFormatter.format(internalNumber)
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
      internalUpdate(numeric);
    }
  };

  const handleInputBlur = () => {
    if (String(internalNumber) !== rawInput) {
      setRawInput(String(internalNumber));
    }
    setDrawerOpen(false);
    setIsEditing(false);
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

  const [drawerOpen, setDrawerOpen] = useState(false);

  const focusHandler: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setIsEditing(true);
    if (internalNumber === 0) {
      e.target.setSelectionRange(0, rawInput.length);
    }
  };

  return (
    <div
      className={cn(
        className,
        "group items-center justify-center overflow-visible",
        "transition-all ease-in-out",
        "cursor-pointer",
        internalNumber === 0
          ? "border-neutral-200 dark:border-neutral-900"
          : "border-[var(--themeLight)] dark:border-[var(--themeDark)]",
        isEditing && "relative z-20",
      )}
      style={
        {
          "--themeLight": makeColorString(color.lightMode),
          "--themeDark": makeColorString(color.darkMode),
        } as CSSProperties
      }
    >
      {children}
      {progress !== null && (
        <div
          className={
            "z-1 absolute bottom-0 w-full bg-[var(--themeLight)] transition-all dark:bg-[var(--themeDark)]"
          }
          style={{ height: `${progress}%` }}
        ></div>
      )}

      {isDesktop ? (
        <>
          <div
            className={cn(
              "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold transition-all",
              internalNumber === 0
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              "text-xs @[4rem]:text-lg",
              "overflow-hidden",
              drawerOpen &&
                "outline outline-neutral-300 dark:outline-neutral-600",
            )}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {displayedValue}
          </div>
          <input
            inputMode={"decimal"}
            type={"text"}
            value={rawInput}
            className={cn(
              "absolute left-1/2 top-0 z-10 flex h-full w-full -translate-x-1/2 select-none items-center justify-center bg-inherit text-center font-semibold outline-none transition-all group-hover:opacity-100",
              internalNumber === 0
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              "text-xs @[4rem]:text-xl",
              "focus:absolute focus:w-[110%] focus:bg-neutral-50 group-hover:bg-neutral-50 focus:dark:bg-neutral-950 group-hover:dark:bg-neutral-950",
              "group-hover:outline-neutral-100 dark:group-hover:outline-neutral-600",
              "focus:outline-neutral-300 group-hover:focus:outline-neutral-300 dark:focus:outline-neutral-400 group-hover:dark:focus:outline-neutral-400",
              "selection:bg-neutral-300 dark:selection:bg-neutral-600",
              !isEditing ? "opacity-0" : "",
            )}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                const target = e.target as HTMLElement;
                target.blur();
              }
            }}
            onFocus={focusHandler}
            onChange={handleInput}
            onBlur={handleInputBlur}
          />
        </>
      ) : (
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          shouldScaleBackground={false}
          disablePreventScroll
        >
          <DrawerTrigger
            className={cn(
              "relative z-10 flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold transition-all",
              internalNumber === 0
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              "text-xs @[4rem]:text-lg",
              "overflow-hidden",
              drawerOpen &&
                "outline outline-neutral-300 dark:outline-neutral-600",
            )}
          >
            {displayedValue}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="m-auto mt-5">
              {format(dateDay, "d MMMM yyyy")}
            </DrawerTitle>
            <div className="p-6">
              <input
                autoFocus={true}
                inputMode={"decimal"}
                type={"text"}
                value={rawInput}
                className={cn(
                  "relative z-10 flex h-full w-full select-none items-center justify-center rounded bg-inherit text-center font-semibold outline-none transition-all",
                  internalNumber === 0
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
    </div>
  );
};
