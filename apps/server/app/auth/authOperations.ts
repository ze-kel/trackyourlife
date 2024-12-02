import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { Argon2id } from "oslo/password";
import { deleteCookie } from "vinxi/http";
import { z } from "zod";

import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";

import {
  createSession,
  generateSessionToken,
  getAuthSession,
  invalidateSession,
  SESSION_COOKIE_NAME,
  setSessionTokenCookie,
} from "~/auth/auth";

export const loginValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginData = z.infer<typeof loginValidator>;

export const loginFn = createServerFn({ method: "POST" })
  .validator(loginValidator)
  .handler(async ({ data }) => {
    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, data.email.toLowerCase()),
    });

    if (!user) {
      return {
        ok: false,
        message: "No user found with these credentials",
      };
    }
    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      data.password,
    );

    if (!validPassword) {
      return {
        ok: false,
        message: "Incorrect password",
      };
    }

    const token = generateSessionToken();
    const session = await createSession(token, user.id);
    setSessionTokenCookie(token, session.expiresAt);

    return {
      ok: true,
    };
  });

export const registerValidator = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  username: z.string(),
});

export type RegisterData = z.infer<typeof registerValidator>;

export const registerFn = createServerFn({ method: "POST" })
  .validator(registerValidator)
  .handler(async ({ data }) => {
    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, data.email.toLowerCase()),
    });

    if (user) {
      return {
        ok: false,
        message: "User already exists",
      };
    }

    const hashedPassword = await new Argon2id().hash(data.password);
    const userId = crypto.randomUUID();
    await db.insert(auth_user).values({
      id: userId,
      email: data.email.toLowerCase(),
      hashedPassword,
      username: data.username.length > 0 ? data.username : "user",
      role: "user",
      settings: {},
    });

    const token = generateSessionToken();
    const session = await createSession(token, userId);
    setSessionTokenCookie(token, session.expiresAt);

    return {
      ok: true,
    };
  });

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const { session } = await getAuthSession({ refreshCookie: false });
  if (!session) {
    throw redirect({ to: "/login", statusCode: 401 });
  }

  deleteCookie(SESSION_COOKIE_NAME);
  await invalidateSession(session.id);

  throw redirect({ to: "/login", statusCode: 401 });
});

export const getUserFn = createServerFn({ method: "GET" }).handler(async () => {
  const { user } = await getAuthSession();
  return user;
});
