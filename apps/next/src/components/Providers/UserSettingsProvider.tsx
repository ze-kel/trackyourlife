"use client";
import { UserSettingsFallback, type IUserSettings } from "@tyl/validators/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import {
  RSAGetUserSettings,
  RSAUpdateUserSettings,
} from "src/app/api/user/settings/serverActions";

interface ISettingsContext {
  settings?: IUserSettings;
  updateSettings?: (v: IUserSettings) => Promise<unknown>;
  updateSettingsPartial?: (update: Partial<IUserSettings>) => Promise<unknown>;
}

const SettingsContext = createContext<ISettingsContext>({});

const QUERY_KEY = ["user", "settings"];

const UserSettingsProvider = ({
  initialSettings,
  children,
}: {
  children: ReactNode;
  initialSettings: IUserSettings;
}) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await RSAGetUserSettings();
    },
    initialData: initialSettings,
  });

  const updateSettingsHandler = async (v: IUserSettings) => {
    return await RSAUpdateUserSettings(v);
  };

  const settingsMutation = useMutation({
    mutationFn: updateSettingsHandler,
    onMutate: async (upd) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEY,
      });

      const previous = queryClient.getQueryData(QUERY_KEY);

      queryClient.setQueryData(QUERY_KEY, upd);

      return { previous };
    },
    onError: (_, update, context) => {
      if (!context) return;
      queryClient.setQueryData(QUERY_KEY, context.previous);
    },
  });

  const updateSettingsPartial = async (update: Partial<IUserSettings>) => {
    const previous = queryClient.getQueryData([QUERY_KEY]) || {};

    await settingsMutation.mutateAsync({
      ...UserSettingsFallback,
      ...previous,
      ...update,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: data,
        updateSettings: settingsMutation.mutateAsync,
        updateSettingsPartial,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const { settings, updateSettings, updateSettingsPartial } =
    useContext(SettingsContext);

  if (!settings || !updateSettings || !updateSettingsPartial) {
    throw new Error("UserSettingsContext error");
  }

  return { settings, updateSettings, updateSettingsPartial };
};

export default UserSettingsProvider;
