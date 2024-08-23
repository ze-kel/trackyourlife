import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

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
        signIn: (data: IUserData) => {
          setUserData(data);
          setUdata(data);
          updateTrpcClient();
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
