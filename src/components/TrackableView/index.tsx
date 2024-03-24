"use client";
import { getDaysInMonth, getISODay, getMonth, getYear, format } from "date-fns";
import { useEffect, useState } from "react";
import DayCellWrapper from "../DayCell";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import type { ITrackable } from "@t/trackable";
import TrackableProvider from "@components/Providers/TrackableProvider";
import { ErrorBoundary } from "react-error-boundary";
import { cn } from "@/lib/utils";

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
      className={cn(
        "grid gap-1",
        mini ? "grid-cols-7 grid-rows-6" : "grid-cols-7 grid-rows-6",
      )}
    >
      {prepend.map((_, i) => (
        <div key={i}> </div>
      ))}
      {dates.map((el) => (
        <DayCellWrapper
          key={`${month}-${el}`}
          year={year}
          month={month}
          day={el}
          labelType={mini ? "outside" : "auto"}
          className={mini ? "h-12" : "h-12 sm:h-14 md:h-16"}
        />
      ))}
    </div>
  );
};

const activeMonths = (year: number) => {
  const now = new Date();
  if (year < getYear(now)) {
    return 12;
  }
  if (year > getYear(now)) {
    return -1;
  }
  return getMonth(now);
};

const Year = ({
  year,
  openMonth,
}: {
  year: number;
  openMonth: (n: number) => void;
}) => {
  const active = activeMonths(year);
  const toRender = 12;

  const months = Array(toRender)
    .fill(0)
    .map((_, i) => i);

  return (
    <div className="my-4 grid gap-x-3 gap-y-2 md:grid-cols-2">
      {months.map((m) => (
        <div
          data-upcoming={m > active}
          key={`${year}-${m}`}
          className="cursor-pointer rounded-md border border-transparent px-2 py-1 transition-colors  disabled:pointer-events-none disabled:cursor-default data-[upcoming=true]:opacity-50"
          onClick={() => openMonth(m)}
        >
          <h5 className={cn("mb-1 text-left font-semibold transition-colors")}>
            <span>{format(new Date(year, m, 1), "MMMM")}</span>
          </h5>
          <Month year={year} month={m} mini={true} />
        </div>
      ))}
    </div>
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
    <div className="my-4 grid gap-x-3 gap-y-2 sm:grid-cols-2 md:grid-cols-4">
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

const ViewController = ({
  year,
  month,
  increment,
  view,
  setView,
  isCurrentMonth,
  openCurrentMonth,
}: {
  year?: number;
  month?: number;
  isCurrentMonth: boolean;
  view: TView;
  setView: (v: TView) => void;
  increment: (v: number) => void;
  openCurrentMonth: () => void;
}) => {
  return (
    <div className="mb-4 flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-baseline gap-2 self-center">
        {view !== "years" && (
          <Button name="year" variant="ghost" onClick={() => setView("years")}>
            {year}
          </Button>
        )}

        {view === "days" &&
          typeof year === "number" &&
          typeof month === "number" && (
            <>
              <div className="text-xl font-light text-neutral-200 dark:text-neutral-800">
                /
              </div>
              <Button
                name="months"
                variant="ghost"
                onClick={() => setView("months")}
              >
                {format(new Date(year, month, 1), "MMMM")}
              </Button>
            </>
          )}
      </div>
      <div className="flex w-fit gap-2 self-end">
        <Button
          aria-label="Previous month"
          onClick={() => increment(-1)}
          variant="outline"
          size="icon"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          aria-label="Next month"
          onClick={() => increment(1)}
          variant="outline"
          size="icon"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          aria-label="Current month"
          variant="outline"
          onClick={openCurrentMonth}
          disabled={isCurrentMonth}
        >
          Today
        </Button>
      </div>
    </div>
  );
};

type TView = "days" | "months" | "years";

const TrackableView = ({
  y,
  m,
  id,
}: {
  y?: number;
  m?: number;
  id: ITrackable["id"];
}) => {
  const now = new Date();
  const [year, setYear] = useState(
    typeof y === "number" ? y : new Date().getFullYear(),
  );
  const [month, setMonth] = useState(
    typeof m === "number" ? m : new Date().getMonth(),
  );
  const [view, setView] = useState<TView>("days");

  const [yearOffset, setyearOffset] = useState(0);

  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

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

  const openCurrentMonth = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setView("days");
  };

  useEffect(() => {
    let url;
    switch (view) {
      case "days":
        url = `/trackables/${id}/${year}/${month + 1}`;
        break;
      case "months":
        url = `/trackables/${id}/${year}`;
        break;
      case "years":
        url = `/trackables/${id}`;
        break;
    }
    if (url && url !== window.location.pathname) {
      window.history.pushState({}, "", url);
    }
  }, [view, year, month, id]);

  return (
    <TrackableProvider id={id}>
      <ViewController
        year={year}
        month={month}
        isCurrentMonth={isCurrentMonth}
        view={view}
        setView={setView}
        openCurrentMonth={openCurrentMonth}
        increment={increment}
      />
      <ErrorBoundary
        fallbackRender={({ error }: { error: Error }) => {
          return <div>{error.message}</div>;
        }}
      >
        {view === "days" && <Month year={year} month={month} />}
        {view === "months" && <Year year={year} openMonth={openMonth} />}
        {view === "years" && (
          <Decade yearOffset={yearOffset} openYear={openYear} />
        )}
      </ErrorBoundary>
    </TrackableProvider>
  );
};

export default TrackableView;
