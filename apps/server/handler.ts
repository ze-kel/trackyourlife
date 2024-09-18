import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { eventHandler } from "vinxi/http";

import { appRouter, createTRPCContext } from "@tyl/api";

import { useAppSession } from "./app/utils/session";

const createContext = async () => {
  const s = await useAppSession();

  console.log("APP SESSION", s.data);

  return createTRPCContext({
    user: s.data.id
      ? {
          id: s.data.id as string,
        }
      : null,
    source: "",
  });
};

const handler = createHTTPHandler({
  router: appRouter,
  createContext: () => {
    return createContext();
  },
  onError({ error, path }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
  },
});

export default eventHandler(async (event) => {
  const s = await useAppSession();

  console.log("EVENT HANDLER CTX", s.data);

  return handler(event.node.req, event.node.res);
});
