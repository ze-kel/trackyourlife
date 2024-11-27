import { QueryClient, useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

import { getUserFn } from "~/auth/authOperations";

const q = {
  queryKey: ["user"],
  queryFn: async () => await getUserFn(),
  refetchOnWindowFocus: false,
};

export const ensureUser = async (qc: QueryClient) => {
  await qc.prefetchQuery(q);
};

export const useUser = () => {
  const r = useQuery(q);
  if (!r.data) throw new Error("User not found");
  return r.data;
};
