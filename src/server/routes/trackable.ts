import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import DB from "../db";

const trackableUpdate = z.object({
  _id: z.string(),
  year: z.number(),
  month: z.number(),
  day: z.number(),
  value: z.string().or(z.number()).or(z.boolean()),
});

export const trackableRouter = router({
  getAllIds: publicProcedure.query(async () => {
    await DB.dbConnect();
    const data = await DB.getIdList();
    return data;
  }),

  getTrackableById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const id = input;
      await DB.dbConnect();
      const result = await DB.getTrackable(id);

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No trackable id '${id}'`,
        });
      }
      return result;
    }),
  updateTrackableById: publicProcedure
    .input(trackableUpdate)
    .mutation(async ({ input }) => {
      await DB.dbConnect();
      try {
        const result = await DB.updateTrackable(input);
        return result;
      } catch (e) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Error when updating id '${input._id}'`,
        });
      }
    }),

  deleteTrackable: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await DB.dbConnect();
      await DB.deleteTrackable(input);

      return;
    }),

  updateTrackableSettings: publicProcedure
    .input(
      z.object({
        _id: z.string(),
        settings: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const { _id, settings } = input;

      await DB.dbConnect();
      const result = await DB.updateTrackableSettings(_id, settings);

      return result;
    }),
});
