import { db } from "../../db";
import * as context from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "src/auth/lucia";
import { ZUserSettings } from "@t/user";
import { auth_user } from "src/schema";
import { eq } from "drizzle-orm";

export const GET = async (request: NextRequest) => {
  // Auth check
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;

  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, userId),
  });

  if (!user) return NextResponse.json({});

  return NextResponse.json(ZUserSettings.parse(user.settings));
};

export const POST = async (request: NextRequest) => {
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;

  const data = (await request.json()) as unknown;

  const input = ZUserSettings.safeParse(data);
  if (!input.success) {
    return NextResponse.json(
      {
        error: input.error,
      },
      {
        status: 400,
      },
    );
  }

  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, userId),
  });

  if (!user) {
    throw new Error("Cant find user with provided ID to access settings");
  }

  await db
    .update(auth_user)
    .set({ settings: input.data })
    .where(eq(auth_user.id, userId));

  return NextResponse.json(input.data);
};
