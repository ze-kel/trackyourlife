import { log } from "console";
import {
  createApp,
  createRouter,
  defineEventHandler,
  readBody,
  setCookie,
  setHeader,
} from "vinxi/server";

import { Argon2id, generateId, lucia, validateRequest } from "@tyl/auth";
import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { ZLogin, ZRegister } from "@tyl/validators/user";

const app = createApp({
  onRequest: () => {
    console.log("reqest");
  },
});

const router = createRouter();

router.post(
  "/login",
  defineEventHandler(async (event) => {
    const body = await readBody(event);

    const results = ZLogin.safeParse(JSON.parse(body));

    if (!results.success) {
      throw new Error("Incorrect username or password");
    }

    const { email, password } = results.data;

    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, email.toLowerCase()),
    });

    if (!user) {
      console.log("no user");
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

    setHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );

    console.log(`API: User login ${email}`);

    return { ok: true };
  }),
);

router.post(
  "/logout",
  defineEventHandler(async (event) => {
    const { session } = await validateRequest(event);

    if (!session) {
      await event.respondWith(
        new Response(null, {
          status: 401,
        }),
      );
      return;
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    await event.respondWith(
      new Response(null, {
        status: 302,
        headers: {
          Location: "/login",
        },
      }),
    );
  }),
);

router.post(
  "/create",
  defineEventHandler(async (event) => {
    const data = readBody(event);

    try {
      const results = ZRegister.safeParse(data);
      if (!results.success) {
        return {
          error:
            results.error.errors[0]?.message ||
            "Validation error. Please check all fields",
        };
      }

      const { email, password, username, role } = results.data;

      const hashedPassword = await new Argon2id().hash(password);
      const userId = generateId(15);

      await db
        .insert(auth_user)
        .values({
          id: userId,
          username: username || "unknown user",
          email: email.toLowerCase(),
          hashedPassword,
          settings: {},
          role: role === "autotester" ? "autotester" : "user",
        })
        .returning();

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      setCookie(
        event,
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      log(`API: User created ${email}`);

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    } catch (e) {
      if (typeof e === "object" && e && "code" in e && e.code === "23505") {
        log(`API: Fail to create user, existing email`);

        return {
          error: "This email is already registered",
        };
      }

      log(`API: Fail to create user, UNKNOWN`, e);

      return {
        error: "An unknown error occurred",
      };
    }
  }),
);

app.use(router);

export default app.handler;
