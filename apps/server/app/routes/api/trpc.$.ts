import { createAPIFileRoute } from "@tanstack/start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createCaller, createTRPCContext } from "@tyl/api";

import { useAppSession } from "~/auth/session";

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

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    createContext,
    //@ts-expect-error
    router: appRouter,
    endpoint: "/api/trpc",
  });
}

export const Route = createAPIFileRoute("/api/trpc/$")({
  GET: handler,
  POST: handler,
});
