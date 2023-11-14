"use client";
import type { CSSProperties, MouseEvent } from "react";
import { useMemo, useRef, useState } from "react";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import cls from "clsx";
import { cva } from "class-variance-authority";
import { AnimatePresence, m } from "framer-motion";
import DayNumber from "@components/DayCell/dayNumber";
import clamp from "lodash/clamp";
import { useOptimistic } from "react";
import { RSAUpdateTrackable } from "src/app/api/trackables/serverActions";
import { presetsMap } from "@components/Colors/presets";
import { makeColorString } from "src/helpers/colorTools";

const BooleanClasses = cva(
  [
    "relative overflow-hidden border-transparent transition-all duration-400 ease-in-out select-none outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600",
  ],
  {
    variants: {
      style: {
        default: "h-16 border-2",
        mini: "h-6 border",
      },
      inTrackRange: {
        true: "cursor-pointer",
        false: "cursor-default bg-neutral-100 dark:bg-neutral-900",
      },
      active: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        active: false,
        inTrackRange: true,
        className:
          "border-[var(--themeInactiveLight)] hover:border-[var(--themeActiveLight)] dark:border-[var(--themeInactiveDark)] dark:hover:border-[var(--themeActiveDark)]",
      },
      {
        active: true,
        inTrackRange: true,
        className:
          "hover:border-[var(--themeInactiveLight)] border-[var(--themeActiveLight)] dark:hover:border-[var(--themeInactiveDark)] dark:border-[var(--themeActiveDark)]",
      },
    ],
    defaultVariants: {
      style: "default",
    },
  },
);

const ANIMATION_TIME = 0.3;
const EASE = [0, 0.2, 0.5, 1];

export const DayCellBoolean = ({
  trackable,
  day,
  month,
  year,
  style,
}: IDayProps) => {
  if (trackable.type !== "boolean") {
    throw new Error("Not boolena trackable passed to boolean dayCell");
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

  const [isActive, setIsActive] = useOptimistic(
    trackable.data[dateKey] === "true",
    (_, value: boolean) => {
      return value;
    },
  );

  const mainRef = useRef<HTMLButtonElement>(null);
  // Point where click happened in % relative to button box. Used for animation
  const [clickPoint, setClickPoint] = useState([50, 50]);
  // Ration between width and height of the box.
  const [whRatio, setWhRatio] = useState(1);

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mainRef.current) {
      const t = mainRef.current;
      const rect = t.getBoundingClientRect();
      if (e.clientX === 0 && e.clientY === 0) {
        // keyboard click
        setClickPoint([50, 50]);
      } else {
        const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
        setClickPoint([x * 100, y * 100]);
      }
      setWhRatio(rect.height / rect.width);
    } else {
      console.warn("DayCellBoolean animation error");
    }

    if (!inTrackRange) return;

    const newVal = isActive ? "false" : "true";

    setIsActive(newVal === "true");
    await RSAUpdateTrackable({
      id: trackable.id,
      day,
      month,
      year,
      value: newVal,
    });
  };

  const themeActive = trackable.settings.activeColor;
  const themeInactive = trackable.settings.inactiveColor;

  const activeLight = themeActive?.lightMode || presetsMap.green.lightMode;
  const activeDark = themeActive?.darkMode || presetsMap.green.darkMode;

  const inactiveLight =
    themeInactive?.lightMode || presetsMap.neutral.lightMode;
  const inactiveDark = themeInactive?.darkMode || presetsMap.neutral.darkMode;

  return (
    <button
      style={
        {
          "--themeActiveLight": makeColorString(activeLight),
          "--themeActiveDark": makeColorString(activeDark),
          "--themeInactiveLight": makeColorString(inactiveLight),
          "--themeInactiveDark": makeColorString(inactiveDark),
        } as CSSProperties
      }
      data-value={inTrackRange ? isActive : undefined}
      ref={mainRef}
      tabIndex={inTrackRange ? 0 : -1}
      className={cls(
        BooleanClasses({
          inTrackRange,
          active: isActive,
          style,
        }),
      )}
      disabled={!inTrackRange}
      key={day}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => void handleClick(e)}
    >
      {inTrackRange && (
        <>
          {/* This is a background layer with color we're animating from */}
          <div
            className={cls(
              "absolute left-0 top-0 h-full  w-full",
              isActive
                ? "bg-[var(--themeInactiveLight)] dark:bg-[var(--themeInactiveDark)]"
                : "bg-[var(--themeActiveLight)] dark:bg-[var(--themeActiveDark)]",
            )}
          ></div>
          {/* This is animating layer with with active color */}
          <AnimatePresence initial={false}>
            <m.div
              key={String(isActive)}
              initial={{
                scaleX: 0,
                scaleY: 0,
              }}
              animate={{
                scaleX: 1.2,
                scaleY: 1.2,
              }}
              transition={{
                duration: ANIMATION_TIME,
                ease: EASE,
                scaleY: {
                  duration: ANIMATION_TIME * whRatio,
                  ease: EASE,
                },
              }}
              className={cls(
                "absolute left-0 top-0 h-full  w-full",
                isActive
                  ? "bg-[var(--themeActiveLight)] dark:bg-[var(--themeActiveDark)]"
                  : "bg-[var(--themeInactiveLight)] dark:bg-[var(--themeInactiveDark)]",
              )}
              style={{
                transformOrigin: `
              ${clickPoint[0] || 50}% ${clickPoint[1] || 50}%`,
              }}
            />
          </AnimatePresence>
        </>
      )}

      <DayNumber style={style} day={day} isToday={isToday} />
    </button>
  );
};
