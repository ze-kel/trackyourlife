import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { format, getDaysInMonth, getISODay, getMonth, getYear } from "date-fns";
import { ErrorBoundary } from "react-error-boundary";

import { getNowInTimezone } from "@tyl/helpers/timezone";

import { cn } from "~/@shad";
import { Button } from "~/@shad/button";
import { useTrackableContextSafe } from "~/components/Providers/TrackableProvider";
import { YearSelector } from "~/components/TrackableView/yearSelector";
import { useUserSettings } from "~/query/userSettings";
import DayCellWrapper from "../DayCell";

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

const activeMonths = (year: number, now: Date) => {
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
  const settings = useUserSettings();

  const active = activeMonths(year, getNowInTimezone(settings.timezone));
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
          className="cursor-pointer rounded-md border border-transparent px-2 py-1 transition-colors disabled:pointer-events-none disabled:cursor-default data-[upcoming=true]:opacity-50"
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

const ViewController = ({
  year,
  setDates,
  month,
  increment,
  view,
  isCurrentMonth,
  openCurrentMonth,
}: {
  setDates: (year: TVDateValue, month: TVDateValue) => void;
  year: TVDateValue;
  month: TVDateValue;
  isCurrentMonth: boolean;
  view: TView;
  increment: (v: number) => void;
  openCurrentMonth: () => void;
}) => {
  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-baseline gap-2 self-center">
        <YearSelector
          value={typeof year === "number" ? year : undefined}
          onChange={(v) => setDates(v, month)}
        />

        {view === "days" &&
          typeof year === "number" &&
          typeof month === "number" && (
            <>
              <div className="pl-4 text-xl font-light text-neutral-200 dark:text-neutral-800">
                /
              </div>
              <Button
                name="months"
                variant="ghost"
                onClick={() => setDates(year, "list")}
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

type TView = "days" | "months";

export type TVDateValue = number | "list";

const TrackableView = ({
  year,
  month,
  setDates,
}: {
  year: TVDateValue;
  month: TVDateValue;
  setDates: (year: TVDateValue, month: TVDateValue) => void;
}) => {
  const settings = useUserSettings();

  const now = getNowInTimezone(settings.timezone);

  const view =
    typeof month !== "number" && typeof year === "number" ? "months" : "days";

  const isCurrentMonth = now.getMonth() === month && now.getFullYear() === year;

  const increment = (add: number) => {
    if (view === "months") {
      if (year === "list") return;
      setDates(year + add, month);
      return;
    }
    if (year === "list" || month === "list") return;

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
    setDates(newYear, newMonth);
  };

  const openMonth = (m: number) => {
    setDates(year, m);
  };

  const openCurrentMonth = () => {
    const now = getNowInTimezone(settings.timezone);
    setDates(now.getFullYear(), now.getMonth());
  };
  const { trackable } = useTrackableContextSafe();

  if (!trackable) {
    return <div></div>;
  }

  return (
    <>
      <ViewController
        year={year}
        month={month}
        isCurrentMonth={isCurrentMonth}
        view={view}
        openCurrentMonth={openCurrentMonth}
        setDates={setDates}
        increment={increment}
      />
      <ErrorBoundary
        fallbackRender={({ error }: { error: Error }) => {
          return <div>{error.message}</div>;
        }}
      >
        {view === "days" && (
          <Month year={year as number} month={month as number} />
        )}
        {view === "months" && (
          <Year year={year as number} openMonth={openMonth} />
        )}
      </ErrorBoundary>

      <ErrorBoundary fallback={<div></div>}></ErrorBoundary>
    </>
  );
};
/*
const StatsRouter = ({ year, month }: { year: number; month: number }) => {
  const { trackable } = useTrackableContextSafe();

  if (trackable?.type === "number")
    return <GraphWrapper year={year} month={month} />;

  return <></>;
};
*/

export default TrackableView;
