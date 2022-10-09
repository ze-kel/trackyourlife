import { ITrackable, ITrackableBoolean, ITrackableUpdate } from "@t/trackable";

import {
  getDay,
  getDaysInMonth,
  getISODay,
  getMonth,
  getYear,
  format,
} from "date-fns";
import _get from "lodash/get";
import cls from "clsx";
import { useContext } from "react";
import { IdContext } from "src/helpers/idContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update } from "src/helpers/api";
import updateData from "src/helpers/updateData";
import formatDateKey from "util/formatDateKey";

const daysBeforeToday = (year: number, month: number) => {
  const now = new Date();
  if (year < getYear(now) || month < getMonth(now)) {
    return getDaysInMonth(new Date(year, month));
  }

  return now.getDate();
};

const Month = ({
  data,
  month,
  year,
}: {
  data: ITrackableBoolean["data"];
  month;
  year;
}) => {
  const toRender = getDaysInMonth(new Date(year, month));
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const beforeToday = daysBeforeToday(year, month);

  const firstDayDate = new Date(year, month, 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const id = useContext(IdContext);

  const isActive = (num: number) => {
    return data[formatDateKey({ day: num, month, year })];
  };

  const queryClient = useQueryClient();

  const dateForUpdate = {
    year,
    month,
  };

  const mutation = useMutation(
    ({ day, month, year, value }: ITrackableUpdate) => {
      return update(id, { year, month, day, value });
    },
    {
      onSuccess(data, variables) {
        queryClient.setQueryData(["trackable", id], (data: ITrackable) => {
          return updateData(data, variables);
        });
      },
    }
  );

  return (
    <div>
      <h3 className="text-lg">{format(firstDayDate, "MMMM")}</h3>
      {month}
      <div className="grid grid-cols-7 gap-5">
        {prepend.map((_, i) => (
          <div key={i}> </div>
        ))}
        {dates.map((el) => (
          <div
            className={cls(
              "flex h-16 items-center justify-center rounded-sm bg-slate-300",
              isActive(el) && "bg-green-600",
              beforeToday < el
                ? "bg-slate-100 text-slate-400"
                : "cursor-pointer"
            )}
            key={el}
            onClick={() =>
              mutation.mutate({
                ...dateForUpdate,
                day: el,
                value: !isActive(el),
              })
            }
          >
            {el}
          </div>
        ))}
      </div>
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
  data,
  year,
}: {
  data: ITrackableBoolean["data"];
  year: number;
}) => {
  const toRender = monthsBeforeToday(year);
  const months = Array(toRender)
    .fill(0)
    .map((_, i) => i)
    .reverse();

  return (
    <>
      <h2 className="my-3 text-2xl">{year}</h2>
      <div className="space-y-10">
        {months.map((m) => (
          <Month key={m} year={year} month={m} data={data} />
        ))}
      </div>
    </>
  );
};

const TrackableView = ({ trackable }: { trackable: ITrackable }) => {
  if (trackable.type !== "boolean") return <div>no support yet</div>;

  return (
    <div>
      <Year year={2022} data={trackable.data} />
    </div>
  );
};

export default TrackableView;
