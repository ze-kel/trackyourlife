"use client";
import { MemoDayCellProvider } from "@components/Providers/DayCellProvider";
import type {
  ITrackable,
  ITrackableDataMonth,
  ITrackableSettings,
  ITrackableUpdate,
} from "@t/trackable";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import {
  RSAGetTrackable,
  RSAGetTrackableSettings,
  RSAUpdateTrackable,
  RSAUpdateTrackableSettings,
} from "src/app/api/trackables/serverActions";

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
  id: ITrackable["id"];
  trackable: UseQueryResult<ITrackable, Error>["data"];
  query: UseQueryResult<ITrackable, Error>;
  mutation: MutationTrackable;
  update: MutationTrackable["mutateAsync"];
  settings: UseQueryResult<ITrackable["settings"], Error>["data"];
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
      await queryClient.cancelQueries({
        queryKey: ["trackable", id, upd.year, upd.month],
      });

      const previous = queryClient.getQueryData([
        "trackable",
        id,
        upd.year,
        upd.month,
      ]);

      queryClient.setQueryData(
        ["trackable", id, upd.year, upd.month],
        (old: ITrackableDataMonth) => {
          old[upd.day] = upd.value;
          return old;
        },
      );
      return { previous };
    },
    onError: (_, upd, context) => {
      if (!context) return;
      queryClient.setQueryData(
        ["trackable", id, upd.year, upd.month],
        context.previous,
      );
    },
  });

  const settings = useQuery({
    queryKey: ["trackable", id, "settings"],
    queryFn: async () => {
      return await RSAGetTrackableSettings({ trackableId: id });
    },
  });

  const updateSettingsHandler = async ({
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
    mutationFn: updateSettingsHandler,
    onMutate: async (upd) => {
      await queryClient.cancelQueries({
        queryKey: ["trackable", id, "settings"],
      });

      const previous = queryClient.getQueryData(["trackable", id, "settings"]);

      queryClient.setQueryData(["trackable", id, "settings"], upd.data);

      return { previous };
    },
    onError: (_, update, context) => {
      if (!context || update.redirectToTrackablePage) return;
      queryClient.setQueryData(["trackable", id, "settings"], context.previous);
    },
  });

  const settingsUpdatePartial = async (update: Partial<ITrackableSettings>) => {
    const previous = queryClient.getQueryData([
      "trackable",
      id,
      "settings",
    ]) as ITrackable["settings"];

    if (!previous) throw new Error("settingsUpdatePartial: no present data");

    await settingsMutation.mutateAsync({
      data: { ...previous, ...update },
    });
  };

  return (
    <TrackableContext.Provider
      value={{
        id: id,
        trackable: query.data,
        query,
        mutation: updateMutation,
        update: updateMutation.mutateAsync,
        settings: settings.data,
        settingsMutation,
        settingsUpdate: settingsMutation.mutateAsync,
        settingsUpdatePartial,
      }}
    >
      <MemoDayCellProvider type={query.data?.type} settings={settings.data}>
        {children}
      </MemoDayCellProvider>
    </TrackableContext.Provider>
  );
};

export const useTrackableContextSafe = () => {
  const stuff = useContext(TrackableContext);

  if (!stuff) throw new Error("useTrackableContextSafe: no data in context");

  return stuff;
};

export default TrackableProvider;
