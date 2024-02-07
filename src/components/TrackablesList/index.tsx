"use client";
import type { ITrackable, ITrackableSettings } from "src/types/trackable";
import MiniTrackable from "./miniTrackable";
import { m } from "framer-motion";
import TrackableProvider, {
  useTrackableContextSafe,
} from "@components/Providers/TrackableProvider";
import type { QueryClient } from "@tanstack/react-query";
import { QueriesObserver, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { generateDates } from "@components/TrackablesList/helper";
import DayCell from "@components/DayCell";
import Link from "next/link";
import { format } from "date-fns";

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

const TrackablesList = ({ list }: { list: ITrackable["id"][] }) => {
  const queryClient = useQueryClient();

  const [sorted, setSorted] = useState(sortList(list, queryClient));

  useEffect(() => {
    const m = list.map((v) => ({
      queryKey: ["trackable", v, "settings"],
    }));
    const obs = new QueriesObserver(queryClient, m);
    obs.subscribe(() => {
      setSorted(sortList(list, queryClient));
    });
  });

  const daysToRender = useMemo(() => generateDates(1), []);

  return (
    <div className="grid gap-5">
      {sorted.map((id, index) => (
        <m.div
          layout
          layoutId={String(index)}
          key={id}
          className="border-b border-neutral-200 py-2 last:border-0 dark:border-neutral-800"
        >
          <TrackableProvider id={id}>
            <MiniTrackable daysToRender={daysToRender} className="my-4" />
          </TrackableProvider>
        </m.div>
      ))}
    </div>
  );
};

const TrackableName = () => {
  const { trackable, settings } = useTrackableContextSafe();

  return (
    <Link href={`/trackables/${trackable?.id}`} className="block w-fit pb-2">
      <h3 className="text-md w-fit cursor-pointer">
        {settings?.name || "unnamed"}
      </h3>
    </Link>
  );
};

export const DailyList = ({ list }: { list: ITrackable["id"][] }) => {
  const daysToRender = useMemo(() => generateDates(7).reverse(), []);

  return (
    <div className="flex flex-col gap-8">
      {daysToRender.map((date, index) => (
        <div key={index}>
          <div className="text-2xl">
            {format(new Date(date.year, date.month, date.day), "MMMM d")}
          </div>
          <div className="fr mt-2 grid gap-4">
            {list.map((id, index) => (
              <TrackableProvider key={index} id={id}>
                <TrackableName />
                <DayCell {...date} />
              </TrackableProvider>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackablesList;
