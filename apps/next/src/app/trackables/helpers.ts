import type { ITrackable } from "@tyl/validators/trackable";
import type { QueryClient } from "@tanstack/react-query";
import type { ITrackableFromList } from "src/app/api/trackables/apiFunctions";

export const fillPrefetchedTrackable = (
  queryClient: QueryClient,
  trackable: ITrackable,
) => {
  queryClient.setQueryData<ITrackableFromList>(["trackable", trackable.id], {
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
    ["trackables", "list"],
    trackables.map(
      (v) => ({ name: v.name, id: v.id, type: v.type }) as ITrackableFromList,
    ),
  );

  for (const trackable of trackables) {
    fillPrefetchedTrackable(queryClient, trackable);
  }
};
