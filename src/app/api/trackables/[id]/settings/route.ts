import * as context from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "src/auth/lucia";

import { db } from "src/app/api/db";
import { and, eq } from "drizzle-orm";

import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
} from "src/types/trackable";
import { trackable } from "src/schema";

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  // Auth check
  const authRequest = auth.handleRequest(request.method, context);
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;
  const id = params.id;

  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, id), eq(trackable.userId, userId)),
  });

  if (!tr) {
    return NextResponse.json(
      {
        error: "No trackable with ID" + id,
      },
      {
        status: 400,
      },
    );
  }

  const data = (await request.json()) as unknown;

  let parsed;

  if (tr.type === "boolean") {
    parsed = ZTrackableSettingsBoolean.safeParse(data);
  }

  if (tr.type === "number") {
    parsed = ZTrackableSettingsNumber.safeParse(data);
  }

  if (tr.type === "range") {
    parsed = ZTrackableSettingsRange.safeParse(data);
  }

  if (!parsed || !parsed?.success) {
    return NextResponse.json(
      {
        error: "Settings do not match Trackable type schema",
      },
      {
        status: 400,
      },
    );
  }

  await db
    .update(trackable)
    .set({ settings: parsed.data })
    .where(and(eq(trackable.id, id), eq(trackable.userId, userId)));

  return NextResponse.json(parsed.data);
};
