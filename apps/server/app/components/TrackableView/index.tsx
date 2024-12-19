import { cn } from "@shad/utils";
import { Link } from "@tanstack/react-router";
import {
  addMonths,
  endOfYear,
  format,
  getDaysInMonth,
  getISODay,
  getMonth,
  getYear,
  lastDayOfMonth,
  startOfYear,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

import { getGMTWithTimezoneOffset } from "@tyl/helpers/timezone";

import { Button } from "~/@shad/components/button";
import { useTrackableMeta } from "~/components/Providers/TrackableProvider";
import { useUserSafe } from "~/components/Providers/UserContext";
import { TrackableNoteEditable } from "~/components/TrackableNote";
import { YearSelector } from "~/components/TrackableView/yearSelector";
import { Route } from "~/routes/app/trackables/$id/view";
import { useZ, useZeroTrackableData } from "~/utils/useZ";
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
  const { id, type } = useTrackableMeta();
  const toRender = getDaysInMonth(new Date(year, month));
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = new Date(year, month, 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const myId = `${year}-${month}`;

  const [data, dataInfo] = useZeroTrackableData({
    id,
    firstDay: firstDayDate,
    lastDay: lastDayOfMonth(firstDayDate),
  });

  return (
    <>
      {JSON.stringify(dataInfo)} {data.length} {firstDayDate.getTime()}{" "}
      {lastDayOfMonth(firstDayDate).getTime()}
      <div
        id={myId}
        className={cn("grid gap-1", mini ? "grid-cols-7" : "grid-cols-7")}
      >
        {prepend.map((_, i) => (
          <div key={i}> </div>
        ))}
        {dates.map((el) => {
          const date = new Date(Date.UTC(year, month, el));

          const value = data?.find((r) => r.date === date.getTime())?.value;

          return (
            <DayCellWrapper
              id={id}
              key={`${id}-${month}-${el}`}
              value={value}
              type={type}
              date={date}
              labelType={mini ? "outside" : "auto"}
              className={mini ? "h-12" : "h-12 sm:h-14 md:h-16"}
            />
          );
        })}
      </div>
    </>
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
  const { settings } = useUserSafe();
  const { id } = useTrackableMeta();

  const active = activeMonths(
    year,
    getGMTWithTimezoneOffset(settings.timezone),
  );
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
        >
          <h5
            onClick={() => openMonth(m)}
            className={cn("mb-1 text-left font-semibold transition-colors")}
          >
            <span>{format(new Date(year, m, 1), "MMMM")}</span>
          </h5>
          <Month year={year} month={m} mini={true} />
        </div>
      ))}
    </div>
  );
};

const getIncrementedDate = (
  add: number,
  year: TVDateValue,
  month: TVDateValue,
) => {
  if (month === "list" && year !== "list") {
    return { year: year + add, month: month };
  }

  if (month === "list" || year === "list") {
    return { year, month };
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
  return { year: newYear, month: newMonth };
};

const ViewController = ({
  year,

  month,
}: {
  year: TVDateValue;
  month: TVDateValue;
}) => {
  const { settings } = useUserSafe();
  const now = getGMTWithTimezoneOffset(settings.timezone);
  const navigate = Route.useNavigate();

  const toPrev = getIncrementedDate(-1, year, month);
  const toNext = getIncrementedDate(1, year, month);

  return (
    <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex items-baseline gap-2 self-center">
        <YearSelector
          value={typeof year === "number" ? year : undefined}
          onChange={(v) =>
            navigate({ search: (prev) => ({ ...prev, year: v }) })
          }
        />

        {typeof year === "number" && typeof month === "number" && (
          <>
            <div className="pl-4 text-xl font-light text-neutral-200 dark:text-neutral-800">
              /
            </div>
            <Link
              from={Route.fullPath}
              search={(prev) => ({
                ...prev,
                month: "list",
              })}
            >
              <Button name="months" variant="ghost">
                {format(new Date(year, month, 1), "MMMM")}
              </Button>
            </Link>
          </>
        )}
      </div>
      <div className="flex w-fit gap-2 self-end">
        <Button
          aria-label="Previous month"
          variant="outline"
          size="icon"
          asChild
        >
          <Link
            from={Route.fullPath}
            search={(prev) => ({ ...prev, ...toPrev })}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>

        <Button aria-label="Next month" variant="outline" size="icon" asChild>
          <Link
            from={Route.fullPath}
            search={(prev) => ({ ...prev, ...toNext })}
          >
            <ChevronRightIcon className="h-4 w-4" />{" "}
          </Link>
        </Button>

        <Button aria-label="Current month" variant="outline" asChild>
          <Link
            from={Route.fullPath}
            search={(prev) => ({
              ...prev,
              month: now.getMonth(),
              year: now.getFullYear(),
            })}
            activeProps={{
              className: "pointer-events-none opacity-50",
            }}
          >
            Today
          </Link>
        </Button>
      </div>
    </div>
  );
};

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
  const { id } = useTrackableMeta();
  const view =
    typeof month !== "number" && typeof year === "number" ? "months" : "days";

  const openMonth = (m: number) => {
    setDates(year, m);
  };

  const z = useZ();

  z.query.TYL_trackableRecord.where(({ cmp, and }) =>
    and(
      cmp("trackableId", id),
      cmp("date", ">=", addMonths(startOfYear(new Date()), -2).getTime()),
      cmp("date", "<=", addMonths(endOfYear(new Date()), 2).getTime()),
    ),
  ).preload();

  return (
    <>
      <ViewController year={year} month={month} />

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

      <hr className="my-4 h-[1px] border-none bg-neutral-900 opacity-10 outline-none dark:bg-neutral-50" />

      <TrackableNoteEditable />
    </>
  );
};

export default TrackableView;
