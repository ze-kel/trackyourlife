import { log } from "console";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { Argon2id, generateId, lucia } from "@tyl/auth";
import { db } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { ZRegister } from "@tyl/validators/user";

export const POST = async (request: NextRequest) => {
  const data = (await request.json()) as unknown;

  try {
    const results = ZRegister.safeParse(data);
    if (!results.success) {
      return NextResponse.json(
        {
          error:
            results.error.errors[0]?.message ||
            "Validation error. Please check all fields",
        },
        {
          status: 400,
        },
      );
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
    cookies().set(
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

      return NextResponse.json(
        {
          error: "This email is already registered",
        },
        {
          status: 400,
        },
      );
    }

    log(`API: Fail to create user, UNKNOWN`, e);

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
