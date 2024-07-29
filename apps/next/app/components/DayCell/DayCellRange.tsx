"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@tyl/ui";

import { PopupSelector } from "~/components/DayCell/PopupSelector";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "~/components/Dropdown";
import { useDayCellContextRange } from "~/components/Providers/DayCellProvider";

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
  const { labelMapping, labels, settings } = useDayCellContextRange();

  const [isSelecting, setIsSelecting] = useState(false);

  const [dayValue, setIsActive] = useState(value);

  const em = dayValue ? (labelMapping[dayValue] as string) : "❓";

  const handleSelect = async (v: string) => {
    setIsSelecting(false);
    setIsActive(v);
    if (onChange) {
      await onChange(v);
    }
  };

  const cycleNext = async () => {
    if (!labels || !labels.length || !onChange) return;

    const totalLabels = labels.length;
    const currentIndex = labels.findIndex((v) => v.internalKey === dayValue);

    if (!dayValue) {
      await onChange(labels[0]?.internalKey || "");
    } else if (currentIndex < 0) {
      await onChange(labels[0]?.internalKey || "");
    } else if (currentIndex === totalLabels - 1) {
      await onChange(settings.cycleToEmpty ? "" : labels[0]?.internalKey || "");
    } else {
      await onChange(labels[currentIndex + 1]?.internalKey || "");
    }
  };

  // m.div should be wrapped into AnimatePresence but it's currently bugged, waiting for some fix
  if (settings.isCycle) {
    return (
      <button
        tabIndex={0}
        className={cn(
          className,
          "flex items-center justify-center",
          "transition-colors",
          "relative",
          "cursor-pointer border-neutral-200 dark:border-neutral-900",
          "text-neutral-500 dark:text-neutral-700",
        )}
        onClick={() => void cycleNext()}
      >
        {children}

        <motion.div
          data-key={String(dayValue)}
          key={String(dayValue)}
          transition={{ duration: 0.4, ease: "circOut" }}
          className="text-xl"
        >
          {dayValue && em}
        </motion.div>
      </button>
    );
  }
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
              "text-neutral-500 dark:text-neutral-700",
            )}
          >
            {children}
            {dayValue && <div className="text-xl">{em}</div>}
          </button>
        </DropdownTrigger>
        <DropdownContent>
          <PopupSelector
            rangeMapping={labels}
            onSelect={(v) => void handleSelect(v)}
          />
        </DropdownContent>
      </Dropdown>
    </>
  );
};
