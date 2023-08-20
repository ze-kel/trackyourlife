import { prisma } from 'src/app/api/db';

import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from 'src/auth/lucia';

import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
} from 'src/types/trackable';
import type { Prisma } from '@prisma/client';

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  // Auth check
  const authRequest = auth.handleRequest({ request, cookies });
  const session = await authRequest.validate();
  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const userId = session.user.userId;
  const id = params.id;

  const trackable = await prisma.trackable.findUnique({
    where: { id, userId },
  });

  if (!trackable) {
    return NextResponse.json(
      {
        error: 'No trackable with ID' + id,
      },
      {
        status: 400,
      }
    );
  }

  const data = (await request.json()) as unknown;

  let parsed;

  if (trackable.type === 'boolean') {
    parsed = ZTrackableSettingsBoolean.safeParse(data);
  }

  if (trackable.type === 'number') {
    parsed = ZTrackableSettingsNumber.safeParse(data);
  }

  if (trackable.type === 'range') {
    parsed = ZTrackableSettingsRange.safeParse(data);
  }

  if (!parsed || !parsed?.success) {
    return NextResponse.json(
      {
        error: 'Settings do not match Trackable type schema',
      },
      {
        status: 400,
      }
    );
  }

  await prisma.trackable.update({
    data: {
      settings: parsed.data as Prisma.JsonObject,
    },
    where: {
      id: id,
    },
  });

  return parsed.data;
};
