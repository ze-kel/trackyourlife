import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@tyl/db";
import { trackable } from "@tyl/db/schema";
import { ZGETLimits } from "@tyl/validators/api";

import { protectedProcedure, publicProcedure } from "../trpc";

export const trackablesRouter = {
  getTrackableIdList: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.trackable.findMany({
      where: eq(trackable.userId, ctx.user.id),
      columns: {
        id: true,
        name: true,
        type: true,
      },
    });
  }),
  getAllTrackables: protectedProcedure
    .input(ZGETLimits)
    .query(({ ctx, input }) => {

      

    }),
} satisfies TRPCRouterRecord;
