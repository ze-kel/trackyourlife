"use client";
import type { ITrackable, ITrackableSettings } from "src/types/trackable";
import MiniTrackable from "./miniTrackable";
import { m } from "framer-motion";
import TrackableProvider from "@components/Providers/TrackableProvider";
import type { QueryClient } from "@tanstack/react-query";
import { QueriesObserver, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
            <MiniTrackable className="my-4" />
          </TrackableProvider>
        </m.div>
      ))}
    </div>
  );
};

export default TrackablesList;
