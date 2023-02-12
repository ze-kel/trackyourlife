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
import { AnimatePresence, motion } from "framer-motion";

const activeGen: Record<IColorOptions, string> = {
  neutral: "border-neutral-500 dark:border-neutral-700",
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
    "group relative flex items-center justify-center font-light transition-colors",
  ],
  {
    variants: {
      style: {
        default: "h-16 border-2",
        mini: "border h-6",
      },
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
        inTrackRange: false,
        className: "border-transparent",
      },
      {
        inTrackRange: true,
        isToday: false,
        className: "text-neutral-500 dark:text-neutral-700",
      },
      ...Generated,
    ],

    defaultVariants: {
      style: "default",
    },
  }
);

export const DayCellNumber = ({ day, month, year, style }: IDayProps) => {
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

  const [isHover, setHover] = useState(false);

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
        style,
      })}
      key={day}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {style !== "mini" && (
        <span className="absolute top-1 left-2 select-none">{day}</span>
      )}
      {inTrackRange && (
        <>
          <EditableText
            value={displayedNumber || 0}
            isNumber={true}
            updater={handleInputUpdate}
            className={cls(
              "flex h-full w-full select-none items-center justify-center bg-inherit text-center font-semibold shadow-lg shadow-transparent outline-none transition-all",
              displayedNumber === 0 && !inInputEdit
                ? "text-neutral-200 dark:text-neutral-800"
                : "text-neutral-800 dark:text-neutral-300",
              style === "mini" ? "text-xs" : "text-xl"
            )}
            classNameInput="focus:outline-neutral-300 dark:focus:outline-neutral-600"
            editModeSetter={setInInputEdit}
          />

          <AnimatePresence>
            {!inInputEdit && isHover && style !== "mini" && (
              <>
                <motion.div
                  className="absolute left-[50%] top-0 z-20"
                  initial={{
                    opacity: 0,
                    translateY: "-25%",
                    translateX: "-50%",
                  }}
                  animate={{
                    opacity: 1,
                    translateY: "-50%",
                  }}
                  exit={{ opacity: 0, translateY: "-25%" }}
                  transition={{ duration: 0.2, opacity: { duration: 0.1 } }}
                >
                  <IconPlus
                    onClick={handlePlus}
                    className="h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
                  />
                </motion.div>
                <motion.div
                  className="absolute left-[50%] bottom-0 z-20"
                  initial={{
                    opacity: 0,
                    translateY: "25%",
                    translateX: "-50%",
                  }}
                  animate={{
                    opacity: 1,
                    translateY: "50%",
                  }}
                  exit={{ opacity: 0, translateY: "25%" }}
                  transition={{ duration: 0.2, opacity: { duration: 0.1 } }}
                >
                  <IconMinus
                    onClick={handleMinus}
                    className=" h-6 w-6 cursor-pointer border border-neutral-500 bg-neutral-50 p-1 dark:bg-neutral-900"
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};
