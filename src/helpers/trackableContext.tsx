import type { ITrackable, ITrackableUpdate } from "src/types/trackable";
import type { ReactNode} from "react";
import { useContext } from "react";
import { createContext } from "react";
import { api } from "src/utils/api";
import updateData from "./updateData";
import getData from "./getData";

type IChangeSettings = (
  someSettings: Partial<ITrackable["settings"]>
) => Promise<void>;

type IChangeDay = (update: ITrackableUpdate) => Promise<ITrackableUpdate>;

export interface IContextData {
  trackable: ITrackable;
  changeSettings: IChangeSettings;
  changeDay: IChangeDay;
  deleteTrackable: () => Promise<void>;
}

export const TrackableContext = createContext<IContextData | null>(null);

const TrackableProvider = ({
  children,
  trackable,
}: {
  children: ReactNode;
  trackable: ITrackable;
}) => {
  const qContext = api.useContext();

  const settingsMutation = api.trackable.updateTrackableSettings.useMutation({
    onSuccess(returned) {
      qContext.trackable.getTrackableById.setData(
        trackable.id,
        (data: ITrackable | undefined) => {
          if (!data) return;
          const newOne = { ...data, settings: returned };
          return newOne as ITrackable;
        }
      );
    },
  });

  const changeSettings: IChangeSettings = async (someSettings) => {
    const newSettings: ITrackable["settings"] = {
      ...trackable.settings,
      ...someSettings,
    };

    await settingsMutation.mutateAsync({
      settings: newSettings,
      id: trackable.id,
    });
  };

  const dayValueMutation = api.trackable.updateTrackableById.useMutation({
    async onMutate(change) {
      await qContext.trackable.getTrackableById.cancel(trackable.id);

      const data = qContext.trackable.getTrackableById.getData(trackable.id);
      if (!data) {
        throw new Error("Trying to mutate trackable that does not exist");
      }

      const rollback = getData(data, change);

      qContext.trackable.getTrackableById.setData(trackable.id, (original) => {
        if (!original) return;

        return updateData(original, change);
      });

      return { change, rollback };
    },
    onError: (err, newTodo, context) => {
      if (!context || !context.rollback) {
        throw new Error(
          "Error when updating, unable to retrieve rollback value"
        );
      }
      qContext.trackable.getTrackableById.setData(trackable.id, (original) => {
        if (!original) return;
        return updateData(original, context.rollback);
      });
    },
  });

  const changeDay: IChangeDay = dayValueMutation.mutateAsync;

  const deleteMutation = api.trackable.deleteTrackable.useMutation();

  const deleteTrackable = () => deleteMutation.mutateAsync(trackable.id);

  return (
    <TrackableContext.Provider
      value={{ trackable, changeSettings, changeDay, deleteTrackable }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export const useTrackableSafe = () => {
  const { trackable, changeSettings, changeDay, deleteTrackable } =
    useContext(TrackableContext) ?? {};

  if (!trackable || !changeSettings || !changeDay || !deleteTrackable) {
    throw new Error("Context error: no trackable awailable");
  }

  return { trackable, changeSettings, changeDay, deleteTrackable };
};

export default TrackableProvider;
