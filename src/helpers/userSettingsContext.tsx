import type { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import type { IUserSettings } from "@t/user";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface IUserSettingsContextData {
  userSettings: IUserSettings;
  changeSettings: (v: IUserSettings) => void;
}

export const TrackableContext = createContext<IUserSettingsContextData | null>(
  null,
);

const updateSettings = async (update: IUserSettings) => {
  const res = await fetch(`${getBaseUrl()}/user/settings`, {
    method: "POST",
    body: JSON.stringify(update),
  });
  const data = (await res.json()) as unknown;
  return data as IUserSettings;
};

const UserSettingsProvider = ({
  settings: userSettings,
  children,
}: {
  settings: IUserSettings;
  children: ReactNode;
}) => {
  const qClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["userSettings"],
    mutationFn: updateSettings,

    async onMutate(change) {
      await qClient.cancelQueries(["userSettings"]);

      const before = qClient.getQueryData(["userSettings"]) as IUserSettings;

      qClient.setQueryData(["userSettings"], change);

      return { change, before };
    },
    onError: (err, _, context) => {
      if (!context || !context.before) {
        throw new Error(
          "Error when updating, unable to retrieve rollback value",
        );
      }

      qClient.setQueryData(["userSettings"], context.before);
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
