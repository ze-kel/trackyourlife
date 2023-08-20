import { prisma } from "../../db";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "src/auth/lucia";
import { ZUserSettings } from "@t/user";

export const GET = async (request: NextRequest) => {
  // Auth check
  const authRequest = auth.handleRequest({ request, cookies });
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) return {};

  return NextResponse.json(ZUserSettings.parse(user.settings));
};

export const POST = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies });
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

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("Cant find user with provided ID to access settings");
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      settings: input.data,
    },
  });

  return NextResponse.json(input.data);
};
