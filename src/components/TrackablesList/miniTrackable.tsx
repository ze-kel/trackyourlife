import DayCell from "@components/DayCell";
import clsx from "clsx";
import { format, getDaysInMonth } from "date-fns";
import { ReactNode, useMemo } from "react";

const generateDates = (days: number) => {
  const today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();
  let day = today.getDate();

  const dates: { year: number; month: number; day: number }[] = [];

  for (; days >= 0; days--) {
    dates[days] = { year, month, day };

    if (day === 1) {
      if (month === 0) {
        year--;
        month = 11;
      } else {
        month--;
      }
      day = getDaysInMonth(new Date(year, month));
    } else {
      day--;
    }
  }
  return dates;
};

const NUM_OF_DAYS = 6;

const MiniTrackable = ({
  className,
  stub,
}: {
  className?: string;
  stub?: ReactNode;
}) => {
  const daysToRender = useMemo(() => generateDates(NUM_OF_DAYS), []);

  return (
    <div
      className={clsx(
        "sm grid grid-cols-3 gap-x-1 gap-y-1 md:grid-cols-7",
        className,
      )}
    >
      <>
        {daysToRender.map((day, index) => {
          const date = new Date(day.year, day.month, day.day);
          return (
            <div
              key={index}
              className={clsx(
                "gap-1",
                index === 0 ? "hidden md:flex" : "flex",
                index > 3 ? "flex-col-reverse md:flex-col" : "flex-col",
              )}
            >
              <div className="px-1 text-xs ">
                <span className="text-neutral-400 dark:text-neutral-700">
                  {format(date, "EEEE")}
                </span>
              </div>

              {stub ? stub : <DayCell {...day} key={index} />}
            </div>
          );
        })}
      </>
    </div>
  );
};

export default MiniTrackable;
