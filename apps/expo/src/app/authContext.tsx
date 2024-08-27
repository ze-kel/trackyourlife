import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

import { clearDB } from "~/db";
import { resetLastSync } from "~/db/syncContext";
import { updateTrpcClient } from "~/utils/api";
import {
  clearUserData,
  getUserData,
  IUserData,
  setUserData,
} from "~/utils/session-store";

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
        signIn: async (data: IUserData) => {
          await setUserData(data);
          setUdata(data);
          await resetLastSync();
          await 
          updateTrpcClient();
        },
        signOut: async () => {
          await clearUserData();
          await clearDB();
          setUdata(undefined);
        },
        userData: uData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
