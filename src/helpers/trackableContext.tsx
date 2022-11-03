import { ITrackable, ITrackableUpdate } from "@t/trackable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { update, updateSettings } from "src/helpers/api";
import { trpc } from "src/utils/trpc";

type IChangeSettings = (someSettings: Partial<ITrackable["settings"]>) => void;
type IChangeDay = (update: ITrackableUpdate) => void;

export interface IContextData {
  trackable: ITrackable;
  changeSettings: IChangeSettings;
  changeDay: IChangeDay;
  deleteTrackable: () => Promise<void>;
}

export const TrackableContext = createContext<IContextData>(null);

const TrackableProvider = ({
  children,
  trackable,
}: {
  children: ReactNode;
  trackable: ITrackable;
}) => {
  const queryClient = useQueryClient();

  const queryReference = [["trackable", "getTrackableById"], trackable._id];

  const settingsMutation = trpc.trackable.updateTrackableSettings.useMutation({
    onSuccess(returned, input) {
      queryClient.setQueryData(queryReference, (data: unknown) => {
        const newOne = { ...(data as ITrackable), settings: returned };
        console.log("newOne", newOne);
        return newOne;
      });
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
      queryClient.setQueryData(queryReference, result);
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
