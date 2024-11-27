import { QueryClient, useQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

import { useAppSession } from "~/auth/session";

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const a = await useAppSession();

  return a.data;
});

const q = {
  queryKey: ["user"],
  queryFn: async () => await getUser(),
};

export const ensureUser = async (qc: QueryClient) => {
  await qc.prefetchQuery(q);
};

export const useUser = () => {
  return useQuery(q);
};
