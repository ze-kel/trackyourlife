import { getYear, getMonth, getDaysInMonth, isSameDay } from "date-fns";
import { useContext } from "react";
import { TrackableContext } from "../../helpers/trackableContext";
import formatDateKey from "src/helpers/formatDateKey";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";

const daysBeforeToday = (year: number, month: number) => {
  const now = new Date();
  if (year < getYear(now) || month < getMonth(now)) {
    return getDaysInMonth(new Date(year, month));
  }

  if (year === getYear(now) && month === getMonth(now)) {
    return now.getDate();
  }

  return 0;
};

export type IDayProps = {
  day: number;
  month: number;
  year: number;
  style?: "mini";
};

export const computeDayCellHelpers = ({ day, month, year }: IDayProps) => {
  const dateKey = formatDateKey({ day, month, year });
  const inFuture = daysBeforeToday(year, month) < day;
  const isToday = isSameDay(new Date(), new Date(year, month, day));

  return { dateKey, inFuture, isToday };
};

const DayCell = (data: IDayProps) => {
  const { trackable } = useContext(TrackableContext) ?? {};

  if (!trackable) {
    throw new Error("Context error: Trackable");
  }

  if (trackable.type === "boolean") {
    return <DayCellBoolean {...data} />;
  }

  if (trackable.type === "number") {
    return <DayCellNumber {...data} />;
  }

  return <></>;
};

export default DayCell;
