import { ITrackable, ITrackableUpdate } from "@t/trackable";
import { createContext, ReactNode } from "react";
import { trpc } from "src/utils/trpc";

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
          console.log("setData", data);
          if (!data) return;
          const newOne = { ...data, settings: returned};
          console.log("result", newOne);
          return newOne as ITrackable;
        },
        trackable._id
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
      _id: trackable._id,
    });
  };

  const dayValueMutation = trpc.trackable.updateTrackableById.useMutation({
    onSuccess(result) {
      qContext.trackable.getTrackableById.setData(result, trackable._id);
    },
  });

  const changeDay: IChangeDay = dayValueMutation.mutateAsync;

  const deleteMutation = trpc.trackable.deleteTrackable.useMutation();

  const deleteTrackable = () => deleteMutation.mutateAsync(trackable._id);

  return (
    <TrackableContext.Provider
      value={{ trackable, changeSettings, changeDay, deleteTrackable }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export default TrackableProvider;
