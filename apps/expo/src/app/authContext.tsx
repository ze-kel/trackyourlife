import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";

import { updateTrpcClient } from "~/utils/api";

const key = "user_data";
const zUserData = z.object({
  token: z.string(),
  host: z.string(),
});

type IUserData = z.infer<typeof zUserData>;

export const getUserData = () => {
  try {
    const r = SecureStore.getItem(key);

    if (!r) return;
    return zUserData.parse(JSON.parse(r));
  } catch {
    return;
  }
};

export const setUserData = async (data: IUserData) => {
  await SecureStore.setItemAsync(key, JSON.stringify(data));
  updateTrpcClient();
};

export const clearUserData = async () => {
  await SecureStore.deleteItemAsync(key);
};

const AuthContext = createContext<{
  signIn: (data: IUserData) => void;
  signOut: () => void;
  userData?: IUserData;
}>({
  signIn: setUserData,
  signOut: clearUserData,
  userData: undefined,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [uData, setUdata] = useState(getUserData());

  return (
    <AuthContext.Provider
      value={{
        signIn: (data: IUserData) => {
          setUserData(data);
          setUdata(data);
        },
        signOut: async () => {
          await clearUserData();
          setUdata(undefined);
        },
        userData: uData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
