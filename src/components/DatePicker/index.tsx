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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Dropdown, DropdownContent, DropdownTrigger } from "../Dropdown";
import { AnimatePresence, m } from "framer-motion";
import useMeasure from "react-use-measure";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";

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
  const [innerDate, setInnerDate] = useState(date);

  const calRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  const [cursor, setCursor] = useState(startOfMonth(innerDate || new Date()));
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
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    setInnerDate(d);
    onChange(d);
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

  const highlightSelected =
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

  return (
    <div className={className}>
      <Dropdown
        open={isOpened}
        onOpenChange={setIsOpened}
        placement="bottom-start"
      >
        <DropdownTrigger>
          <Button variant={"outline"} className="min-w-[200px]">
            <span className="">
              {innerDate ? format(innerDate, "d MMMM yyyy") : "No date set"}
            </span>
            <CalendarIcon className="ml-auto h-4 w-4 " />
          </Button>
        </DropdownTrigger>

        <DropdownContent>
          <m.div
            ref={ref}
            animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="flex w-full flex-col items-center overflow-hidden md:w-fit"
          >
            <div className="flex w-full items-center justify-between py-2">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSameMonth(limits.start, cursor)}
                  onClick={() => moveCursorMonths(-12)}
                >
                  <DoubleArrowLeftIcon className="w-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSameMonth(limits.start, cursor)}
                  onClick={() => moveCursorMonths(-1)}
                >
                  <ChevronLeftIcon className="w-7" />
                </Button>
              </div>
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={moveDirection * 0.1}
              >
                <m.div
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
                </m.div>
              </AnimatePresence>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSameMonth(new Date(), cursor)}
                  onClick={() => moveCursorMonths(1)}
                >
                  <ChevronRightIcon className="w-7" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSameMonth(new Date(), cursor)}
                  onClick={() => moveCursorMonths(12)}
                >
                  <DoubleArrowRightIcon className="w-7" />
                </Button>
              </div>
            </div>

            <AnimatePresence
              mode="popLayout"
              initial={false}
              custom={moveDirection * 0.5}
            >
              <m.div
                initial="enter"
                animate="middle"
                exit="exit"
                custom={moveDirection * 0.5}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                variants={variants}
                key={cursor.toString()}
              >
                {prepend.map((_, i) => (
                  <div key={`${cursor.getMonth()}—prep—${i}`}></div>
                ))}
                {dates.map((el) => (
                  <Button
                    className="h-9 sm:w-9"
                    disabled={!inLimit(el)}
                    variant={el === highlightSelected ? "default" : "ghost"}
                    key={`${cursor.getMonth()}-${el}`}
                    onClick={() => recordDate(el)}
                  >
                    {el}
                  </Button>
                ))}
              </m.div>
            </AnimatePresence>
          </m.div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
};

export default DatePicker;
