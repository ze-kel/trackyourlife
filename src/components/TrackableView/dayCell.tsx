import cls from "clsx";
import { getYear, getMonth, getDaysInMonth, isSameDay } from "date-fns";
import { useCallback, useContext, useMemo, useState } from "react";
import type { IContextData } from "../../helpers/trackableContext";
import { TrackableContext } from "../../helpers/trackableContext";
import formatDateKey from "src/helpers/formatDateKey";
import { debounce } from "lodash";
import EditableText from "@components/_UI/EditableText";
import type { ITrackable } from "src/types/trackable";
import IconPlus from "@heroicons/react/24/outline/PlusIcon";
import IconMinus from "@heroicons/react/24/outline/MinusIcon";

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

type IDayProps = {
  day: number;
  month: number;
  year: number;
  style?: "mini";
};

const computeDayCellHelpers = ({ day, month, year }: IDayProps) => {
  const dateKey = formatDateKey({ day, month, year });
  const inFuture = daysBeforeToday(year, month) < day;
  const isToday = isSameDay(new Date(), new Date(year, month, day));

  return { dateKey, inFuture, isToday };
};

const DayCellBoolean = ({ day, month, year, style }: IDayProps) => {
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
    const arr = ["flex rounded-sm border-transparent transition-colors"];

    if (style === "mini") {
      arr.push("text-xs h-6 justify-center items-center font-light border");
    }

    if (style === undefined) {
      arr.push(
        "h-16 px-2 py-1 font-semibold items-start justify-start border-2"
      );
    }

    if (inFuture) {
      arr.push("bg-neutral-100 text-neutral-300");
    } else {
      if (isToday) {
        arr.push("border-neutral-500 text-neutral-600");
      } else {
        arr.push("text-neutral-500");
      }

      arr.push("cursor-pointer");

      arr.push(
        isActive
          ? "bg-lime-500 hover:border-neutral-400"
          : "bg-neutral-200 hover:border-lime-400"
      );
    }

    return arr;
  };

  return (
    <div
      className={cls(...getClasses())}
      key={day}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleClick();
      }}
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
      arr.push("bg-neutral-100 text-neutral-300");
    } else {
      if (isToday) {
        arr.push("border-neutral-500 text-neutral-600");
      } else {
        arr.push("text-neutral-500 border-neutral-100");
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
                ? "text-neutral-200"
                : "text-neutral-800"
            )}
            classNameInput="focus:outline-neutral-900"
            editModeSetter={setInInputEdit}
          />
          <span
            className={cls(
              "text-xl transition-colors",
              displayedNumber === 0 ? "text-neutral-200" : "text-neutral-800"
            )}
          ></span>

          {!inInputEdit && (
            <>
              <IconMinus
                onClick={handleMinus}
                className="invisible absolute left-[50%] bottom-0 z-20 h-7 w-7 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-sm border border-neutral-500 bg-neutral-50 p-1 group-hover:visible"
              />
              <IconPlus
                onClick={handlePlus}
                className="invisible absolute left-[50%] top-0 z-20 h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm border border-neutral-500 bg-neutral-50 p-1 group-hover:visible"
              />
            </>
          )}
        </>
      )}
    </div>
  );
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
