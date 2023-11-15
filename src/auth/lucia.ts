import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
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
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
  adapter: postgresAdapter(pool, tableNames),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      role: data.role,
    };
  },
  experimental: {
    debugMode: false,
  },
});

export type Auth = typeof auth;
