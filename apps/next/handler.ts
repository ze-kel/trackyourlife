import { IncomingMessage } from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { eventHandler } from "vinxi/http";

import { appRouter, createTRPCContext } from "@tyl/api";

const createContext = async (ctx: IncomingMessage) => {
  return createTRPCContext({
    source: "unknown",
    session: ctx.context.session,
    user: ctx.context.user,
  });
};

const handler = createHTTPHandler({
  router: appRouter,
  createContext: (ctx) => {
    return createContext(ctx.req);
  },
  onError({ error, path }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
  },
});

export default eventHandler(async (event) => {
  event.node.req.context = event.context;

  return handler(event.node.req, event.node.res);
});
