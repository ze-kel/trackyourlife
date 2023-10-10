import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "src/auth/lucia";
import { z } from "zod";
import { sub } from "date-fns";

import type { ITrackable, ITrackableSettings } from "src/types/trackable";

import { format } from "date-fns";
import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
  ZTrackableUpdate,
} from "src/types/trackable";
import type { DbTrackableRecordSelect, DbTrackableSelect } from "src/schema";

export const trackableToCreate = z.discriminatedUnion("type", [
  z.object({
    settings: ZTrackableSettingsBoolean,
    type: z.literal("boolean"),
  }),
  z.object({
    settings: ZTrackableSettingsNumber,
    type: z.literal("number"),
  }),
  z.object({
    settings: ZTrackableSettingsRange,
    type: z.literal("range"),
  }),
]);

const makeTrackableData = (trackableData: DbTrackableRecordSelect[]) => {
  const result: ITrackable["data"] = {};

  trackableData.forEach((el) => {
    result[format(new Date(el.date), "yyyy-MM-dd")] = el.value;
  });
  return result;
};

const makeTrackableSettings = (
  trackable: DbTrackableSelect,
): ITrackableSettings => {
  let settingsParser;
  const type = trackable.type;
  if (type === "boolean") {
    settingsParser = ZTrackableSettingsBoolean;
  }
  if (type === "number") {
    settingsParser = ZTrackableSettingsNumber;
  }
  if (type === "range") {
    settingsParser = ZTrackableSettingsRange;
  }
  if (!settingsParser) {
    console.log(trackable);
    throw new Error("No parser for settings of type " + trackable.type);
  }

  // Note that we store settings as JSON, therefore dates there are stored as strings.
  // Here z.coerce.date() auto converts them to JS dates.
  const parseRes = settingsParser.safeParse(trackable.settings);
  if (parseRes.success) {
    return parseRes.data;
  }

  return { name: "Error parsing settings" };
};

export const prepareTrackable = (
  trackable: DbTrackableSelect & { data: DbTrackableRecordSelect[] },
): ITrackable => {
  return {
    ...trackable,
    data: makeTrackableData(trackable.data),
    settings: makeTrackableSettings(trackable),
  };
};

export const ZGETLimits = z
  .union([
    z.object({ type: z.literal("year"), year: z.number() }),
    z.object({
      type: z.literal("month"),
      year: z.number(),
      month: z.number().min(0).max(11),
    }),
    z.object({ type: z.literal("last"), days: z.number().min(7).max(31) }),
  ])
  .optional();

export type TGETLimits = z.infer<typeof ZGETLimits>;

export const getDateBounds = (limits: TGETLimits | undefined) => {
  if (!limits) {
    return {
      gte: new Date(0),
    };
  }

  if (limits.type === "year") {
    return {
      gte: new Date(limits.year, 0, 1),
      lt: new Date(limits.year + 1, 0, 1),
    };
  }

  if (limits.type === "month") {
    return {
      gte: new Date(limits.year, limits.month, 1),
      lt: new Date(limits.year, limits.month + 1, 1),
    };
  }

  if (limits.type === "last") {
    return {
      gte: sub(new Date(), { days: limits.days }),
      lte: new Date(),
    };
  }
};

// GET DATA
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
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

  const trackable = await prisma.trackable.findFirstOrThrow({
    where: {
      id,
      userId,
    },
    include: {
      data: {
        where: {
          date: getDateBounds(undefined),
        },
      },
    },
  });

  const returnedTrackable: ITrackable = prepareTrackable(trackable);

  return NextResponse.json(returnedTrackable);
};

// UPDATE
export const POST = async (
  request: NextRequest,
  // { params }: { params: { id: string } }
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

  const data = (await request.json()) as unknown;

  const input = ZTrackableUpdate.safeParse(data);
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

  const date = `${format(
    new Date(input.data.year, input.data.month, input.data.day),
    "yyyy-MM-dd",
  )}T00:00:00.000Z`;

  const trackable = await prisma.trackable.findUnique({
    where: { id: input.data.id },
  });
  if (!trackable || trackable.userId !== userId) {
    return NextResponse.json(
      {
        error: "No trackable with ID" + input.data.id,
      },
      {
        status: 400,
      },
    );
  }

  await prisma.trackableRecord.upsert({
    create: {
      trackableId: input.data.id,
      value: input.data.value,
      date,
    },
    update: {
      value: input.data.value,
    },
    where: {
      trackableId_date: {
        trackableId: input.data.id,
        date,
      },
    },
  });

  return NextResponse.json(input.data);
};

// DELETE TRACKABLE
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
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
    where: { id },
  });

  if (!trackable || trackable.userId !== userId) {
    return NextResponse.json(
      {
        error: "No trackable with ID" + id,
      },
      {
        status: 400,
      },
    );
  }

  await prisma.trackableRecord.deleteMany({
    where: {
      trackableId: id,
    },
  });

  await prisma.trackable.delete({
    where: {
      id: id,
    },
  });

  return;
};
