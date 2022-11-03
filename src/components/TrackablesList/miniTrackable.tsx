import DayCell from "@components/TrackableView/dayCell";
import clsx from "clsx";
import { getDaysInMonth } from "date-fns";
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
    <div className={clsx("grid grid-cols-7 gap-2", className)}>
      {daysToRender.map((day, index) => (
        <DayCell {...day} key={index} />
      ))}
    </div>
  );
};

export default MiniTrackable;
