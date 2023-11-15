import { auth } from "src/auth/lucia";
import { NextResponse } from "next/server";

import * as context from "next/headers";
import type { NextRequest } from "next/server";
import { ZRegister } from "@t/user";
import { log } from "console";

export const POST = async (request: NextRequest) => {
  const data = (await request.json()) as unknown;

  try {
    const results = ZRegister.safeParse(data);
    if (!results.success) {
      return NextResponse.json(
        {
          error: results.error.message,
        },
        {
          status: 400,
        },
      );
    }

    const { email, password, username, role } = results.data;

    const user = await auth.createUser({
      key: {
        providerId: "username", // auth method
        providerUserId: email.toLowerCase(), // unique id when using "username" auth method
        password, // hashed by Lucia
      },
      attributes: {
        email,
        username,
        role,
      },
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    const authRequest = auth.handleRequest(request.method, context);
    authRequest.setSession(session);

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
