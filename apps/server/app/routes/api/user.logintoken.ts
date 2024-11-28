import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import { Argon2id } from "oslo/password";
import { setResponseStatus } from "vinxi/http";

import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { ZLogin } from "@tyl/validators/user";

import { createSession, generateSessionToken } from "~/auth/auth";

export const Route = createAPIFileRoute("/api/user/logintoken")({
  GET: async ({ request, params }) => {
    const data = (await request.json()) as unknown;

    try {
      const results = ZLogin.safeParse(data);
      if (!results.success) {
        setResponseStatus(400);
        return json({
          error: "Incorrect username or password",
        });
      }

      const { email, password } = results.data;

      const user = await db.query.auth_user.findFirst({
        where: eq(auth_user.email, email.toLowerCase()),
      });

      if (!user) {
        setResponseStatus(400);
        return json({
          error: "Incorrect username or password",
        });
      }

      const validPassword = await new Argon2id().verify(
        user.hashedPassword,
        password,
      );

      if (!validPassword) {
        setResponseStatus(400);
        return json({
          error: "Incorrect username or password",
        });
      }
      const token = generateSessionToken();

      const session = await createSession(token, user.id);

      setResponseStatus(200);
      return json({
        token: session.id,
        userId: user.id,
        email: user.email,
        username: user.username,
      });
    } catch (e) {
      setResponseStatus(500);
      return json({
        error: "An unknown error occurred",
      });
    }
  },
});
