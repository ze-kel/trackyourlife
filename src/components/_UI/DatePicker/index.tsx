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

  const toRender = getDaysInMonth(cursor);
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const moveCursorMonths = (n: number) => {
    const newDate = clamp(addMonths(cursor, n), limits);
    setCursor(newDate);
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

  const calendar = (
    <div id="datePicker" className="flex w-fit flex-col">
      <div className="flex w-full items-center justify-between py-2">
        <div className="flex">
          <IconChevronLeftDouble
            className={clsx(
              "w-7",
              isSameMonth(limits.start, cursor)
                ? "opacity-50"
                : "cursor-pointer"
            )}
            onClick={() => moveCursorMonths(-12)}
          />
          <IconChevronLeft
            className={clsx(
              "w-7",
              isSameMonth(limits.start, cursor)
                ? "opacity-50"
                : "cursor-pointer"
            )}
            onClick={() => moveCursorMonths(-1)}
          />
        </div>
        <div className="select-none">{format(cursor, "MMMM yyyy")}</div>
        <div className="flex">
          <IconChevronRight
            className={clsx(
              "w-7",
              isSameMonth(new Date(), cursor) ? "opacity-50" : "cursor-pointer"
            )}
            onClick={() => moveCursorMonths(1)}
          />
          <IconChevronRightDouble
            className={clsx(
              "w-7",
              isSameMonth(limits.end, cursor) ? "opacity-50" : "cursor-pointer"
            )}
            onClick={() => moveCursorMonths(12)}
          />
        </div>
      </div>
      <div className={clsx("grid w-fit grid-cols-7 grid-rows-6 gap-1")}>
        {prepend.map((_, i) => (
          <div key={i}></div>
        ))}
        {dates.map((el) => (
          <div
            className={clsx(
              "flex h-9 w-9 items-center justify-center rounded-full border-2 border-transparent transition-colors ",
              el === highlightSeleted ? "border-lime-500" : "",
              inLimit(el)
                ? "cursor-pointer border-transparent hover:border-lime-500"
                : "dark:text-neutral-800"
            )}
            key={`${cursor.getMonth()}-${el}`}
            onClick={() => recordDate(el)}
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );

  const opener = (
    <div className="flex w-fit cursor-pointer border-2 border-neutral-400 px-2 py-1 dark:border-neutral-800">
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
      />
    </div>
  );
};

export default DatePicker;
