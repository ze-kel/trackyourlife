import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { trpc } from "~/trpc/react";

export const QUERY_KEY = ["trackables", "list"];

const q = {
  queryKey: QUERY_KEY,
  queryFn: async () => await trpc.trackablesRouter.getTrackableIdList.query(),
};



export const ensureTrackablesList = async (qc: QueryClient) => {
  await qc.prefetchQuery(q);
};

export const useTrackablesList = () => {
  return useQuery(q);
};

export const invalidateTrackablesList = async (qc: QueryClient) => {
  await qc.invalidateQueries({ queryKey: QUERY_KEY });
};
