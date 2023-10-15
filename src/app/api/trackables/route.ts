import { eq } from "drizzle-orm";
import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "src/app/api/db";
import {
  prepareTrackable,
  trackableToCreate,
} from "src/app/api/trackables/[id]/route";
import { auth } from "src/auth/lucia";
import { trackable } from "src/schema";

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

  // TODO: getDateBounds({ type: "last", days: 31 }),

  const raw = await db.query.trackable.findMany({
    where: eq(trackable.userId, userId),
    with: {
      data: true,
    },
  });

  const trackables = raw.map(prepareTrackable);

  return NextResponse.json({ trackables });
};

export const PUT = async (request: NextRequest) => {
  // Auth check
  const authRequest = auth.handleRequest(request.method, context);
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

  const cr = await db
    .insert(trackable)
    .values({
      type: input.data.type,
      settings: input.data.settings,
      userId,
    })
    .returning();

  if (!cr[0]) {
    throw new Error("Failed to insert");
  }

  const url = request.nextUrl.clone();

  url.pathname = `trackables/${cr[0].id}`;

  return NextResponse.redirect(url);
};
