import { NextResponse, type NextRequest } from "next/server";
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
import {
  type DbTrackableRecordSelect,
  type DbTrackableRecordInsert,
  type DbTrackableSelect,
  trackable,
  trackableRecord,
} from "src/schema";
import { db } from "src/app/api/db";
import { and, eq } from "drizzle-orm";
import { log } from "src/helpers/logger";
import { checkForUser } from "src/app/api/helpers";
import { DeleteTrackable } from "src/app/api/trackables/apiFunctions";

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

class ApiFunctionError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

const GetTrackable = async (id: string, userId: string) => {
  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, id), eq(trackable.userId, userId)),
    with: {
      data: true,
    },
  });

  if (!tr) {
    throw new ApiFunctionError("Unable to find trackable", 400);
  }
  const returnedTrackable: ITrackable = prepareTrackable(tr);
  log(`API: Trackable GET ${tr.id}`);
  return returnedTrackable;
};

// GET DATA
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await checkForUser(request);

  if (!userId) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  try {
    const trackable = await GetTrackable(params.id, userId);
    return NextResponse.json(trackable);
  } catch (e) {
    if (e instanceof ApiFunctionError) {
      return NextResponse.json({}, { status: e.code, statusText: e.message });
    }
    return NextResponse.json({}, { status: 500, statusText: "Unknown errror" });
  }
};

// UPDATE
export const POST = async (request: NextRequest) => {
  const userId = await checkForUser(request);

  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

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

  const date = format(
    new Date(input.data.year, input.data.month, input.data.day),
    "yyyy-MM-dd",
  );

  const toInsert: DbTrackableRecordInsert = {
    trackableId: input.data.id,
    value: input.data.value,
    date: date,
    userId,
  };

  await db
    .insert(trackableRecord)
    .values(toInsert)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: { value: input.data.value },
    });

  log(`API: Trackable Update ${input.data.id} ${date}`);

  return NextResponse.json(input.data);
};

// DELETE TRACKABLE
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const userId = await checkForUser(request);
  if (!userId) {
    return new Response(null, {
      status: 401,
    });
  }

  const id = params.id;

  await DeleteTrackable(id, userId);

  return NextResponse.redirect(request.nextUrl.origin);
};
