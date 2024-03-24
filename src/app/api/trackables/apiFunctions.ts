import {
  ZTrackableUpdate,
  type ITrackable,
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
} from "@t/trackable";
import { log } from "console";
import { format } from "date-fns";
import { and, between, eq } from "drizzle-orm";
import { db } from "src/app/api/db";
import { ApiFunctionError } from "src/app/api/helpers";
import type { TGETLimits } from "src/app/api/trackables/apiHelpers";
import {
  getDateBounds,
  makeTrackableData,
  makeTrackableSettings,
  prepareTrackable,
  trackableToCreate,
} from "src/app/api/trackables/apiHelpers";
import type { DbTrackableRecordInsert } from "src/schema";
import { trackable, trackableRecord } from "src/schema";

export const GetAllTrackables = async ({
  userId,
  limits,
}: {
  userId: string;
  limits?: TGETLimits;
}) => {
  const bounds = getDateBounds(limits || { type: "last", days: 31 });

  const raw = await db.query.trackable.findMany({
    where: eq(trackable.userId, userId),
    with: {
      data: {
        where: between(trackableRecord.date, bounds.from, bounds.to),
      },
    },
  });

  const trackables = raw.map((v) => prepareTrackable(v, limits));

  log(`API: Get all trackables ${userId}`);

  return trackables;
};

export const GetTrackable = async ({
  trackableId,
  userId,
  limits,
}: {
  trackableId: ITrackable["id"];
  userId: string;
  limits?: TGETLimits;
}) => {
  const bounds = getDateBounds(limits);

  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, trackableId), eq(trackable.userId, userId)),
    with: {
      data: {
        where: between(trackableRecord.date, bounds.from, bounds.to),
      },
    },
  });

  if (!tr) {
    throw new ApiFunctionError("Unable to find trackable", 400);
  }
  const returnedTrackable: ITrackable = prepareTrackable(tr, limits);
  log(`API: Trackable GET ${tr.id}`);
  return returnedTrackable;
};

export const GetTrackableData = async ({
  trackableId,
  userId,
  limits,
}: {
  trackableId: ITrackable["id"];
  userId: string;
  limits: TGETLimits;
}) => {
  const bounds = getDateBounds(limits);

  const data = await db.query.trackableRecord.findMany({
    where: and(
      eq(trackableRecord.trackableId, trackableId),
      eq(trackableRecord.userId, userId),
      between(trackableRecord.date, bounds.from, bounds.to),
    ),
  });

  log(`API: Trackable GET DATA ${trackableId}`);

  return makeTrackableData(data, limits);
};

export const GetTrackableSettings = async ({
  trackableId,
  userId,
}: {
  trackableId: ITrackable["id"];
  userId: string;
}) => {
  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, trackableId), eq(trackable.userId, userId)),
  });

  if (!tr) {
    throw new ApiFunctionError("Unable to find trackable", 400);
  }
  const settings: ITrackable["settings"] = makeTrackableSettings(tr);
  log(`API: Trackable Settings GET  ${tr.id}`);
  return settings;
};

export const CreateTrackable = async ({
  data,
  userId,
}: {
  data: unknown;
  userId: string;
}) => {
  const parsed = trackableToCreate.safeParse(data);
  if (!parsed.success) {
    throw new ApiFunctionError("Malformed data: " + parsed.error.message, 400);
  }

  const cr = await db
    .insert(trackable)
    .values({
      type: parsed.data.type,
      settings: parsed.data.settings,
      userId,
    })
    .returning();

  if (!cr[0]) {
    throw new ApiFunctionError("DB failure", 500);
  }

  log(`API: Trackable created ${cr[0].id}`);

  return cr[0];
};

export const DeleteTrackable = async ({
  trackableId,
  userId,
}: {
  trackableId: ITrackable["id"];
  userId: string;
}) => {
  log(`API: Trackable Delete ${trackableId}`);

  await db
    .delete(trackable)
    .where(and(eq(trackable.userId, userId), eq(trackable.id, trackableId)));
};

export const UpdateTrackable = async ({
  data,
  userId,
}: {
  data: unknown;
  userId: string;
}) => {
  const parsed = ZTrackableUpdate.safeParse(data);

  if (!parsed.success) {
    throw new ApiFunctionError("Malformed data: " + parsed.error.message, 400);
  }

  const date = format(
    new Date(parsed.data.year, parsed.data.month, parsed.data.day),
    "yyyy-MM-dd",
  );

  const toInsert: DbTrackableRecordInsert = {
    trackableId: parsed.data.id,
    value: parsed.data.value,
    date: date,
    userId,
  };

  await db
    .insert(trackableRecord)
    .values(toInsert)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: { value: parsed.data.value },
    });

  log(`API: Trackable Update ${parsed.data.id} ${date}`);

  return parsed.data;
};

export const UpdateTrackableSettings = async ({
  data,
  trackableId,
  userId,
}: {
  data: unknown;
  trackableId: ITrackable["id"];
  userId: string;
}) => {
  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, trackableId), eq(trackable.userId, userId)),
  });

  if (!tr) {
    throw new ApiFunctionError("No trackable with id " + trackableId, 400);
  }

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

  if (!parsed) {
    throw new ApiFunctionError("Unsupported settings type", 500);
  }

  if (!parsed || !parsed?.success) {
    throw new ApiFunctionError("Malformed data: " + parsed.error.message, 400);
  }

  await db
    .update(trackable)
    .set({ settings: parsed.data })
    .where(and(eq(trackable.id, trackableId), eq(trackable.userId, userId)));

  return parsed.data;
};
