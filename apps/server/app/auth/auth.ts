import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn, json } from "@tanstack/start";
import { Argon2id } from "oslo/password";
import { z } from "zod";

import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";

import { useAppSession } from "~/auth/session";

export const loginFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    // Find the user
    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, data.email.toLowerCase()),
    });

    // Check if the user exists
    if (!user) {
      return {
        ok: false,
        message: "No user found with these credentials",
      };
    }

    // Check if the password is correct
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

    const session = await useAppSession();

    const upd = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    await session.update(upd);

    return {
      ok: true,
    };
  });
