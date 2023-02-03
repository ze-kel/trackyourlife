import DayCell from "@components/DayCell";
import clsx from "clsx";
import { format, getDaysInMonth } from "date-fns";
import { useMemo } from "react";

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

const MiniTrackable = ({ className }: { className?: string }) => {
  const daysToRender = useMemo(() => generateDates(6), []);

  return (
    <div className={clsx("grid grid-cols-7 gap-x-2 gap-y-1", className)}>
      <>
        {daysToRender.map((day, index) => {
          const date = new Date(day.year, day.month, day.day);
          return (
            <div key={index} className="px-1 text-xs ">
              <span className="text-neutral-400 dark:text-neutral-600">
                {format(date, "E")}
              </span>
            </div>
          );
        })}

        {daysToRender.map((day, index) => (
          <DayCell {...day} key={index} />
        ))}
      </>
    </div>
  );
};

export default MiniTrackable;
