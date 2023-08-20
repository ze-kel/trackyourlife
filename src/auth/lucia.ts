// auth/lucia.ts
import { lucia } from "lucia";
import { nextjs } from "lucia/middleware";
import { env } from "src/env/server.mjs";
import { prisma as prismaAdapter } from "@lucia-auth/adapter-prisma";
import "lucia/polyfill/node";
import { prisma } from "../app/api/db";

// expect error
export const auth = lucia({
  env: env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs(),
  sessionCookie: {
    expires: false, // only for projects deployed to the edge
  },
  adapter: prismaAdapter(prisma),
  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
