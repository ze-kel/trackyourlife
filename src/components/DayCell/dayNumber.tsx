import { cn } from "@/lib/utils";

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
        className={cn(
          "absolute left-0.5 top-0.5 select-none text-xs text-neutral-800 sm:left-2 sm:top-1 sm:text-base",
          isToday ? "font-normal underline" : "font-light ",
        )}
      >
        {day}
      </span>
    </>
  );
};

export default DayNumber;
