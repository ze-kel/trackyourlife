import { createMiddleware, createServerFn } from "@tanstack/start";
import { z } from "zod";

import type { DbTrackableRecordInsert } from "@tyl/db/schema";
import { and, between, db, eq, sql } from "@tyl/db";
import { trackable, trackableRecord } from "@tyl/db/schema";
import { getNowInTimezone, getStartOfDayGMT } from "@tyl/helpers/timezone";
import { ZGETLimits } from "@tyl/validators/api";
import {
  trackableToCreate,
  ZTrackableSettings,
  ZTrackableUpdate,
} from "@tyl/validators/trackable";

import { getAuthSession } from "~/auth/auth";
import {
  getDateBounds,
  GetUserSettings,
  makeTrackableData,
  makeTrackableSettings,
  prepareTrackable,
} from "./helpers";

export type TCTX = {
  user: { id: string };
};

export const VgetAllTrackables = z.object({ limits: ZGETLimits });
export const FgetAllTrackables = async (
  ctx: TCTX,
  input: z.infer<typeof VgetAllTrackables>,
) => {
  const settings = await GetUserSettings({ userId: ctx.user.id });

  const bounds = getDateBounds(input.limits ?? { type: "last", days: 31 });

  const raw = await db.query.trackable.findMany({
    where: and(
      eq(trackable.userId, ctx.user.id),
      eq(trackable.isDeleted, false),
    ),
    with: {
      data: {
        where: between(trackableRecord.date, bounds.from, bounds.to),
      },
    },
  });

  return raw.map((v) => prepareTrackable(v, input.limits));
};

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const u = await getAuthSession();

  if (!u.user) {
    throw new Error("User not found");
  }

  return next({
    context: {
      user: u.user,
    },
  });
});

export const SFGetAllTrackables = createServerFn({ method: "GET" })
  .validator(VgetAllTrackables)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    return FgetAllTrackables(context, data);
  });

export const FgetTrackableIdList = async (ctx: TCTX) => {
  return db.query.trackable.findMany({
    where: and(
      eq(trackable.userId, ctx.user.id),
      eq(trackable.isDeleted, false),
    ),
    columns: {
      id: true,
      name: true,
      type: true,
    },
  });
};

export const VgetTrackableById = z.object({
  id: z.string(),
  limits: ZGETLimits,
});

export const FgetTrackableById = async (
  ctx: TCTX,
  input: z.infer<typeof VgetTrackableById>,
) => {
  const settings = await GetUserSettings({ userId: ctx.user.id });
  const bounds = getDateBounds(input.limits ?? { type: "last", days: 31 });
  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
    with: {
      data: {
        where: between(trackableRecord.date, bounds.from, bounds.to),
      },
    },
  });

  if (!tr || tr.isDeleted) {
    throw new Error(`Unable to find trackable with id: ${input.id}`);
  }

  return prepareTrackable(tr, input.limits);
};

export const VgetTrackableData = z.object({
  id: z.string(),
  limits: ZGETLimits,
});

export const FgetTrackableData = async (
  ctx: TCTX,
  input: z.infer<typeof VgetTrackableData>,
) => {
  const settings = await GetUserSettings({ userId: ctx.user.id });
  const bounds = getDateBounds(input.limits);

  const data = await db.query.trackableRecord.findMany({
    where: and(
      eq(trackableRecord.trackableId, input.id),
      eq(trackableRecord.userId, ctx.user.id),
      between(trackableRecord.date, bounds.from, bounds.to),
    ),
  });

  return makeTrackableData(data, input.limits);
};

export const VgetTrackableSettings = z.object({ id: z.string() });
export const FgetTrackableSettings = async (
  ctx: TCTX,
  input: z.infer<typeof VgetTrackableSettings>,
) => {
  const tr = await db.query.trackable.findFirst({
    where: eq(trackable.id, input.id),
  });

  if (!tr) {
    throw new Error(`Unable to find trackable with id: ${input.id}`);
  }
  return makeTrackableSettings(tr);
};

export const VcreateTrackable = trackableToCreate;
export const FcreateTrackable = async (
  ctx: TCTX,
  input: z.infer<typeof VcreateTrackable>,
) => {
  const cr = await db
    .insert(trackable)
    .values({
      ...input,
      userId: ctx.user.id,
      updated: new Date(),
    })
    .returning();

  if (!cr[0]) {
    throw new Error("DB Error: Insert did not return any rows");
  }

  return cr[0];
};

export const VdeleteTrackable = z.object({ id: z.string() });
export const FdeleteTrackable = async (
  ctx: TCTX,
  input: z.infer<typeof VdeleteTrackable>,
) => {
  await db
    .update(trackable)
    .set({
      isDeleted: true,
      updated: new Date(),
    })
    .where(and(eq(trackable.userId, ctx.user.id), eq(trackable.id, input.id)));
};

export const VupdateTrackableEntry = ZTrackableUpdate;
export const FupdateTrackableEntry = async (
  ctx: TCTX,
  input: z.infer<typeof VupdateTrackableEntry>,
) => {
  const toInsert: DbTrackableRecordInsert = {
    trackableId: input.id,
    value: input.value,
    date: new Date(Date.UTC(input.year, input.month, input.day, 0, 0, 0, 0)),
    userId: ctx.user.id,
  };

  await db
    .insert(trackableRecord)
    .values(toInsert)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: { value: input.value, updated: new Date() },
    })
    .returning();

  return input;
};

export const VupdateTrackableEntries = z.array(ZTrackableUpdate);
export const FupdateTrackableEntries = async (
  ctx: TCTX,
  input: z.infer<typeof VupdateTrackableEntries>,
) => {
  const toInsert: DbTrackableRecordInsert[] = input.map((i) => ({
    trackableId: i.id,
    value: i.value,
    date: new Date(Date.UTC(i.year, i.month, i.day, 0, 0, 0, 0)),
    userId: ctx.user.id,
    updated: new Date(),
  }));

  await db
    .insert(trackableRecord)
    .values(toInsert)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: { value: sql.raw(`excluded.${trackableRecord.value.name}`) },
    });

  return input;
};

export const VupdateTrackableName = z.object({
  id: z.string(),
  newName: z.string(),
});
export const FupdateTrackableName = async (
  ctx: TCTX,
  input: z.infer<typeof VupdateTrackableName>,
) => {
  await db
    .update(trackable)
    .set({ name: input.newName, updated: new Date() })
    .where(and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)));
};

export const VupdateTrackableSettings = z.object({
  id: z.string(),
  newSettings: z.object({}).passthrough(),
});
export const FupdateTrackableSettings = async (
  ctx: TCTX,
  input: z.infer<typeof VupdateTrackableSettings>,
) => {
  const tr = await db.query.trackable.findFirst({
    where: and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
  });

  if (!tr || tr.isDeleted) {
    throw new Error(`No trackable with id ${input.id}`);
  }

  const parsed = ZTrackableSettings.safeParse({
    type: tr.type,
    settings: input.newSettings,
  });

  if (!parsed.success) {
    throw new Error(`Error parsing settings: ${parsed.error.message}`);
  }

  await db
    .update(trackable)
    .set({ settings: parsed.data, updated: new Date() })
    .where(and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)));

  return parsed.data;
};
