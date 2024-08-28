import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { hookstate, useHookstate } from "@hookstate/core";
import { subscribable } from "@hookstate/subscribable";
import { eq } from "drizzle-orm";

import {
  IUserSettings,
  UserSettingsFallback,
  ZUserSettings,
} from "@tyl/validators/user";

import { UserDataSub } from "~/data/dbWatcher";
import { db } from "~/db";
import { authUser } from "~/db/schema";
import { updateTrpcClient } from "~/utils/api";
import {
  clearUserData,
  getUserData,
  ISessionData,
  setUserData,
} from "~/utils/session-store";

export const currentUser = hookstate(getUserData(), subscribable());

export const currentUserSettings =
  hookstate<IUserSettings>(UserSettingsFallback);

export const currentUserInfo = hookstate<{ username?: string; email?: string }>(
  { username: "", email: "" },
);

const getUserSettingsFromDb = async (userId?: string) => {
  if (!userId) return;
  const res = await db.query.authUser.findFirst({
    where: eq(authUser.id, userId),
  });

  if (res?.settings) {
    const parsed = ZUserSettings.safeParse(res.settings);

    if (parsed.success) {
      currentUserSettings.set(parsed.data);
    }
  }

  currentUserInfo.set({
    username: res?.username || undefined,
    email: res?.email || undefined,
  });

  return;
};

getUserSettingsFromDb(currentUser.get()?.userId);

let userDataDbSub: undefined | (() => void);

const subscribeToSettingsUpdates = (userId?: string) => {
  if (!userId) return;
  userDataDbSub = UserDataSub.subscribe({ id: userId }, (a) => {
    try {
      const unJsoned = JSON.parse(a.settings as unknown as string);
      const parsed = ZUserSettings.parse(unJsoned);
      currentUserSettings.set(parsed);
    } catch (e) {
      console.log(e);
      currentUserSettings.set(UserSettingsFallback);
    }

    currentUserInfo.set({
      username: a.username || undefined,
      email: a.email || undefined,
    });
  });
};

subscribeToSettingsUpdates(currentUser.get()?.userId);

currentUser.subscribe((v) => {
  if (userDataDbSub) {
    userDataDbSub();
  }
  subscribeToSettingsUpdates(v?.userId);
});

const AuthContext = createContext<{
  signIn: (data: ISessionData) => void;
  signOut: () => void;
  userData?: ISessionData;
}>({
  signIn: setUserData,
  signOut: clearUserData,
  userData: undefined,
});

export function useSession() {
  const value = useContext(AuthContext);

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const user = useHookstate(currentUser);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (data: ISessionData) => {
          await setUserData(data);
          user.set(data);
          updateTrpcClient();
        },
        signOut: async () => {
          await clearUserData();
          user.set(undefined);
        },
        userData: user.get(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
