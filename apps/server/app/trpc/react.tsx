import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";

import type { AppRouter } from "@tyl/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  return `http://localhost:${process.env.PORT ?? 3001}`;
};

export const api = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    
    httpBatchLink({
      url: getBaseUrl() + "/trpc",
    }),
  ],
});
