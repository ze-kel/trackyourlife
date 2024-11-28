import type { QueryClient } from "@tanstack/react-query";

import type { ITrackable } from "@tyl/validators/trackable";

import { QUERY_KEY as TRACKABLES_LIST_QUERY_KEY } from "./trackablesList";

export const fillPrefetchedTrackable = (
  queryClient: QueryClient,
  trackable: ITrackable,
) => {
  queryClient.setQueryData(["trackable", trackable.id], {
    type: trackable.type,
    id: trackable.id,
    name: trackable.name,
  });

  queryClient.setQueryData(
    ["trackable", trackable.id, "settings"],
    trackable.settings,
  );

  for (const [year, yearData] of Object.entries(trackable.data)) {
    for (const [month, monthData] of Object.entries(yearData)) {
      queryClient.setQueryData(
        ["trackable", trackable.id, Number(year), Number(month)],
        monthData,
      );
    }
  }
};

export const fillPrefetchedTrackablesList = (
  queryClient: QueryClient,
  trackables: ITrackable[],
) => {
  queryClient.setQueryData(
    TRACKABLES_LIST_QUERY_KEY,
    trackables.map((v) => ({ name: v.name, id: v.id, type: v.type })),
  );

  for (const trackable of trackables) {
    fillPrefetchedTrackable(queryClient, trackable);
  }
};
