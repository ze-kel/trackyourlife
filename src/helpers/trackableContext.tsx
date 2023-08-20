import type {
  ITrackable,
  ITrackableSettings,
  ITrackableUpdate,
} from 'src/types/trackable';
import type { ReactNode } from 'react';
import { useContext } from 'react';
import { createContext } from 'react';
import updateData from './updateData';
import getData from './getData';
import { getBaseUrl } from 'src/helpers/getBaseUrl';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type IChangeSettings = (
  someSettings: Partial<ITrackable['settings']>
) => Promise<void>;

type IChangeDay = (update: ITrackableUpdate) => Promise<ITrackableUpdate>;

export interface IContextData {
  trackable: ITrackable;
  changeSettings: IChangeSettings;
  changeDay: IChangeDay;
  deleteTrackable: () => Promise<void>;

  rangeLabelMapping?: Record<string, string>;
}

export const TrackableContext = createContext<IContextData | null>(null);

const changeSettingsApi = async ({
  id,
  settings,
}: {
  id: string;
  settings: ITrackableSettings;
}) => {
  const res = await fetch(`${getBaseUrl()}/api/trackables/${id}/settings`, {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
  const data = (await res.json()) as unknown;
  return data as ITrackableSettings;
};

const changeDayApi = async (update: ITrackableUpdate) => {
  console.log('changeDayApi', update);

  const res = await fetch(`${getBaseUrl()}/api/trackables/${update.id}`, {
    method: 'POST',
    body: JSON.stringify(update),
  });
  const data = (await res.json()) as unknown;
  return data as ITrackableUpdate;
};

const changeDayDelete = async (id: string) => {
  await fetch(`${getBaseUrl()}/api/trackables/${id}`, {
    method: 'DELETE',
  });
};

const TrackableProvider = ({
  children,
  trackable,
}: {
  children: ReactNode;
  trackable: ITrackable;
}) => {
  const qClient = useQueryClient();

  const settingsMutation = useMutation({
    mutationFn: changeSettingsApi,
    onSuccess(returned) {
      qClient.setQueryData(
        ['trackable', trackable.id],
        (data: ITrackable | undefined) => {
          if (!data) return;
          const newOne = { ...data, settings: returned };
          return newOne as ITrackable;
        }
      );
    },
  });

  const changeSettings: IChangeSettings = async (someSettings) => {
    const newSettings: ITrackable['settings'] = {
      ...trackable.settings,
      ...someSettings,
    };

    await settingsMutation.mutateAsync({
      settings: newSettings,
      id: trackable.id,
    });
  };

  const dayValueMutation = useMutation({
    mutationFn: changeDayApi,
    onMutate(change) {
      const data = qClient.getQueryData(['trackable', trackable.id]) as
        | ITrackable
        | undefined;

      if (!data) {
        throw new Error('Trying to mutate trackable that does not exist');
      }

      console.log('ON MUTATE', { change, data });
      const rollback = getData(data, change);

      qClient.setQueryData(
        ['trackable', trackable.id],
        (original: ITrackable | undefined) => {
          if (!original) return;

          return updateData(original, change);
        }
      );

      return { change, rollback };
    },
    onError: (err, _, context) => {
      console.log('err', err);
      console.log('context', context);

      if (!context || !context.rollback) {
        throw new Error(
          'Error when updating, unable to retrieve rollback value'
        );
      }
      qClient.setQueryData(
        ['trackable', trackable.id],
        (original: ITrackable | undefined) => {
          if (!original) return;
          return updateData(original, context.rollback);
        }
      );
    },
  });

  const changeDay: IChangeDay = dayValueMutation.mutateAsync;

  const deleteMutation = useMutation({ mutationFn: changeDayDelete });

  const deleteTrackable = () => deleteMutation.mutateAsync(trackable.id);

  const rangeLabelMapping = getRangeLabelMapping(trackable);

  return (
    <TrackableContext.Provider
      value={{
        trackable,
        changeSettings,
        changeDay,
        deleteTrackable,
        rangeLabelMapping,
      }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export const useTrackableSafe = () => {
  const {
    trackable,
    changeSettings,
    changeDay,
    deleteTrackable,
    rangeLabelMapping,
  } = useContext(TrackableContext) ?? {};

  if (!trackable || !changeSettings || !changeDay || !deleteTrackable) {
    throw new Error('Context error: no trackable awailable');
  }

  return {
    trackable,
    changeSettings,
    changeDay,
    deleteTrackable,
    rangeLabelMapping,
  };
};

const getRangeLabelMapping = (trackable: ITrackable) => {
  if (trackable.type !== 'range' || !trackable.settings.labels) return;

  const labels = trackable.settings.labels;

  const map: Record<string, string> = {};
  labels.forEach((v) => {
    map[v.internalKey] = v.emojiShortcode;
  });

  return map;
};

export default TrackableProvider;
