"use client";

import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Session, User } from "lucia";

import type { IUserSettings } from "@tyl/validators/user";
import { UserSettingsFallback } from "@tyl/validators/user";

import { api } from "~/trpc/react";

interface IUserContext {
  settings?: IUserSettings;
  user: User | null;
  session: Session | null;
  updateSettings?: (v: IUserSettings) => Promise<unknown>;
  updateSettingsPartial?: (update: Partial<IUserSettings>) => Promise<unknown>;
}

const UserContext = createContext<IUserContext>({
  user: null,
  session: null,
});

const QUERY_KEY = ["user", "settings"];

const UserProvider = ({
  user,
  session,
  initialSettings,
  children,
}: {
  user: User | null;
  session: Session | null;
  children: ReactNode;
  initialSettings: IUserSettings;
}) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      return await api.userRouter.getUserSettings.query();
    },
    initialData: initialSettings,
    refetchOnWindowFocus: false,
  });

  const settingsMutation = useMutation({
    mutationFn: api.userRouter.updateUserSettings.mutate,
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
    <UserContext.Provider
      value={{
        settings: data,
        updateSettings: settingsMutation.mutateAsync,
        updateSettingsPartial,
        user,
        session,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const userUserContext = () => {
  const { settings, updateSettings, updateSettingsPartial, user, session } =
    useContext(UserContext);

  if (!settings || !updateSettings || !updateSettingsPartial) {
    throw new Error("userUserContext error");
  }

  return { settings, updateSettings, updateSettingsPartial, user, session };
};

export default UserProvider;
