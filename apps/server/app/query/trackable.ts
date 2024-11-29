import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  ITrackable,
  ITrackableDataMonth,
  ITrackableSettings,
  ITrackableUpdate,
} from "@tyl/validators/trackable";

import { TrackableContext } from "~/components/Providers/TrackableProvider";
import { invalidateTrackablesList } from "~/query/trackablesList";
import { trpc } from "~/trpc/react";

export const useTrackableIdSafe = () => {
  const stuff = useContext(TrackableContext);

  if (!stuff) throw new Error("useTrackableContextSafe: no data in context");

  return stuff;
};

export const useTrackableQueryByMonth = ({
  month,
  year,
  id,
}: {
  id: string;
  month: number;
  year: number;
}) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["trackable", id, year, month],
    queryFn: async () => {
      const trackable = await trpc.trackablesRouter.getTrackableById.query({
        id,
        limits: {
          type: "month",
          year,
          month,
        },
      });

      queryClient.setQueryData(["trackable", id], {
        ...trackable,
        data: {},
        settings: {},
      });
      queryClient.setQueryData(
        ["trackable", id, "settings"],
        trackable.settings,
      );

      return trackable.data[year]?.[month] ?? {};
    },
  });
};

export const useTrackableMeta = ({ id }: { id: ITrackable["id"] }) => {
  // This only contains trackable basic info(name, note, id)
  return useQuery({
    queryKey: ["trackable", id],
    queryFn: async () => {
      return await trpc.trackablesRouter.getTrackableById.query({
        id,
        limits: { type: "last", days: 7 },
      });
    },
    refetchOnReconnect: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useTrackableSettings = ({ id }: { id: ITrackable["id"] }) => {
  return useQuery({
    queryKey: ["trackable", id, "settings"],
    queryFn: async () => {
      return await trpc.trackablesRouter.getTrackableSettings.query({ id: id });
    },
    refetchOnReconnect: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useTrackableUpdateMutation = ({
  id,
}: {
  id: ITrackable["id"];
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (update: Omit<ITrackableUpdate, "id">) => {
      return await trpc.trackablesRouter.updateTrackableEntry.mutate({
        ...update,
        id,
      });
    },
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
};

export const useTrackableSettingsMutation = ({
  id,
}: {
  id: ITrackable["id"];
}) => {
  const queryClient = useQueryClient();
  const settingsMutation = useMutation({
    mutationFn: async (data: ITrackableSettings) => {
      await trpc.trackablesRouter.updateTrackableSettings.mutate({
        id,
        newSettings: data,
      });
    },
    onMutate: async (upd) => {
      await queryClient.cancelQueries({
        queryKey: ["trackable", id, "settings"],
      });
      const previous = queryClient.getQueryData<ITrackableSettings>([
        "trackable",
        id,
        "settings",
      ]);
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
    const previous = queryClient.getQueryData<ITrackableSettings>([
      "trackable",
      id,
      "settings",
    ]);

    if (!previous) throw new Error("settingsUpdatePartial: no present data");

    await settingsMutation.mutateAsync({
      ...previous,
      ...update,
    });
  };
  return { settingsUpdatePartial, settingsMutation };
};

export const useTrackableNameMutation = (id: ITrackable["id"]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newName: string) => {
      await trpc.trackablesRouter.updateTrackableName.mutate({ id, newName });
    },
    onMutate: (upd) => {
      const previous = queryClient.getQueryData<ITrackable>(["trackable", id]);
      queryClient.setQueryData(["trackable", id], { ...previous, name: upd });
      return { previous };
    },
    onSuccess: async () => {
      await invalidateTrackablesList(queryClient);
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(["trackable", id], context.previous);
    },
  });
};

export const useTrackableNoteMutation = (id: ITrackable["id"]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (note: string) => {
      await trpc.trackablesRouter.updateTrackableNote.mutate({ id, note });
    },
    onMutate: (upd) => {
      const previous = queryClient.getQueryData<ITrackable>(["trackable", id]);
      queryClient.setQueryData(["trackable", id], { ...previous, note: upd });
      return { previous };
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(["trackable", id], context.previous);
    },
  });
};
