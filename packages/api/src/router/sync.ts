import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, gte, lte, sql } from "@tyl/db";
import { trackable, trackableRecord } from "@tyl/db/schema";

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
} satisfies TRPCRouterRecord;
