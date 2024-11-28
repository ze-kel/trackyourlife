import type { QueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { getUserFn } from "~/auth/authOperations";

const q = {
  queryKey: ["user"],
  queryFn: async () => await getUserFn(),
  refetchOnWindowFocus: false,
};

export const ensureUser = async (qc: QueryClient) => {
  await qc.prefetchQuery(q);
};

export const useUserQuery = () => {
  return useQuery(q);
};
