import { ITrackable, ITrackableUpdate } from "@t/trackable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { update, updateSettings } from "src/helpers/api";

type IChangeSettings = (someSettings: Partial<ITrackable["settings"]>) => void;
type IChangeDay = (update: ITrackableUpdate) => void;

export interface IContextData {
  trackable: ITrackable;
  changeSettings: IChangeSettings;
  changeDay: IChangeDay;
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

  const settingsMutation = useMutation(
    (settings: ITrackable["settings"]) => {
      return updateSettings(trackable._id, settings);
    },
    {
      onSuccess(data, variables) {
        queryClient.setQueryData(
          ["trackable", trackable._id],
          (data: ITrackable) => {
            const newOne = { ...data, settings: variables };
            return newOne;
          }
        );
      },
    }
  );

  const changeSettings: IChangeSettings = async (someSettings) => {
    const newSettings: ITrackable["settings"] = {
      ...trackable.settings,
      ...someSettings,
    };

    await settingsMutation.mutateAsync(newSettings);
  };

  const dayValueMutation = useMutation(
    ({ day, month, year, value }: ITrackableUpdate) => {
      return update(trackable._id, { year, month, day, value });
    },
    {
      onSuccess(data) {
        queryClient.setQueryData(["trackable", trackable._id], data);
      },
    }
  );

  const changeDay: IChangeDay = dayValueMutation.mutateAsync;

  return (
    <TrackableContext.Provider value={{ trackable, changeSettings, changeDay }}>
      {children}
    </TrackableContext.Provider>
  );
};

export default TrackableProvider;
