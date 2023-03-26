import clsx from "clsx";
import {
  addMonths,
  format,
  getDaysInMonth,
  getISODay,
  isSameMonth,
  startOfMonth,
  clamp,
  isBefore,
  isAfter,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import IconChevronLeft from "@heroicons/react/20/solid/ChevronLeftIcon";
import IconChevronLeftDouble from "@heroicons/react/20/solid/ChevronDoubleLeftIcon";
import IconChevronDown from "@heroicons/react/20/solid/ChevronDownIcon";
import IconChevronRight from "@heroicons/react/20/solid/ChevronRightIcon";
import IconChevronRightDouble from "@heroicons/react/20/solid/ChevronDoubleRightIcon";
import Dropdown from "../Dropdown";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

const DatePicker = ({
  date,
  onChange,
  className,
  limits = {
    start: new Date(2000, 0, 1),
    end: new Date(2040, 0, 1),
  },
}: {
  date: Date | undefined;
  onChange: (d: Date) => void;
  limits: {
    start: Date;
    end: Date;
  };
  className?: string;
}) => {
  const calRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  const [cursor, setCursor] = useState(startOfMonth(date || new Date()));
  const [ref, bounds] = useMeasure();

  const toRender = getDaysInMonth(cursor);
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const [moveDirection, setMoveDirection] = useState(0);

  const moveCursorMonths = (n: number) => {
    const newDate = clamp(addMonths(cursor, n), limits);
    setCursor(newDate);
    setMoveDirection(n < 0 ? -1 : 1);
  };

  const recordDate = (day: number) => {
    if (!inLimit(day)) return;
    onChange(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    setIsOpened(false);
  };

  useEffect(() => {
    const closeChecker = (e: MouseEvent) => {
      if (e.target && calRef.current) {
        const t = e.target as Element;
        if (!calRef.current.contains(t)) {
          setIsOpened(false);
        }
      }
    };

    window.addEventListener("click", closeChecker);

    return () => {
      window.removeEventListener("click", closeChecker);
    };
  }, []);

  const inLimit = (day: number) => {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    if (isBefore(date, limits.start) || isAfter(date, limits.end)) return false;
    return true;
  };

  const highlightSeleted =
    date && isSameMonth(date, cursor) ? date.getDate() : -1;

  const variants = {
    enter: (d = 0) => {
      return { x: `${100 * d}%`, opacity: 0 };
    },
    middle: () => {
      return { x: "0%", opacity: 1 };
    },
    exit: (d = 0) => {
      return { x: `${-100 * d}%`, opacity: 0 };
    },
  };

  const calendar = (
    <motion.div
      animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="flex w-fit flex-col overflow-hidden"
    >
      <div ref={ref}>
        <div className="flex w-full items-center justify-between py-2">
          <div className="flex">
            <IconChevronLeftDouble
              className={clsx(
                "w-7",
                isSameMonth(limits.start, cursor)
                  ? "opacity-10"
                  : "cursor-pointer"
              )}
              onClick={() => moveCursorMonths(-12)}
            />
            <IconChevronLeft
              className={clsx(
                "w-7",
                isSameMonth(limits.start, cursor)
                  ? "opacity-10"
                  : "cursor-pointer"
              )}
              onClick={() => moveCursorMonths(-1)}
            />
          </div>
          <AnimatePresence
            mode="popLayout"
            initial={false}
            custom={moveDirection * 0.1}
          >
            <motion.div
              initial="enter"
              animate="middle"
              exit="exit"
              transition={{ duration: 0.15, ease: "easeInOut" }}
              variants={variants}
              custom={moveDirection * 0.1}
              key={cursor.toString()}
              className="pointer-events-none select-none whitespace-nowrap"
            >
              {format(cursor, "MMMM yyyy")}
            </motion.div>
          </AnimatePresence>
          <div className="flex">
            <IconChevronRight
              className={clsx(
                "w-7",
                isSameMonth(new Date(), cursor)
                  ? "opacity-10"
                  : "cursor-pointer"
              )}
              onClick={() => moveCursorMonths(1)}
            />
            <IconChevronRightDouble
              className={clsx(
                "w-7",
                isSameMonth(new Date(), cursor)
                  ? "opacity-10"
                  : "cursor-pointer"
              )}
              onClick={() => moveCursorMonths(12)}
            />
          </div>
        </div>

        <AnimatePresence
          mode="popLayout"
          initial={false}
          custom={moveDirection * 0.5}
        >
          <motion.div
            initial="enter"
            animate="middle"
            exit="exit"
            custom={moveDirection * 0.5}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={clsx("grid w-fit grid-cols-7 gap-1")}
            variants={variants}
            key={cursor.toString()}
          >
            {prepend.map((_, i) => (
              <div key={`${cursor.getMonth()}—prep—${i}`}></div>
            ))}
            {dates.map((el) => (
              <div
                className={clsx(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ",
                  el === highlightSeleted
                    ? "border-lime-500"
                    : "border-transparent",
                  inLimit(el)
                    ? "cursor-pointer hover:border-lime-500"
                    : "text-neutral-200 dark:text-neutral-800"
                )}
                key={`${cursor.getMonth()}-${el}`}
                onClick={() => recordDate(el)}
              >
                {el}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );

  const opener = (
    <div className="flex w-fit cursor-pointer border-2 border-neutral-400 px-2 py-1 transition-colors hover:border-neutral-600 dark:border-neutral-800 dark:hover:border-neutral-700">
      {date ? format(date, "d MMMM yyyy") : "No date set"}{" "}
      <IconChevronDown
        className={clsx(
          "ml-1 w-6",
          isOpened && "rotate-180 transition-transform"
        )}
      />
    </div>
  );

  return (
    <div className={clsx(className)}>
      <Dropdown
        mainPart={opener}
        hiddenPart={calendar}
        visible={isOpened}
        setVisible={setIsOpened}
        classNameMain={"w-fit"}
        placement="bottom-start"
      />
    </div>
  );
};

export default DatePicker;
