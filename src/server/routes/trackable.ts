import { router, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { ITrackable } from "@t/trackable";

import { format } from "date-fns";

const trackableUpdate = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number(),
  day: z.number(),
  value: z.string(),
});

const trackableToCreate = z.object({
  settings: z.any(),
  type: z.enum(["number", "boolean", "range"]),
});

const getDefaultUser = async () => {
  let defUser = await prisma.user.findFirst();
  if (!defUser) {
    defUser = await prisma.user.create({ data: {} });
  }

  return defUser;
};

export const trackableRouter = router({
  getAllIds: publicProcedure.query(async () => {
    const entries = await prisma.trackable.findMany();

    return entries.map((entry) => entry.id);
  }),

  getTrackableById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const id = input;

      console.log("\ngetTrackableById");

      const trackable = await prisma.trackable.findFirst({
        where: {
          id: id,
        },
      });

      if (!trackable) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No trackable id '${id}'`,
        });
      }

      const data = await prisma.trackableRecord.findMany({
        where: {
          trackableId: trackable.id,
        },
      });

      const returnedTrackable: ITrackable = {
        ...trackable,
        settings: (trackable.settings as Record<string, any>) || {},
        data: {},
      };

      data.forEach((el) => {
        returnedTrackable.data[format(el.date, "yyyy-MM-dd")] = el.value;
      });

      return returnedTrackable;
    }),

  updateTrackableById: publicProcedure
    .input(trackableUpdate)
    .mutation(async ({ input }) => {
      const date = new Date(input.year, input.month, input.day);

      const record = await prisma.trackableRecord.upsert({
        create: {
          trackableId: input.id,
          value: input.value,
          date,
        },
        update: {
          value: input.value,
        },
        where: {
          trackableId_date: {
            trackableId: input.id,
            date: date,
          },
        },
      });

      return input;
    }),

  createTrackable: publicProcedure
    .input(trackableToCreate)
    .mutation(async ({ input }) => {
      const defUser = await getDefaultUser();

      const created = await prisma.trackable.create({
        data: {
          type: input.type,
          settings: input.settings,
          userId: defUser.id,
        },
      });

      return { ...created, data: {} };
    }),

  deleteTrackable: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      await prisma.trackableRecord.deleteMany({
        where: {
          trackableId: input,
        },
      });

      await prisma.trackable.delete({
        where: {
          id: input,
        },
      });

      return;
    }),

  updateTrackableSettings: publicProcedure
    .input(
      z.object({
        id: z.string(),
        settings: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.trackable.update({
        data: {
          settings: input.settings,
        },
        where: {
          id: input.id,
        },
      });
      return input.settings;
    }),
});
