import { Fragment, useMemo, useState } from "react";
import { cn } from "@shad/utils";
import { Link } from "@tanstack/react-router";
import { format, isLastDayOfMonth } from "date-fns";
import { m } from "framer-motion";

import type { ITrackable } from "@tyl/validators/trackable";
import { getGMTWithTimezoneOffset } from "@tyl/helpers/timezone";
import { sortTrackableList } from "@tyl/helpers/trackables";

import { Badge } from "~/@shad/components/badge";
import { Button } from "~/@shad/components/button";
import { Input } from "~/@shad/components/input";
import { Spinner } from "~/@shad/components/spinner";
import DayCellWrapper from "~/components/DayCell";
import TrackableProvider from "~/components/Providers/TrackableProvider";
import { TrackableNameText } from "~/components/TrackableName";
import { generateDates } from "~/components/TrackablesList/helper";
import { useTrackablesList } from "~/query/trackablesList";
import { useUserSettings } from "~/query/userSettings";
import MiniTrackable from "./miniTrackable";

const EmptyList = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-light">
        You do not have any trackables yet.
      </h2>

      <Link className="mt-4" to={"/app/create"}>
        <Button variant="outline">Create Trackable</Button>
      </Link>
    </div>
  );
};

type TrackableTypeFilterState = Record<ITrackable["type"], boolean>;

const filterTrackables = (
  query: string,
  types: TrackableTypeFilterState,
  list: Pick<ITrackable, "id" | "name" | "type">[],
) => {
  const filterByType = Object.values(types).some((v) => v);

  if (!query && !filterByType) return list;

  return list
    .filter((v) => {
      return (v.name || "").includes(query);
    })
    .filter((v) => {
      if (!filterByType) return true;
      return types[v.type];
    });
};

const TrackablesList = ({ daysToShow }: { daysToShow: number }) => {
  const settings = useUserSettings();

  const { data, isPending } = useTrackablesList();

  const [searchQ, setSearch] = useState("");
  const [filterTypes, setFilterTypes] = useState<TrackableTypeFilterState>({
    number: false,
    range: false,
    boolean: false,
  });

  const filtered = useMemo(
    () => filterTrackables(searchQ, filterTypes, data ?? []),
    [data, filterTypes, searchQ],
  );

  const sorted = useMemo(
    () => sortTrackableList(filtered, settings.favorites),
    [filtered, settings],
  );

  const daysToRender = useMemo(
    () =>
      generateDates(daysToShow, getGMTWithTimezoneOffset(settings.timezone)),
    [daysToShow, settings.timezone],
  );

  if (isPending) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data || data.length === 0) return <EmptyList />;

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
        {sorted.map((tr) => (
          <m.div
            transition={{ duration: 0.2, ease: "circInOut" }}
            layout
            layoutId={tr.id}
            key={tr.id}
            className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800"
          >
            <TrackableProvider id={tr.id}>
              <MiniTrackable daysToRender={daysToRender} />
            </TrackableProvider>
          </m.div>
        ))}
      </div>
    </>
  );
};

export const DailyList = ({ daysToShow }: { daysToShow: number }) => {
  const { data, isPending } = useTrackablesList();

  const settings = useUserSettings();

  const daysToRender = useMemo(
    () =>
      generateDates(
        daysToShow,
        getGMTWithTimezoneOffset(settings.timezone),
      ).reverse(),
    [daysToShow, settings.timezone],
  );

  if (isPending) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!data || data.length === 0) return <EmptyList />;

  const sorted = sortTrackableList(data, settings.favorites);

  return (
    <div className="flex flex-col gap-6">
      {daysToRender.map((date, index) => (
        <Fragment key={index}>
          <div className="relative flex h-fit flex-col">
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
              {sorted.map((tr, index) => (
                <div key={index}>
                  <TrackableProvider id={tr.id}>
                    <Link
                      to={`/app/trackables/${tr.id}/`}
                      className={cn(
                        "mb-1 block w-full truncate text-xl text-neutral-950 opacity-20 dark:text-neutral-50",
                      )}
                    >
                      <TrackableNameText />
                    </Link>

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
