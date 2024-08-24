import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@tyl/api";

import { getUserData } from "./session-store";

export { type RouterInputs, type RouterOutputs } from "@tyl/api";

export const getHostLink = (v?: string) =>
  v ? `${v}${v.endsWith("/") ? "" : "/"}` : "";

const makeTrpcClient = () => {
  const uData = getUserData();

  const url = `${getHostLink(uData?.host)}api/trpc`;

  console.log(url);

  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url,
        headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");

          const { token } = getUserData() || {};
          if (token) {
            headers.set("Cookie", `auth_session=${token}`);
          }

          return Object.fromEntries(headers);
        },
      }),
    ],
  });
};

export let api = makeTrpcClient();

export const updateTrpcClient = () => {
  api = makeTrpcClient();
};
