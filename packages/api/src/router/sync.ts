import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, gte, lte, sql } from "@tyl/db";
import { auth_user, trackable, trackableRecord } from "@tyl/db/schema";
import { ZTrackable, ZTrackableFromDb } from "@tyl/validators/trackable";
import { ZUserSettings } from "@tyl/validators/user";

import { protectedProcedure } from "../trpc";

const ZRecordUpdate = z.object({
  date: z.date(),
  updated: z.date(),
  userId: z.string(),
  value: z.string(),
  trackableId: z.string(),
});

export const syncRouter = {
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
