import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

import { Argon2id, lucia } from "@tyl/auth";
import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { ZLogin } from "@tyl/validators/user";

import Form from "../../components/form.js";

const login = createServerFn(
  "POST",
  async (data: { login: string; password: string }, ctx) => {
    const req = ctx.request;

    try {
      const results = ZLogin.safeParse(data);
      if (!results.success) {
        throw new Error("Incorrect username or password");
      }

      const { email, password } = results.data;

      const user = await db.query.auth_user.findFirst({
        where: eq(auth_user.email, email.toLowerCase()),
      });

      if (!user) {
        throw new Error("Incorrect username or password");
      }

      const validPassword = await new Argon2id().verify(
        user.hashedPassword,
        password,
      );

      if (!validPassword) {
        throw new Error("Incorrect username or password");
      }
      const session = await lucia.createSession(user.id, {});

      req.headers.set(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );

      console.log(`API: User login ${email}`);

      throw redirect({ to: "/" });
    } catch (e) {
      throw new Error("Unknow error");
    }
  },
);

export const Route = createFileRoute("/login/")({
  component: Home,
  beforeLoad(ctx) {
    if (ctx.context.user) {
      return redirect({ to: "/" });
    }
  },
});

function Home() {
  return (
    <div className="p-2">
      <Form />
    </div>
  );
}
