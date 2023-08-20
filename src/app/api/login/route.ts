import { auth } from "src/auth/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LuciaError } from "lucia";

import type { NextRequest } from "next/server";
import { ZLogin } from "@t/user";

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
        }
      );
    }

    const { email, password } = results.data;

    const user = await auth.useKey("username", email.toLowerCase(), password);
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest({
      request,
      cookies,
    });
    authRequest.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/", // redirect to profile page
      },
    });
  } catch (e) {
    if (
      e instanceof LuciaError &&
      (e.message === "AUTH_INVALID_KEY_ID" ||
        e.message === "AUTH_INVALID_PASSWORD")
    ) {
      // user does not exist or invalid password
      return NextResponse.json(
        {
          error: "Incorrect username or password",
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "An unknown error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
