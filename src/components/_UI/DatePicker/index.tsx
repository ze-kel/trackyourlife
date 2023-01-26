import clsx from "clsx";
import {
  addMonths,
  format,
  getDaysInMonth,
  getISODay,
  isSameMonth,
  startOfMonth,
  clamp,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import IconChevronLeft from "@heroicons/react/20/solid/ChevronLeftIcon";
import IconChevronLeftDouble from "@heroicons/react/20/solid/ChevronDoubleLeftIcon";
import IconChevronDown from "@heroicons/react/20/solid/ChevronDownIcon";
import IconChevronRight from "@heroicons/react/20/solid/ChevronRightIcon";
import IconChevronRightDouble from "@heroicons/react/20/solid/ChevronDoubleRightIcon";

const DatePicker = ({
  date,
  onChange,
  limits = {
    start: new Date(2000, 0, 1),
    end: new Date(2040, 0, 1),
  },
  className,
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
  console.log(cursor);

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

  const open = () => {
    setIsOpened(true);
  };

  const highlightSeleted =
    date && isSameMonth(date, cursor) ? date.getDay() + 1 : -1;

  return (
    <div ref={calRef} className={clsx("relative", className)}>
      <div className="flex cursor-pointer" onClick={open}>
        {date ? format(date, "d MMMM yyyy") : "No date set"}{" "}
        <IconChevronDown
          className={clsx(
            "ml-1 w-6",
            isOpened && "rotate-180 transition-transform"
          )}
        />
      </div>

      {isOpened && (
        <div
          id="datePicker"
          className="absolute top-full z-10 my-1 flex w-fit flex-col rounded-sm border-2 border-neutral-900 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-900"
        >
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
                  isSameMonth(new Date(), cursor)
                    ? "opacity-50"
                    : "cursor-pointer"
                )}
                onClick={() => moveCursorMonths(1)}
              />
              <IconChevronRightDouble
                className={clsx(
                  "w-7",
                  isSameMonth(limits.end, cursor)
                    ? "opacity-50"
                    : "cursor-pointer"
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
                  "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors hover:border-lime-500",
                  el === highlightSeleted
                    ? "border-lime-500"
                    : "cursor-pointer border-transparent"
                )}
                key={`${cursor.getMonth()}-${el}`}
                onClick={() => recordDate(el)}
              >
                {el}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
