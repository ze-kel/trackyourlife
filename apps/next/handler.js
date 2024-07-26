import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { fromNodeMiddleware } from "vinxi/http";

import { appRouter, createTRPCContext } from "@tyl/api";

const createContext = async (req) => {
  return createTRPCContext({
    headers: req.req.headers,
    session: null,
    user: null,
  });
};

const handler = createHTTPHandler({
  router: appRouter,
  createContext: (req) => createContext(req),
  onError({ error, path }) {
    console.error(`>>> tRPC Error on '${path}'`, error);
  },
});

export default fromNodeMiddleware((req, res) => {
  console.log(req.url);
  req.url = req.url.replace(import.meta.env.BASE_URL, "");
  return handler(req, res);
});
