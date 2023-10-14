import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";
import { env } from "src/env/server.mjs";
import "lucia/polyfill/node";
import { pg as postgresAdapter } from "@lucia-auth/adapter-postgresql";
import { pool } from "src/app/api/db";

const tableNames = {
  user: "auth_user",
  key: "user_key",
  session: "user_session",
};

// expect error
export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs(),
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
  adapter: postgresAdapter(pool, tableNames),
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
