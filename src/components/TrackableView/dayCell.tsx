import cls from "clsx";
import { getYear, getMonth, getDaysInMonth, isSameDay } from "date-fns";
import { useCallback, useContext, useMemo, useState } from "react";
import type { IContextData } from "../../helpers/trackableContext";
import { TrackableContext } from "../../helpers/trackableContext";
import formatDateKey from "src/helpers/formatDateKey";
import { debounce } from "lodash";
import EditableText from "@components/_UI/EditableText";
import type { ITrackable } from "src/types/trackable";

const daysBeforeToday = (year: number, month: number) => {
  const now = new Date();
  if (year < getYear(now) || month < getMonth(now)) {
    return getDaysInMonth(new Date(year, month));
  }

  return now.getDate();
};

type IDayProps = {
  day: number;
  month: number;
  year: number;
};

const computeDayCellHelpers = ({ day, month, year }: IDayProps) => {
  const dateKey = formatDateKey({ day, month, year });

  const inFuture = daysBeforeToday(year, month) < day;

  const isToday = isSameDay(new Date(), new Date(year, month, day));

  return { dateKey, inFuture, isToday };
};

const DayCellBoolean = ({ day, month, year }: IDayProps) => {
  const { trackable, changeDay } = useContext(
    TrackableContext
  ) as IContextData & {
    trackable: ITrackable;
  };

  const { dateKey, inFuture, isToday } = useMemo(
    () => computeDayCellHelpers({ day, month, year }),
    [day, month, year]
  );

  const isActive = trackable.data[dateKey] === "true";

  const handleClick = async () => {
    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: isActive ? "false" : "true",
    });
  };

  const getClasses = () => {
    const arr = [
      "flex h-16 items-start justify-start rounded-sm border-2 border-transparent px-2 py-1 font-semibold transition-colors",
    ];

    if (inFuture) {
      arr.push("bg-slate-100 text-zinc-300");
    } else {
      if (isToday) {
        arr.push("border-zinc-500 text-zinc-600");
      } else {
        arr.push("text-zinc-500");
      }

      arr.push("cursor-pointer");

      arr.push(
        isActive
          ? "bg-lime-500 hover:border-zinc-400"
          : "bg-zinc-300 hover:border-lime-400"
      );
    }

    return arr;
  };

  return (
    <div
      className={cls(...getClasses())}
      key={day}
      onClick={() => void handleClick()}
    >
      {day}
    </div>
  );
};

const DayCellNumber = ({ day, month, year }: IDayProps) => {
  const { trackable, changeDay } = useContext(
    TrackableContext
  ) as IContextData & {
    trackable: ITrackable;
  };

  const { dateKey, inFuture, isToday } = useMemo(
    () => computeDayCellHelpers({ day, month, year }),
    [day, month, year]
  );

  const number = trackable.data[dateKey];

  const [displayedNumber, setDisplayedNumber] = useState(Number(number) || 0);

  const [inInputEdit, setInInputEdit] = useState(false);

  const updateValue = async (value: number) => {
    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: String(value),
    });
  };

  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    day,
    month,
    year,
  ]);

  const handlePlus = () => {
    setDisplayedNumber(displayedNumber + 1);
    void debouncedUpdateValue(displayedNumber + 1);
  };
  const handleMinus = () => {
    setDisplayedNumber(displayedNumber - 1);
    void debouncedUpdateValue(displayedNumber - 1);
  };

  const handleInputUpdate = (val: number) => {
    if (val !== displayedNumber) {
      setDisplayedNumber(val);
      void debouncedUpdateValue(val);
    }
  };

  const getClasses = () => {
    const arr = [
      "group relative flex h-16 items-center justify-center rounded-sm border-2 border-transparent font-semibold transition-colors",
    ];

    if (inFuture) {
      arr.push("bg-slate-100 text-zinc-300");
    } else {
      if (isToday) {
        arr.push("border-zinc-500 text-zinc-600");
      } else {
        arr.push("text-zinc-500 border-zinc-100");
      }
    }
    return arr;
  };

  return (
    <div className={cls(...getClasses())} key={day}>
      <span className="absolute top-1 left-2">{day}</span>
      {!inFuture && (
        <>
          <EditableText
            value={displayedNumber || 0}
            isNumber={true}
            updater={handleInputUpdate}
            className={cls(
              "flex h-full w-full items-center justify-center text-center text-xl transition-colors",
              displayedNumber === 0 && !inInputEdit
                ? "text-zinc-200"
                : "text-zinc-800"
            )}
            classNameInput="focus:outline-zinc-900"
            editModeSetter={setInInputEdit}
          />
          <span
            className={cls(
              "text-xl transition-colors",
              displayedNumber === 0 ? "text-zinc-200" : "text-zinc-800"
            )}
          ></span>

          {!inInputEdit && (
            <>
              <button
                onClick={handleMinus}
                className="invisible absolute left-[50%] bottom-0 z-20 h-7 w-7 -translate-x-1/2 translate-y-1/2 rounded-sm border border-zinc-500 bg-zinc-50 group-hover:visible"
              >
                -
              </button>
              <button
                onClick={handlePlus}
                className="invisible absolute left-[50%] top-0 z-20 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-zinc-500 bg-zinc-50 group-hover:visible"
              >
                +
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

const DayCell = (data: IDayProps) => {
  const { trackable } = useContext(TrackableContext) ?? {};

  if (!trackable) return <></>;

  if (trackable.type === "boolean") {
    return <DayCellBoolean {...data} />;
  }

  if (trackable.type === "number") {
    return <DayCellNumber {...data} />;
  }

  return <></>;
};

export default DayCell;
