import { getDaysInMonth, getISODay, getMonth, getYear, format } from "date-fns";
import { useState } from "react";
import DayCell from "../DayCell";
import IconChevronLeft from "@heroicons/react/20/solid/ChevronLeftIcon";
import IconChevronRight from "@heroicons/react/20/solid/ChevronRightIcon";
import clsx from "clsx";

const Month = ({
  month,
  year,
  mini,
}: {
  month: number;
  year: number;
  mini?: boolean;
}) => {
  const toRender = getDaysInMonth(new Date(year, month));
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = new Date(year, month, 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const myId = `${year}-${month}`;

  return (
    <div
      id={myId}
      className={clsx(
        "grid grid-cols-7 grid-rows-6",
        mini ? "gap-1" : "sm:gap-2 lg:gap-2"
      )}
    >
      {prepend.map((_, i) => (
        <div key={i}> </div>
      ))}
      {dates.map((el) => (
        <DayCell
          key={`${month}-${el}`}
          year={year}
          month={month}
          day={el}
          style={mini ? "mini" : undefined}
        />
      ))}
    </div>
  );
};

const monthsBeforeToday = (year: number) => {
  const now = new Date();
  if (year < getYear(now)) {
    return 12;
  }
  // getMonth is zero indexed, so Jan is 0
  return getMonth(now) + 1;
};

const Year = ({
  year,
  openMonth,
}: {
  year: number;
  openMonth: (n: number) => void;
}) => {
  const active = monthsBeforeToday(year);
  const toRender = 12;

  const months = Array(toRender)
    .fill(0)
    .map((_, i) => i);

  return (
    <>
      <div className="my-4 grid gap-y-2 gap-x-3 sm:grid-cols-2 md:grid-cols-4">
        {months.map((m) => (
          <div
            key={`${year}-${m}`}
            className="group cursor-pointer rounded-md border border-transparent px-2 py-1 transition-colors hover:border-neutral-200 dark:hover:border-neutral-700"
            onClick={() => openMonth(m)}
          >
            <h5
              className={clsx(
                "mb-1 font-semibold transition-colors",
                m < active
                  ? "text-neutral-600 group-hover:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200"
                  : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-700 dark:group-hover:text-neutral-500"
              )}
            >
              <span>{format(new Date(year, m, 1), "MMMM")}</span>
            </h5>
            <Month year={year} month={m} mini={true} />
          </div>
        ))}
      </div>
    </>
  );
};

const YEARS_ON_YEAR_VIEW = 12;

const Decade = ({
  yearOffset,
  openYear,
}: {
  yearOffset: number;
  openYear: (y: number) => void;
}) => {
  const currentYear = new Date().getFullYear();
  const startAt = currentYear - YEARS_ON_YEAR_VIEW + yearOffset + 1;

  const years = Array(YEARS_ON_YEAR_VIEW)
    .fill(0)
    .map((_, i) => startAt + i);

  return (
    <div className="my-4 grid gap-y-2 gap-x-3 sm:grid-cols-2 md:grid-cols-4">
      {years.map((y) => (
        <div
          onClick={() => openYear(y)}
          className="flex cursor-pointer items-center justify-center border border-neutral-100 p-5 transition-colors hover:border-neutral-200 dark:border-neutral-800 dark:hover:border-neutral-500"
          key={y}
        >
          {y}
        </div>
      ))}
    </div>
  );
};

type TView = "days" | "months" | "years";

const TrackableView = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [view, setView] = useState<TView>("days");

  const [yearOffset, setyearOffset] = useState(0);

  const increment = (add: number) => {
    if (view === "years") {
      setyearOffset(yearOffset + add * YEARS_ON_YEAR_VIEW);
      return;
    }

    if (view === "months") {
      setYear(year + add);
      return;
    }

    let newMonth = month + add;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = year - 1;
    }
    if (newMonth > 11) {
      newMonth = 0;
      newYear = year + 1;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  const openMonth = (m: number) => {
    setMonth(m);
    setView("days");
  };

  const openYear = (y: number) => {
    setYear(y);
    setView("months");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <>
          <div
            onClick={() => increment(-1)}
            className="flex w-6 cursor-pointer rounded-full border p-0.5 transition-colors dark:border-neutral-500 dark:hover:border-neutral-50"
          >
            <IconChevronLeft className="-translate-x-[1px]" />
          </div>
          <div
            onClick={() => increment(1)}
            className="flex w-6 cursor-pointer rounded-full border p-0.5 transition-colors dark:border-neutral-500 dark:hover:border-neutral-50"
          >
            <IconChevronRight className="translate-x-[1px]" />
          </div>
        </>
        {view !== "years" && (
          <span
            onClick={() => setView("years")}
            className="cursor-pointer font-semibold"
          >
            {year}
          </span>
        )}

        {view === "days" && (
          <>
            /
            <span onClick={() => setView("months")} className="cursor-pointer">
              {format(new Date(year, month, 1), "MMMM")}
            </span>
          </>
        )}
      </div>
      {view === "days" && <Month year={year} month={month} />}
      {view === "months" && <Year year={year} openMonth={openMonth} />}
      {view === "years" && (
        <Decade yearOffset={yearOffset} openYear={openYear} />
      )}
    </>
  );
};

export default TrackableView;
