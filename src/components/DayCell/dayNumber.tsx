import cls from "clsx";

const DayNumber = ({
  style,
  day,
  isToday,
}: {
  day: number;
  style?: "mini" | undefined;
  isToday?: boolean;
}) => {
  if (style === "mini") return <></>;
  return (
    <>
      <span
        className={cls(
          "absolute top-1 left-2 select-none text-xs text-neutral-500 dark:text-neutral-800 sm:text-base",
          isToday ? "font-normal underline" : "font-light "
        )}
      >
        {day}
      </span>
    </>
  );
};

export default DayNumber;
