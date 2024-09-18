import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, json } from "@tanstack/start";

import { Argon2id, lucia } from "@tyl/auth";
import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";

import { Login } from "~/components/Login";
import { useAppSession } from "~/utils/session";

export const loginFn = createServerFn(
  "POST",
  async (
    payload: {
      email: string;
      password: string;
    },
    { request },
  ) => {
    // Find the user
    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, payload.email.toLowerCase()),
    });

    // Check if the user exists
    if (!user) {
      return {
        error: true,
        userNotFound: true,
        message: "User not found",
      };
    }

    // Check if the password is correct
    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      payload.password,
    );

    if (!validPassword) {
      return {
        error: true,
        message: "Incorrect password",
      };
    }

    // Create a session
    const session = await useAppSession();

    // Store the user's email in the session
    await session.update({
      id: user.id,
      email: user.email,
    });
  },
);

export const Route = createFileRoute("/_authed")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("Not authenticated");
    }
  },
  errorComponent: ({ error }) => {
    if (error.message === "Not authenticated") {
      return <Login />;
    }

    throw error;
  },
});
