"use client";

import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ITrackable,
  ITrackableDataMonth,
  ITrackableSettings,
  ITrackableUpdate,
} from "@tyl/validators/trackable";

import { MemoDayCellProvider } from "~/components/Providers/DayCellProvider";
import { api } from "~/trpc/react";

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
  ITrackableSettings,
  {
    previous: unknown;
  }
>;

type MutationName = UseMutationResult<
  void,
  Error,
  string,
  {
    previous: unknown;
  }
>;

interface ITrackableContext {
  id: ITrackable["id"];
  trackable: UseQueryResult<ITrackable, Error>["data"];
  trackableQuery: UseQueryResult<ITrackable, Error>;
  mutation: MutationTrackable;
  update: MutationTrackable["mutateAsync"];
  updateName: MutationName["mutateAsync"];
  settings: UseQueryResult<ITrackable["settings"], Error>["data"];
  settingsQuery: UseQueryResult<ITrackable["settings"], Error>;
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
      return await api.trackablesRouter.getTrackableById.query({
        id,
        limits: { type: "last", days: 7 },
      });
    },
  });

  const updateHandler = async (update: Omit<ITrackableUpdate, "id">) => {
    return await api.trackablesRouter.updateTrackableEntry.mutate({
      ...update,
      id,
    });
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
      return await api.trackablesRouter.getTrackableSettings.query({ id: id });
    },
  });

  const updateSettingsHandler = async (data: ITrackableSettings) => {
    await api.trackablesRouter.updateTrackableSettings.mutate({
      id,
      newSettings: data,
    });
  };

  const settingsMutation = useMutation({
    mutationFn: updateSettingsHandler,
    onMutate: async (upd) => {
      await queryClient.cancelQueries({
        queryKey: ["trackable", id, "settings"],
      });

      const previous = queryClient.getQueryData([
        "trackable",
        id,
        "settings",
      ]) as ITrackableSettings;

      queryClient.setQueryData(["trackable", id, "settings"], upd);

      return { previous };
    },
    onError: (_, update, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["trackable", id, "settings"],
          context.previous,
        );
      }
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
      ...previous,
      ...update,
    });
  };

  const nameMutation = useMutation({
    mutationFn: async (newName: string) => {
      await api.trackablesRouter.updateTrackableName.mutate({ id, newName });
    },
    onMutate: (upd) => {
      const previous = queryClient.getQueryData([
        "trackable",
        id,
      ]) as ITrackable;

      queryClient.setQueryData(["trackable", id], { ...previous, name: upd });

      return { previous };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["trackables", "list"] });
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(["trackable", id], context.previous);
    },
  });

  return (
    <TrackableContext.Provider
      value={{
        id: id,
        trackable: query.data,
        trackableQuery: query,
        mutation: updateMutation,
        update: updateMutation.mutateAsync,
        updateName: nameMutation.mutateAsync,
        settings: settings.data,
        settingsQuery: settings,
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
