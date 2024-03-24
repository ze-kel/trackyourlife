import type { ITrackable } from "@t/trackable";
import type { QueryClient } from "@tanstack/react-query";

export const fillPrefetchedData = (
  queryClient: QueryClient,
  trackable: ITrackable,
) => {
  queryClient.setQueryData(["trackable", trackable.id], {
    type: trackable.type,
    id: trackable.id,
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
