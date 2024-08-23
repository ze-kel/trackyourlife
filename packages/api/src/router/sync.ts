import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { gte } from "@tyl/db";
import { trackable, trackableRecord } from "@tyl/db/schema";

import { protectedProcedure } from "../trpc";

export const syncRouter = {
  getTrackableUpdates: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.trackable.findMany({
        where: input ? gte(trackable.updated, input) : undefined,
      });
    }),
  getRecordUpdates: protectedProcedure
    .input(z.date().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.trackableRecord.findMany({
        where: input ? gte(trackableRecord.updated, input) : undefined,
      });
    }),
} satisfies TRPCRouterRecord;
