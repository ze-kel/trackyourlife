import { useContext, useEffect, useRef, useState } from "react";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@shad/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerMobileTitleContext,
  DrawerTitle,
  DrawerTrigger,
} from "@shad/drawer";
import { cn } from "@shad/utils";
import {
  addMonths,
  clamp,
  format,
  getDaysInMonth,
  getISODay,
  isAfter,
  isBefore,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import { AnimatePresence, m } from "framer-motion";
import { useResizeObserver } from "usehooks-ts";

import { getNowInTimezone } from "@tyl/helpers/timezone";

import { useUserSettings } from "~/query/userSettings";
import { useIsDesktop } from "~/utils/useIsDesktop";
import { Dropdown, DropdownContent, DropdownTrigger } from "../Dropdown";

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
  const settings = useUserSettings();
  const dateNow = getNowInTimezone(settings.timezone);

  const [innerDate, setInnerDate] = useState(date);

  const calRef = useRef<HTMLDivElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  const [cursor, setCursor] = useState(startOfMonth(innerDate ?? dateNow));

  const wrapRef = useRef(null);

  const { height } = useResizeObserver({ ref: wrapRef });

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
    innerDate && isSameMonth(innerDate, cursor) ? innerDate.getDate() : -1;

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

  const Trigger = (
    <div
      className={cn(buttonVariants({ variant: "outline" }), "min-w-[200px]")}
    >
      <span className="">
        {innerDate ? format(innerDate, "d MMMM yyyy") : "No date set"}
      </span>
      <CalendarIcon className="ml-auto h-4 w-4" />
    </div>
  );

  const Content = (
    <m.div
      animate={{ height: height }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="flex w-full flex-col items-center overflow-hidden md:w-fit"
    >
      <div ref={wrapRef}>
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
              disabled={isSameMonth(dateNow, cursor)}
              onClick={() => moveCursorMonths(1)}
            >
              <ChevronRightIcon className="w-7" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              disabled={isSameMonth(dateNow, cursor)}
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
            className={"grid w-fit grid-cols-7 gap-1"}
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
      </div>
    </m.div>
  );

  const isDesktop = useIsDesktop();

  const mobileTitle = useContext(DrawerMobileTitleContext);

  if (isDesktop) {
    return (
      <div className={className}>
        <Dropdown
          open={isOpened}
          onOpenChange={setIsOpened}
          placement="bottom-start"
        >
          <DropdownTrigger className="w-fit">{Trigger}</DropdownTrigger>
          <DropdownContent>{Content}</DropdownContent>
        </Dropdown>
      </div>
    );
  }

  return (
    <div className={className}>
      <Drawer onOpenChange={setIsOpened} open={isOpened}>
        <DrawerTrigger>{Trigger}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            {mobileTitle && <DrawerTitle>{mobileTitle}</DrawerTitle>}
          </DrawerHeader>
          <div className="m-auto w-fit pb-4">{Content}</div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DatePicker;
