import type { MouseEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

import { clamp } from "@tyl/helpers";

import { cn } from "~/@shad";
import { useDayCellContextBoolean } from "~/components/Providers/DayCellProvider";

const ANIMATION_TIME = 0.3;
const EASE = [0, 0.2, 0.5, 1];

export const DayCellBoolean = ({
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
  // eslint-disable-next-line no-empty-pattern
  const {} = useDayCellContextBoolean();

  const isActive = value === "true";

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

    const newVal = isActive ? "false" : "true";

    // setIsActive(newVal === "true");
    if (onChange) {
      await onChange(newVal);
    }
  };

  return (
    <button
      data-value={isActive}
      ref={mainRef}
      tabIndex={0}
      className={cn(
        className,
        "transition-all ease-in-out",
        isActive
          ? "border-[var(--themeActiveLight)] hover:border-[var(--themeInactiveLight)] dark:border-[var(--themeActiveDark)] dark:hover:border-[var(--themeInactiveDark)]"
          : "border-[var(--themeInactiveLight)] hover:border-[var(--themeActiveLight)] dark:border-[var(--themeInactiveDark)] dark:hover:border-[var(--themeActiveDark)]",
      )}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => void handleClick(e)}
    >
      {/* This is a background layer with color we're animating from */}
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-full",
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
          className={cn(
            "absolute left-0 top-0 h-full w-full",
            isActive
              ? "bg-[var(--themeActiveLight)] dark:bg-[var(--themeActiveDark)]"
              : "bg-[var(--themeInactiveLight)] dark:bg-[var(--themeInactiveDark)]",
          )}
          style={{
            transformOrigin: `
              ${clickPoint[0] ?? 50}% ${clickPoint[1] ?? 50}%`,
          }}
        />
      </AnimatePresence>
      {children}
    </button>
  );
};
