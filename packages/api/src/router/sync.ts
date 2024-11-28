import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, gte, lte, sql } from "@tyl/db";
import { auth_user, trackable, trackableRecord } from "@tyl/db/schema";
import { ZTrackableFromDb } from "@tyl/validators/trackable";
import { ZUserSettings } from "@tyl/validators/user";

import { createTRPCContext, protectedProcedure } from "../trpc";

const ZRecordUpdate = z.object({
  date: z.date(),
  updated: z.date(),
  userId: z.string(),
  value: z.string(),
  trackableId: z.string(),
});

type IRecordUpdate = z.infer<typeof ZRecordUpdate>;

const ZSyncInput = z.object({
  lastSync: z.date(),
  trackableUpdates: z.array(ZTrackableFromDb),
  recordUpdates: z.array(ZRecordUpdate),
  userUpdates: z
    .object({
      settings: ZUserSettings.optional(),
      updated: z.date(),
      username: z.string(),
    })
    .optional(),
});

type ISyncInput = z.infer<typeof ZSyncInput>;

type TRPCCtx = ReturnType<typeof createTRPCContext>;

const getTrackableUpdates = (
  db: TRPCCtx["db"],
  userId: string,
  lastSync: Date,
) => {
  return db.query.trackable.findMany({
    where: and(gte(trackable.updated, lastSync), eq(trackable.userId, userId)),
  });
};

const getRecordUpdates = (
  db: TRPCCtx["db"],
  userId: string,
  lastSync: Date,
) => {
  return db.query.trackableRecord.findMany({
    where: and(
      gte(trackableRecord.updated, lastSync),
      eq(trackableRecord.userId, userId),
    ),
  });
};

const getUserUpdates = (db: TRPCCtx["db"], userId: string, lastSync: Date) => {
  return db.query.auth_user.findFirst({
    columns: {
      updated: true,
      settings: true,
      username: true,
      email: true,
      id: true,
    },
    where: and(gte(auth_user.updated, lastSync), eq(auth_user.id, userId)),
  });
};

const setRecordUpdates = (
  db: TRPCCtx["db"],
  userId: string,
  updates: ISyncInput["recordUpdates"],
) => {
  console.log("SET RECORD UPDATES", updates);
  const filteredRecordUpdates = updates.filter((v) => v.userId === userId);
  if (filteredRecordUpdates.length === 0) return;

  console.log("FILTERED", filteredRecordUpdates);

  return db
    .insert(trackableRecord)
    .values(filteredRecordUpdates)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: {
        value: sql.raw(`excluded.${trackableRecord.value.name}`),
        updated: sql.raw(`excluded.${trackableRecord.updated.name}`),
      },
      setWhere: lte(
        trackableRecord.updated,
        sql.raw(`excluded.${trackableRecord.updated.name}`),
      ),
    });
};

const setTrackableUpdates = (
  db: TRPCCtx["db"],
  userId: string,
  updates: ISyncInput["trackableUpdates"],
) => {
  const filteredTrackableUpdates = updates.filter((v) => v.userId === userId);
  if (filteredTrackableUpdates.length === 0) return;

  return db
    .insert(trackable)
    .values(updates)
    .onConflictDoUpdate({
      target: [trackable.id],
      set: {
        name: sql.raw(`excluded.${trackable.name.name}`),
        settings: sql.raw(`excluded.${trackable.settings.name}`),
        updated: sql.raw(`excluded.${trackable.updated.name}`),
        isDeleted: sql.raw(`excluded.${trackable.isDeleted.name}`),
      },
      setWhere: lte(
        trackable.updated,
        sql.raw(`excluded.${trackable.updated.name}`),
      ),
    });
};

const setUserUpdates = (
  db: TRPCCtx["db"],
  userId: string,
  updates: ISyncInput["userUpdates"],
) => {
  if (!updates) return;

  return db
    .update(auth_user)
    .set({
      settings: updates.settings,
      username: updates.username,
    })
    .where(
      and(eq(auth_user.id, userId), lte(auth_user.updated, updates.updated)),
    );
};

export const syncRouter = {
  syncv2: protectedProcedure.input(ZSyncInput).query(async ({ ctx, input }) => {
    const trackables = await getTrackableUpdates(
      ctx.db,
      ctx.user.id,
      input.lastSync,
    );
    const records = await getRecordUpdates(ctx.db, ctx.user.id, input.lastSync);
    const user = await getUserUpdates(ctx.db, ctx.user.id, input.lastSync);

    await setTrackableUpdates(ctx.db, ctx.user.id, input.trackableUpdates);
    await setRecordUpdates(ctx.db, ctx.user.id, input.recordUpdates);
    await setUserUpdates(ctx.db, ctx.user.id, input.userUpdates);

    return { trackables, records, user };
  }),

  getTrackableUpdates: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.trackable.findMany({
        where: input
          ? and(
              gte(trackable.updated, input),
              eq(trackable.userId, ctx.user.id),
            )
          : eq(trackable.userId, ctx.user.id),
      });
    }),
  getRecordUpdates: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.trackableRecord.findMany({
        where: input
          ? and(
              gte(trackableRecord.updated, input),
              eq(trackableRecord.userId, ctx.user.id),
            )
          : eq(trackableRecord.userId, ctx.user.id),
      });
    }),
  getUserUpdates: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.auth_user.findFirst({
        columns: {
          updated: true,
          settings: true,
          username: true,
          email: true,
          id: true,
        },
        where: input
          ? and(gte(auth_user.updated, input), eq(auth_user.id, ctx.user.id))
          : eq(auth_user.id, ctx.user.id),
      });
    }),
  pushRecordUpdates: protectedProcedure
    .input(z.array(ZRecordUpdate))
    .query(async ({ ctx, input }) => {
      const filteredInput = input.filter((v) => v.userId === ctx.user.id);

      if (!filteredInput.length) return;

      return ctx.db
        .insert(trackableRecord)
        .values(filteredInput)
        .onConflictDoUpdate({
          target: [trackableRecord.trackableId, trackableRecord.date],
          set: {
            value: sql.raw(`excluded.${trackableRecord.value.name}`),
            updated: sql.raw(`excluded.${trackableRecord.updated.name}`),
          },
          setWhere: lte(
            trackableRecord.updated,
            sql.raw(`excluded.${trackableRecord.updated.name}`),
          ),
        });
    }),

  pushTrackableUpdates: protectedProcedure
    .input(z.array(ZTrackableFromDb))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .insert(trackable)
        .values(input)
        .onConflictDoUpdate({
          target: [trackable.id],
          set: {
            name: sql.raw(`excluded.${trackable.name.name}`),
            settings: sql.raw(`excluded.${trackable.settings.name}`),
            updated: sql.raw(`excluded.${trackable.updated.name}`),
            isDeleted: sql.raw(`excluded.${trackable.isDeleted.name}`),
          },
          setWhere: lte(
            trackable.updated,
            sql.raw(`excluded.${trackable.updated.name}`),
          ),
        });
    }),

  pushUserUpdates: protectedProcedure
    .input(
      z.object({
        settings: ZUserSettings.optional(),
        updated: z.date(),
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .update(auth_user)
        .set({
          settings: input.settings,
          username: input.username,
        })
        .where(
          and(
            eq(auth_user.id, ctx.user.id),
            lte(auth_user.updated, input.updated),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
