import { ITrackable, ITrackableUpdate } from "@t/trackable";
import { createContext, ReactNode } from "react";
import { trpc } from "src/utils/trpc";
import updateData from "./updateData";

type IChangeSettings = (someSettings: Partial<ITrackable["settings"]>) => void;
type IChangeDay = (update: ITrackableUpdate) => void;

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
  const qContext = trpc.useContext();

  const settingsMutation = trpc.trackable.updateTrackableSettings.useMutation({
    onSuccess(returned) {
      qContext.trackable.getTrackableById.setData(
        (data: ITrackable | undefined) => {
          if (!data) return;
          const newOne = { ...data, settings: returned };
          return newOne as ITrackable;
        },
        trackable.id
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

  const dayValueMutation = trpc.trackable.updateTrackableById.useMutation({
    onSuccess(result) {
      qContext.trackable.getTrackableById.setData((original) => {
        if (!original) return;

        return updateData(original, result);
      }, trackable.id);
    },
  });

  const changeDay: IChangeDay = dayValueMutation.mutateAsync;

  const deleteMutation = trpc.trackable.deleteTrackable.useMutation();

  const deleteTrackable = () => deleteMutation.mutateAsync(trackable.id);

  return (
    <TrackableContext.Provider
      value={{ trackable, changeSettings, changeDay, deleteTrackable }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export default TrackableProvider;
