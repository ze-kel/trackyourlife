import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import type { AppRouter } from "@tyl/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const trpc = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),

    httpBatchLink({
      transformer: SuperJSON,
      url: getBaseUrl() + "/api/trpc",
      async headers() {
        if (import.meta.env.SSR) {
          try {
            const { getHeaders } = await import("vinxi/http");
            return getHeaders();
          } catch (e) {
            console.error(e);
          }
        }

        return {};
      },
    }),
  ],
});
