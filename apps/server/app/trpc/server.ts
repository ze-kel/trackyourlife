import { createCaller, createTRPCContext } from "@tyl/api";

import { useAppSession } from "../utils/session";

const createContext = async () => {
  const s = await useAppSession();

  return createTRPCContext({
    user: s.data.id
      ? {
          id: s.data.id as string,
        }
      : null,
    source: "",
  });
};

export const apiS = createCaller(createContext);
