import cls from "clsx";
import React, { useCallback, useContext, useMemo, useState } from "react";
import type { IContextData } from "../../helpers/trackableContext";
import { TrackableContext } from "../../helpers/trackableContext";
import { debounce } from "lodash";
import EditableText from "@components/_UI/EditableText";
import type { ITrackable } from "src/types/trackable";
import IconPlus from "@heroicons/react/24/outline/PlusIcon";
import IconMinus from "@heroicons/react/24/outline/MinusIcon";
import { cva } from "class-variance-authority";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";

const NumberClasses = cva(
  [
    "group relative flex h-16 items-center justify-center rounded-sm border-2 border-transparent font-semibold transition-colors",
  ],
  {
    variants: {
      inTrackRange: {
        true: "",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-800 dark:text-neutral-700",
      },
      isToday: {
        true: "",
      },
    },
    compoundVariants: [
      {
        inTrackRange: true,
        isToday: true,
        className:
          "text-neutral-500 border-neutral-100 dark:border-neutral-500",
      },
      {
        inTrackRange: true,
        isToday: false,
        className:
          "text-neutral-500 border-neutral-100 dark:border-neutral-800",
      },
    ],
  }
);

export const DayCellNumber = ({ day, month, year }: IDayProps) => {
  const { trackable, changeDay } = useContext(
    TrackableContext
  ) as IContextData & {
    trackable: ITrackable;
  };

  const { dateKey, inTrackRange, isToday } = useMemo(
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateValue = useCallback(debounce(updateValue, 400), [
    day,
    month,
    year,
  ]);

  const handlePlus = (e: React.MouseEvent) => {
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
    setDisplayedNumber(displayedNumber + 1);
    void debouncedUpdateValue(displayedNumber + 1);
  };
  const handleMinus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayedNumber(displayedNumber - 1);
    void debouncedUpdateValue(displayedNumber - 1);
  };

  const handleInputUpdate = (val: number) => {
    if (val !== displayedNumber) {
      setDisplayedNumber(val);
      void debouncedUpdateValue(val);
    }
  };

  return (
    <div className={NumberClasses({ inTrackRange, isToday })} key={day}>
      <span className="absolute top-1 left-2 select-none">{day}</span>
      {inTrackRange && (
        <>
          <EditableText
            value={displayedNumber || 0}
            isNumber={true}
            updater={handleInputUpdate}
            className={cls(
              "flex h-full w-full select-none items-center justify-center bg-inherit text-center text-xl transition-colors",
              displayedNumber === 0 && !inInputEdit
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-500"
            )}
            classNameInput="focus:outline-neutral-900"
            editModeSetter={setInInputEdit}
          />

          {!inInputEdit && (
            <>
              <IconMinus
                onClick={handleMinus}
                className="invisible absolute left-[50%] bottom-0 z-20 h-7 w-7 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-sm border border-neutral-500 bg-neutral-50 p-1 group-hover:visible dark:bg-neutral-900"
              />
              <IconPlus
                onClick={handlePlus}
                className="invisible absolute left-[50%] top-0 z-20 h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-sm border border-neutral-500 bg-neutral-50 p-1 group-hover:visible dark:bg-neutral-900"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
