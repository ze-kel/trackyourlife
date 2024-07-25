"use client";

import type {
  QueryClient,
  UseMutationResult,
  UseQueryResult,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { create, windowScheduler } from "@yornaath/batshit";

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
  useTrackableQueryByMonth: ({
    month,
    year,
  }: {
    month: number;
    year: number;
  }) => UseQueryResult<ITrackableDataMonth, Error>;
}

const TrackableContext = createContext<ITrackableContext | null>(null);

/*
  !--Storing & refetching trackable data--!
  For convenience in navigation we store info(id, name, type), settings and each months data separately.
  This means that when user navigates from trackables list to individual trackable we can reuse data that already was fetched.

  This introduces a problem of too much refetching. Because for each trackable we get 3 queries that become stale and want to refetch.
  To prevent that by default refetching is only enabled on month's query.
  When we fetch month we also get fresh info and settings, which are being updated explicitly.
*/
type Inp = { year: number; month: number };

const makeUseTrackableQueryByMonth = ({
  id,
  queryClient,
}: {
  id: string;
  queryClient: QueryClient;
}) => {
  // This batches requests for multiple months(i.e when we show graph for a year) into a single request
  const batcher = create({
    fetcher: async (dates: Inp[]) => {
      if (dates.length === 1) {
        const { year, month } = dates[0] as Inp;
        return await api.trackablesRouter.getTrackableById.query({
          id,
          limits: {
            type: "month",
            year,
            month,
          },
        });
      }
      dates.sort((a, b) => {
        const r = a.year - b.year;
        if (r !== 0) {
          return r;
        }
        return a.month - b.month;
      });

      const from = dates[0] as Inp;
      const to = dates[dates.length - 1] as Inp;
      return await api.trackablesRouter.getTrackableById.query({
        id,
        limits: {
          type: "range",
          from,
          to,
        },
      });
    },
    resolver: (data) => {
      return data;
    },
    scheduler: windowScheduler(30),
  });

  return ({ month, year }: { month: number; year: number }) => {
    return useQuery({
      queryKey: ["trackable", id, year, month],
      queryFn: async () => {
        const trackable = await batcher.fetch({ year, month });

        queryClient.setQueryData(["trackable", id], {
          ...trackable,
          data: {},
          settings: {},
        });
        queryClient.setQueryData(
          ["trackable", id, "settings"],
          trackable.settings,
        );

        return trackable.data[year]?.[month] || {};
      },
    });
  };
};

const TrackableProvider = ({
  id,
  children,
}: {
  id: ITrackable["id"];
  children: ReactNode;
}) => {
  const queryClient = useQueryClient();

  const useTrackableQueryByMonth = makeUseTrackableQueryByMonth({
    id,
    queryClient,
  });

  // This only contains trackable basic info(right now only the name)
  const query = useQuery({
    queryKey: ["trackable", id],
    queryFn: async () => {
      return await api.trackablesRouter.getTrackableById.query({
        id,
        limits: { type: "last", days: 7 },
      });
    },
    refetchOnReconnect: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // This contains settings
  const settings = useQuery({
    queryKey: ["trackable", id, "settings"],
    queryFn: async () => {
      return await api.trackablesRouter.getTrackableSettings.query({ id: id });
    },
    refetchOnReconnect: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
        useTrackableQueryByMonth,
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
