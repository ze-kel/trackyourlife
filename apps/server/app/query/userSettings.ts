import type { QueryClient } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

import type { IUserSettings } from "@tyl/validators/user";
import { UserSettingsFallback } from "@tyl/validators/user";

import { trpc } from "~/trpc/react";

const QUERY_KEY = ["user", "settings"];

const sf = createServerFn({ method: "GET" }).handler(async () => {
  return await trpc.userRouter.getUserSettings.query();
});

const q = {
  queryKey: QUERY_KEY,
  queryFn: async () => await sf(),
  refetchOnWindowFocus: false,
};

export const ensureUserSettings = async (qc: QueryClient) => {
  await qc.prefetchQuery(q);
};

export const useUserSettings = () => {
  const r = useQuery(q);
  if (!r.data) throw new Error("User not found");
  return r.data;
};

export const useUserSettingsMutation = () => {
  const queryClient = useQueryClient();

  const settingsMutation = useMutation({
    mutationKey: [...QUERY_KEY, "update"],
    mutationFn: trpc.userRouter.updateUserSettings.mutate,
    onMutate: async (upd) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEY,
      });

      const previous = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, upd);

      return { previous };
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(QUERY_KEY, context.previous);
    },
  });

  const updateSettingsPartial = async (update: Partial<IUserSettings>) => {
    const previous = queryClient.getQueryData([QUERY_KEY]) ?? {};

    await settingsMutation.mutateAsync({
      ...UserSettingsFallback,
      ...previous,
      ...update,
    });
  };

  return { settingsMutation, updateSettingsPartial };
};
