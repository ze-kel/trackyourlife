import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { fromNodeMiddleware } from "vinxi/http";

import { appRouter, createTRPCContext } from "@tyl/api";

const createContext = async (ctx) => {
  console.log("TRPC REQ", ctx.context);

  return createTRPCContext({
    source: "unknown",
    session: null,
    user: null,
  });
};

const handler = createHTTPHandler({
  router: appRouter,
  createContext: (ctx) => {
    return createContext(ctx);
  },
  onError({ error, path }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
  },
});

export default fromNodeMiddleware((req, res) => {
  req.context = { hello: "hello" };

  req.url = req.url.replace(import.meta.env.BASE_URL, "");
  return handler(req, res);
});
