import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { ZLogin } from "@t/user";
import { log } from "console";
import { db } from "src/db/db";
import { auth_user } from "src/db/schema";
import { eq } from "drizzle-orm";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "src/auth/lucia";

export const POST = async (request: NextRequest) => {
  const data = (await request.json()) as unknown;

  try {
    const results = ZLogin.safeParse(data);
    if (!results.success) {
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        },
      );
    }

    const { email, password } = results.data;

    const user = await db.query.auth_user.findFirst({
      where: eq(auth_user.email, email.toLowerCase()),
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        },
      );
    }

    const validPassword = await new Argon2id().verify(
      user.hashedPassword,
      password,
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        },
      );
    }
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    log(`API: User login ${email}`);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      },
    );
  }
};
