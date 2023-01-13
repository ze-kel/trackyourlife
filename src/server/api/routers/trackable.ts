// TODO
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "../../db";

import type { ITrackable } from "src/types/trackable";

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

export const trackableRouter = createTRPCRouter({
  getAllIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const entries = await prisma.trackable.findMany({ where: { userId } });
    return entries.map((entry) => entry.id);
  }),

  getTrackableById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const id = input;

      const userId = ctx.session.user.id;
      console.log("userId", userId);

      const trackable = await prisma.trackable.findFirst({
        where: {
          id: id,
          userId,
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

  updateTrackableById: protectedProcedure
    .input(trackableUpdate)
    .mutation(async ({ input, ctx }) => {
      const date = new Date(input.year, input.month, input.day);

      const userId = ctx.session.user.id;
      const trackable = await prisma.trackable.findUnique({
        where: { id: input.id },
      });
      if (!trackable || trackable.userId !== userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No trackable with ID" + input.id,
        });
      }

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

  createTrackable: protectedProcedure
    .input(trackableToCreate)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const created = await prisma.trackable.create({
        data: {
          type: input.type,
          settings: input.settings,
          userId,
        },
      });

      return { ...created, data: {} };
    }),

  deleteTrackable: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const trackable = await prisma.trackable.findUnique({
        where: { id: input },
      });
      if (!trackable || trackable.userId !== userId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No trackable with ID" + input,
        });
      }

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

  updateTrackableSettings: protectedProcedure
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
