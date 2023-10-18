import { db } from "../../db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ZUserSettings } from "@t/user";
import { auth_user } from "src/schema";
import { eq } from "drizzle-orm";
import { checkForSession } from "src/app/api/helpers";

export const GET = async (request: NextRequest) => {
  // Auth check
  const { userId } = await checkForSession(request);

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, userId),
  });

  if (!user) return NextResponse.json({});

  return NextResponse.json(ZUserSettings.parse(user.settings));
};

export const POST = async (request: NextRequest) => {
  // Auth check
  const { userId } = await checkForSession(request);

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

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
