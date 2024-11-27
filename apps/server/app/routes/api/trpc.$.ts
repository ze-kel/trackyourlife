import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@tyl/api";

import { getAuthSession } from "~/auth/auth";

const createContext = async () => {
  const s = await getAuthSession();

  console.log("creating context", s);

  return createTRPCContext({
    user: s.session
      ? {
          id: s.session?.userId as string,
        }
      : null,
    source: "",
  });
};

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    createContext,
    router: appRouter,
    endpoint: "/api/trpc",
  });
}

export const Route = createAPIFileRoute("/api/trpc/$")({
  GET: handler,
  POST: handler,
});
