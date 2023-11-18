"use client";
import type {
  ITrackable,
  ITrackableSettings,
  ITrackableUpdate,
} from "@t/trackable";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import {
  RSAGetTrackable,
  RSAUpdateTrackable,
  RSAUpdateTrackableSettings,
} from "src/app/api/trackables/serverActions";
import updateData from "src/helpers/updateData";

type MutationTrackable = UseMutationResult<
  ITrackableUpdate,
  Error,
  Omit<ITrackableUpdate, "id">,
  {
    previous: unknown;
  }
>;

type MutationSettings = UseMutationResult<
  void,
  Error,
  {
    data: ITrackableSettings;
    redirectToTrackablePage?: boolean | undefined;
  },
  {
    previous: unknown;
  }
>;

interface ITrackableContext {
  trackable: UseQueryResult<ITrackable, Error>["data"];
  query: UseQueryResult<ITrackable, Error>;
  mutation: MutationTrackable;
  update: MutationTrackable["mutateAsync"];
  settingsMutation: MutationSettings;
  settingsUpdate: MutationSettings["mutateAsync"];
  settingsUpdatePartial: (v: Partial<ITrackableSettings>) => Promise<void>;
}

const TrackableContext = createContext<ITrackableContext | null>(null);

const TrackableProvider = ({
  id,
  children,
}: {
  id: ITrackable["id"];
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["trackable", id],
    queryFn: async () => {
      return await RSAGetTrackable({ trackableId: id });
    },
  });

  const updateHandler = async (update: Omit<ITrackableUpdate, "id">) => {
    return await RSAUpdateTrackable({ ...update, id });
  };

  const updateMutation = useMutation({
    mutationFn: updateHandler,
    onMutate: async (upd) => {
      await queryClient.cancelQueries({ queryKey: ["trackable", id] });

      const previous = queryClient.getQueryData(["trackable", id]);

      queryClient.setQueryData(["trackable", id], (old: ITrackable) =>
        updateData(old, upd),
      );
      return { previous };
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(["trackable", id], context.previous);
    },
  });

  const updateSettingsHander = async ({
    data,
    redirectToTrackablePage,
  }: {
    data: ITrackableSettings;
    redirectToTrackablePage?: boolean;
  }) => {
    await RSAUpdateTrackableSettings({
      trackableId: id,
      data,
      redirectToTrackablePage,
    });
  };

  const settingsMutation = useMutation({
    mutationFn: updateSettingsHander,
    onMutate: async (upd) => {
      if (upd.redirectToTrackablePage) return;
      await queryClient.cancelQueries({ queryKey: ["trackable", id] });

      const previous = queryClient.getQueryData(["trackable", id]);

      queryClient.setQueryData(["trackable", id], (old: ITrackable) => {
        old.settings = upd.data;
        return old;
      });
      return { previous };
    },
    onError: (_, update, context) => {
      if (!context || update.redirectToTrackablePage) return;
      queryClient.setQueryData(["trackable", id], context.previous);
    },
  });

  const settingsUpdatePartial = async (update: Partial<ITrackableSettings>) => {
    const previous = queryClient.getQueryData(["trackable", id]) as ITrackable;

    if (!previous) throw new Error("settingsUpdatePartial: no present data");

    await settingsMutation.mutateAsync({
      data: { ...previous.settings, ...update },
    });
  };

  return (
    <TrackableContext.Provider
      value={{
        trackable: query.data,
        query,
        mutation: updateMutation,
        update: updateMutation.mutateAsync,
        settingsMutation,
        settingsUpdate: settingsMutation.mutateAsync,
        settingsUpdatePartial,
      }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export const useTrackableContextSafe = () => {
  const stuff = useContext(TrackableContext);

  if (!stuff) throw new Error("useTrackableContextSafe: no data in context");

  return stuff;
};

export default TrackableProvider;
