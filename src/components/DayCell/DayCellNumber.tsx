import cls from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { useTrackableSafe } from "../../helpers/trackableContext";
import { debounce } from "lodash";
import EditableText from "@components/_UI/EditableText";
import IconPlus from "@heroicons/react/24/outline/PlusIcon";
import IconMinus from "@heroicons/react/24/outline/MinusIcon";
import { cva } from "class-variance-authority";
import type { IDayProps } from "./index";
import { computeDayCellHelpers } from "./index";
import { ThemeList } from "./DayCellBoolean";
import type { IColorOptions } from "@t/trackable";

const activeGen: Record<IColorOptions, string> = {
  neutral: "border-neutral-500",
  red: "border-red-500",
  pink: "border-pink-500",
  green: "border-green-500",
  blue: "border-blue-500",
  orange: "border-orange-500",
  purple: "border-purple-500",
  lime: "border-lime-500",
};

const Generated = (Object.keys(activeGen) as IColorOptions[]).reduce<
  {
    colorCode?: IColorOptions;
    inTrackRange?: boolean;
    className: string;
  }[]
>((acc, key) => {
  acc.push({
    colorCode: key,
    inTrackRange: true,
    className: activeGen[key],
  });
  return acc;
}, []);

const NumberClasses = cva(
  [
    "group relative flex h-16 items-center justify-center border-2 border-transparent font-light transition-colors",
  ],
  {
    variants: {
      inTrackRange: {
        true: "cursor-text",
        false:
          "bg-neutral-100 text-neutral-300 dark:bg-neutral-900 dark:text-neutral-800",
      },
      isToday: {
        true: "text-neutral-400",
      },
      colorCode: ThemeList,
    },
    compoundVariants: [
      {
        inTrackRange: true,
        className: "text-neutral-500  dark:text-neutral-700",
      },
      {
        inTrackRange: true,
        isToday: false,
        className: "text-neutral-500 dark:text-neutral-700",
      },
      ...Generated,
    ],
  }
);

export const DayCellNumber = ({ day, month, year }: IDayProps) => {
  const { trackable, changeDay } = useTrackableSafe();

  if (trackable.type !== "number") {
    throw new Error("Not boolena trackable passed to boolean dayCell");
  }

  const { dateKey, inTrackRange, isToday } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: trackable.settings.startDate,
      }),
    [day, month, year, trackable.settings.startDate]
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

  const findTheme = (): IColorOptions | undefined => {
    const cc = trackable.settings.colorCoding;
    if (!cc || !cc.length) return;

    let result: IColorOptions = cc[0]?.color || "neutral";

    for (let i = 0; i < cc.length; i++) {
      const point = cc[i];
      if (!point) throw new Error("Error and find color loop");

      if (Number(displayedNumber) < point.from) {
        return result;
      }

      result = point.color;
    }

    return result;
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
    <div
      className={NumberClasses({
        inTrackRange,
        isToday,
        colorCode: findTheme(),
      })}
      key={day}
    >
      <span className="absolute top-1 left-2 select-none">{day}</span>
      {inTrackRange && (
        <>
          <EditableText
            value={displayedNumber || 0}
            isNumber={true}
            updater={handleInputUpdate}
            className={cls(
              "flex h-full w-full select-none items-center justify-center bg-inherit text-center text-xl font-semibold outline-none transition-colors",
              displayedNumber === 0 && !inInputEdit
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300"
            )}
            classNameInput="focus:outline-neutral-900"
            editModeSetter={setInInputEdit}
          />

          {!inInputEdit && (
            <>
              <IconMinus
                onClick={handleMinus}
                className="invisible absolute left-[50%] bottom-0 z-20 h-7 w-7 -translate-x-1/2 translate-y-1/2 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 group-hover:visible dark:bg-neutral-900"
              />
              <IconPlus
                onClick={handlePlus}
                className="invisible absolute left-[50%] top-0 z-20 h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer  border border-neutral-500 bg-neutral-50 p-1 group-hover:visible dark:bg-neutral-900"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
