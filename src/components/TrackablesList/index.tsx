"use client";
import type { ITrackable, ITrackableSettings } from "src/types/trackable";
import MiniTrackable from "./miniTrackable";
import { AnimatePresence, m } from "framer-motion";
import TrackableProvider, {
  useTrackableContextSafe,
} from "@components/Providers/TrackableProvider";
import type { QueryClient } from "@tanstack/react-query";
import { QueriesObserver, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useMemo, useState } from "react";
import { generateDates } from "@components/TrackablesList/helper";
import DayCellWrapper from "@components/DayCell";
import Link from "next/link";
import { format, isLastDayOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUserSettings } from "@components/Providers/UserSettingsProvider";
import { getDateInTimezone } from "src/helpers/timezone";
import { Button } from "@/components/ui/button";

const EmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-light">
        You do not have any trackables yet.
      </h2>

      <Link className="mt-4" href={"/create"}>
        <Button variant="outline">Create Trackable</Button>
      </Link>
    </div>
  );
};

const sortList = (
  list: ITrackable["id"][],
  queryClient: QueryClient,
): ITrackable["id"][] => {
  const newList = list.map((id) => {
    return {
      id,
      settings: queryClient.getQueryData<ITrackableSettings>([
        "trackable",
        id,
        "settings",
      ]),
    };
  });

  newList.sort((a, b) => {
    if (!a.settings || !b.settings) return 0;
    if (a.settings.favorite && !b.settings.favorite) return -1;
    if (!a.settings.favorite && b.settings.favorite) return 1;

    const aName = a.settings.name || "";
    const bName = b.settings.name || "";

    return aName.localeCompare(bName);
  });

  return newList.map((v) => v.id);
};

type TrackableTypeFilterState = Record<ITrackable["type"], boolean>;

const filterTrackables = (
  query: string,
  types: TrackableTypeFilterState,
  list: ITrackable["id"][],
  queryClient: QueryClient,
): ITrackable["id"][] => {
  const filterByType = Object.values(types).some((v) => v);

  if (!query && !filterByType) return list;

  const newList = list.map((id) => {
    return {
      id,
      type: queryClient.getQueryData<ITrackable>(["trackable", id])?.type,
      settings: queryClient.getQueryData<ITrackableSettings>([
        "trackable",
        id,
        "settings",
      ]),
    };
  });

  return newList
    .filter((v) => {
      return v.settings?.name && v.settings.name.includes(query);
    })
    .filter((v) => {
      if (!filterByType) return true;

      return types[v.type as keyof TrackableTypeFilterState];
    })
    .map((v) => v.id);
};

const TrackablesList = ({
  list,
  daysToShow,
}: {
  list: ITrackable["id"][];
  daysToShow: number;
}) => {
  const queryClient = useQueryClient();

  const [searchQ, setSearch] = useState("");
  const [filterTypes, setFilterTypes] = useState<TrackableTypeFilterState>({
    number: false,
    range: false,
    boolean: false,
  });

  const filtered = useMemo(
    () => filterTrackables(searchQ, filterTypes, list, queryClient),
    [list, queryClient, filterTypes, searchQ],
  );

  const [sortedVersion, setSortedVersion] = useState(0);

  const sorted = useMemo(
    () => sortList(filtered, queryClient),
    [filtered, queryClient],
  );

  useEffect(() => {
    // Update sorted list when we change setting(add to favs)
    const m = list.map((v) => ({
      queryKey: ["trackable", v, "settings"],
    }));
    const obs = new QueriesObserver(queryClient, m);
    obs.subscribe(() => {
      setSortedVersion(sortedVersion + 1);
    });
  });

  const { settings } = useUserSettings();

  const daysToRender = useMemo(
    () => generateDates(daysToShow, getDateInTimezone(settings.timezone)),
    [daysToShow, settings.timezone],
  );

  if (list.length === 0) return <EmptyList />;

  return (
    <>
      <Input
        placeholder="Search by name"
        className="mt-2"
        value={searchQ}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="mt-2 flex gap-2">
        {Object.keys(filterTypes).map((v) => (
          <Badge
            key={v}
            variant={
              filterTypes[v as keyof TrackableTypeFilterState]
                ? "default"
                : "outline"
            }
            className="cursor-pointer capitalize"
            onClick={() => {
              setFilterTypes({
                ...filterTypes,
                [v]: !filterTypes[v as keyof TrackableTypeFilterState],
              });
            }}
          >
            {v}
          </Badge>
        ))}
      </div>

      <div className="mt-3 grid gap-5">
        <AnimatePresence initial={false}>
          {sorted.map((id) => (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: "circInOut" }}
              layout
              layoutId={id}
              key={id}
              className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800"
            >
              <TrackableProvider id={id}>
                <MiniTrackable daysToRender={daysToRender} />
              </TrackableProvider>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export const TrackableName = ({ className }: { className?: string }) => {
  const { trackable, settings } = useTrackableContextSafe();

  return (
    <Link
      href={`/trackables/${trackable?.id}`}
      className={cn("block w-fit", className)}
    >
      {settings?.name || "unnamed"}
    </Link>
  );
};

export const DailyList = ({
  list,
  daysToShow,
}: {
  list: ITrackable["id"][];
  daysToShow: number;
}) => {
  const { settings } = useUserSettings();

  const daysToRender = useMemo(
    () =>
      generateDates(daysToShow, getDateInTimezone(settings.timezone)).reverse(),
    [daysToShow, settings.timezone],
  );

  const queryClient = useQueryClient();

  const [sorted] = useState(sortList(list, queryClient));

  if (list.length === 0) return <EmptyList />;

  return (
    <div className="flex flex-col gap-6">
      {daysToRender.map((date, index) => (
        <Fragment key={index}>
          <div className="relative flex h-fit flex-col ">
            <div className="flex w-full flex-col justify-between gap-2">
              {(isLastDayOfMonth(new Date(date.year, date.month, date.day)) ||
                index === 0) && (
                <div className="mb-2 text-2xl font-semibold lg:text-3xl">
                  {format(new Date(date.year, date.month, date.day), "MMMM")}
                </div>
              )}

              <span className="flex w-full items-baseline gap-2">
                <span className="text-xl opacity-30">
                  {format(new Date(date.year, date.month, date.day), "EEEE")}
                </span>{" "}
                <span className="text-xl font-semibold opacity-80">
                  {format(new Date(date.year, date.month, date.day), "d")}
                </span>
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {sorted.map((id, index) => (
                <div key={index}>
                  <TrackableProvider id={id}>
                    <TrackableName
                      className={
                        "mb-1 w-full text-right text-xl text-neutral-950 opacity-20 dark:text-neutral-50"
                      }
                    />
                    <DayCellWrapper
                      {...date}
                      labelType="none"
                      className="h-20"
                    />
                  </TrackableProvider>
                </div>
              ))}
            </div>
          </div>
          {index !== daysToRender.length - 1 && (
            <hr className="h-0 border-b border-neutral-200 dark:border-neutral-800" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default TrackablesList;
