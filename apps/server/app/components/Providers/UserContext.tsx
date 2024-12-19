import { createContext, useContext } from "react";
import { ReactNode, redirect } from "@tanstack/react-router";

import type { DbUserSelect } from "@tyl/db/schema";
import { IUserSettings } from "@tyl/validators/user";

import { Spinner } from "~/@shad/components/spinner";
import { useZeroUser } from "~/utils/useZ";

const UserContext = createContext<{
  user:
    | (Omit<DbUserSelect, "hashedPassword" | "role"> & {
        settings?: IUserSettings;
      })
    | null;
}>({
  user: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, uInfo] = useZeroUser();

  if (uInfo.type !== "complete")
    return (
      <div>
        <Spinner />
      </div>
    );

  if (!user) {
    throw redirect({ to: "/login" });
  }

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export const useUserSafe = () => {
  const { user } = useUser();
  if (!user) {
    throw redirect({ to: "/login" });
  }
  return user;
};
