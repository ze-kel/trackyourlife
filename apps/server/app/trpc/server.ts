import { createCaller, createTRPCContext } from "@tyl/api";

import { getAuthSession } from "~/auth/auth";

const createContext = async () => {
  const s = await getAuthSession();

  return createTRPCContext({
    user: s.session
      ? {
          id: s.session?.userId as string,
        }
      : null,
    source: "",
  });
};

export const apiS = createCaller(createContext);
