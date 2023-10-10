import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";
import { env } from "src/env/server.mjs";
import "lucia/polyfill/node";
import { postgres as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { queryClient } from "src/app/api/db";

const tableNames = {
  user: "user",
  key: "key",
  session: "session",
};

// expect error
export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs(),
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
  adapter: postgresAdapter(queryClient, tableNames),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
  experimental: {
    debugMode: false,
  },
});

export type Auth = typeof auth;
