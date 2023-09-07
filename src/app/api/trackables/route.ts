import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import {
  getDateBounds,
  prepareTrackable,
  trackableToCreate,
} from "src/app/api/trackables/[id]/route";
import { auth } from "src/auth/lucia";

export const GET = async (request: NextRequest) => {
  // Auth check
  const authRequest = auth.handleRequest({ request, cookies });
  const session = await authRequest.validate();
  if (!session) {
    console.log("no session");
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;
  const raw = await prisma.trackable.findMany({
    where: { userId },
    include: {
      data: {
        where: {
          date: getDateBounds({ type: "last", days: 31 }),
        },
      },
    },
  });

  const trackables = raw.map(prepareTrackable);

  return NextResponse.json({ trackables });
};

export const PUT = async (request: NextRequest) => {
  // Auth check
  const authRequest = auth.handleRequest({ request, cookies });
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;

  const data = (await request.json()) as unknown;
  const input = trackableToCreate.safeParse(data);
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

  const created = await prisma.trackable.create({
    data: {
      type: input.data.type,
      settings: input.data.settings as Prisma.JsonObject,
      userId,
    },
  });

  const url = request.nextUrl.clone();

  url.pathname = `trackables/${created.id}`;

  return NextResponse.redirect(url);
};
