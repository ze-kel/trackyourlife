import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { cn } from "@shad/utils";

import type { ITrackable } from "@tyl/validators/trackable";
import { getGMTWithTimezoneOffset } from "@tyl/helpers/timezone";
import { computeDayCellHelpers } from "@tyl/helpers/trackables";

import { Skeleton } from "~/@shad/components/skeleton";
import {
  useTrackableIdSafe,
  useTrackableMeta,
  useTrackableQueryByMonth,
  useTrackableSettings,
  useTrackableUpdateMutation,
} from "~/query/trackable";
import { useUserSettings } from "~/query/userSettings";
import { DayCellBoolean } from "./DayCellBoolean";
import { DayCellNumber } from "./DayCellNumber";
import { DayCellRange } from "./DayCellRange";

export const DayCellBaseClasses =
  "@container w-full h-full relative select-none overflow-hidden border-transparent outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600 border-2 rounded-sm";

const DayCellInner = ({
  type,
  value,
  children,
  isLoading = false,
  outOfRange = false,
  className,
  dateDay,
  onChange,
}: {
  children: ReactNode;
  type: ITrackable["type"];
  value?: string;
  isLoading?: boolean;
  outOfRange?: boolean;
  disabled?: boolean;
  className?: string;
  dateDay: Date;
  onChange: (v: string) => void | Promise<void>;
}) => {
  if (outOfRange)
    return (
      <div
        className={cn(
          className,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      >
        {children}
      </div>
    );

  if (isLoading) {
    return (
      <Skeleton
        className={cn(
          className,
          "cursor-default bg-neutral-100 dark:bg-neutral-900",
        )}
      />
    );
  }

  if (type === "boolean") {
    return (
      <DayCellBoolean className={className} value={value} onChange={onChange}>
        {children}
      </DayCellBoolean>
    );
  }

  if (type === "number") {
    return (
      <DayCellNumber
        className={className}
        value={value}
        onChange={onChange}
        dateDay={dateDay}
      >
        {children}
      </DayCellNumber>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (type === "range") {
    return (
      <DayCellRange className={className} value={value} onChange={onChange}>
        {children}
      </DayCellRange>
    );
  }

  throw new Error("Unsupported trackable type");
};

const DayCellWrapper = ({
  day,
  month,
  year,
  className,
  labelType = "auto",
}: {
  day: number;
  month: number;
  year: number;
  className?: string;
  noLabel?: boolean;
  labelType?: "auto" | "outside" | "none";
}) => {
  const { id } = useTrackableIdSafe();
  const { data: trackable } = useTrackableMeta({ id });
  const { data: settings } = useTrackableSettings({ id });
  const { mutateAsync } = useTrackableUpdateMutation({ id });

  if (!trackable) throw new Error("Trackable not found in context");

  const { data, isLoading } = useTrackableQueryByMonth({
    month,
    year,
    id: id,
  });

  const uSettings = useUserSettings();

  const { inTrackRange, isToday, dateDay } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: settings?.startDate,
        dateNow: getGMTWithTimezoneOffset(uSettings.timezone),
      }),
    [day, month, year, settings?.startDate, uSettings.timezone],
  );

  const updateHandler = useCallback(
    async (value: string) => {
      await mutateAsync({ value, day, month, year });
    },
    [mutateAsync, day, month, year],
  );

  return (
    <div className="flex flex-col">
      {labelType !== "none" && (
        <div
          className={cn(
            "mr-1 text-right text-xs text-neutral-800",
            labelType === "outside" ? "" : "md:hidden",
            isToday ? "font-normal underline" : "font-light",
          )}
        >
          {day}
        </div>
      )}

      <DayCellInner
        className={cn(DayCellBaseClasses, className)}
        type={trackable.type}
        isLoading={isLoading}
        outOfRange={!inTrackRange}
        dateDay={dateDay}
        value={data?.[day]}
        onChange={updateHandler}
      >
        {labelType !== "none" && (
          <div
            className={cn(
              "absolute left-1 top-0 select-none text-base text-neutral-800",
              labelType === "outside" ? "hidden" : "max-md:hidden",
              isToday ? "font-normal underline" : "font-light",
            )}
          >
            {day}
          </div>
        )}
      </DayCellInner>
    </div>
  );
};

export default DayCellWrapper;
