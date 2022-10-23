import cls from "clsx";
import { getYear, getMonth, getDaysInMonth } from "date-fns";
import { useContext } from "react";
import { TrackableContext } from "./trackableContext";
import formatDateKey from "util/formatDateKey";

const daysBeforeToday = (year: number, month: number) => {
  const now = new Date();
  if (year < getYear(now) || month < getMonth(now)) {
    return getDaysInMonth(new Date(year, month));
  }

  return now.getDate();
};

const DayCell = ({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) => {
  const { trackable, changeDay } = useContext(TrackableContext);

  const beforeToday = daysBeforeToday(year, month);

  const isActive = trackable.data[formatDateKey({ day, month, year })];

  const handleClick = async () => {
    await changeDay({ day, month, year, value: !isActive });
  };

  return (
    <div
      className={cls(
        "flex h-16 items-start justify-start rounded-sm border-2 border-transparent px-2 py-1 font-semibold text-zinc-700 transition-colors",
        beforeToday < day ? "bg-slate-100 text-slate-400" : "cursor-pointer",
        isActive
          ? "bg-green-500 hover:border-zinc-400"
          : "bg-zinc-300 hover:border-green-400"
      )}
      key={day}
      onClick={handleClick}
    >
      {day}
    </div>
  );
};
export default DayCell;
