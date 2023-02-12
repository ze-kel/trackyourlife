import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { api } from "src/utils/api";
import type { IUserSettings } from "@t/user";

export interface IUserSettingsContextData {
  userSettings: IUserSettings;
  changeSettings: (v: IUserSettings) => void;
}

export const TrackableContext = createContext<IUserSettingsContextData | null>(
  null
);

const UserSettingsProvider = ({
  settings: userSettings,
  children,
}: {
  settings: IUserSettings;
  children: ReactNode;
}) => {
  const qContext = api.useContext();

  const mutation = api.user.updateUserSettings.useMutation({
    async onMutate(change) {
      await qContext.user.getUserSettings.cancel();

      const before = qContext.user.getUserSettings.getData() as IUserSettings;

      qContext.user.getUserSettings.setData(undefined, change);

      return { change, before };
    },
    onError: (err, _, context) => {
      if (!context || !context.before) {
        throw new Error(
          "Error when updating, unable to retrieve rollback value"
        );
      }

      qContext.user.getUserSettings.setData(undefined, context.before);
    },
  });

  return (
    <TrackableContext.Provider
      value={{
        userSettings,
        changeSettings: mutation.mutate,
      }}
    >
      {children}
    </TrackableContext.Provider>
  );
};

export const useUserSettingsSafe = () => {
  const { userSettings, changeSettings } = useContext(TrackableContext) ?? {};

  if (!userSettings || !changeSettings) {
    throw new Error("Context error: no user settings awailable");
  }

  return {
    userSettings,
    changeSettings,
  };
};

export default UserSettingsProvider;
