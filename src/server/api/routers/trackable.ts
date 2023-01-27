import { protectedProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { prisma } from "../../db";

import type { ITrackable } from "src/types/trackable";

import { format } from "date-fns";
import {
  ZTrackableSettingsBoolean,
  ZTrackableSettingsNumber,
  ZTrackableSettingsRange,
  ZTrackableUpdate,
} from "src/types/trackable";
import type { Prisma } from "@prisma/client";

const trackableToCreate = z.discriminatedUnion("type", [
  z.object({
    settings: ZTrackableSettingsBoolean,
    type: z.literal("boolean"),
  }),
  z.object({
    settings: ZTrackableSettingsNumber,
    type: z.literal("number"),
  }),
  z.object({
    settings: ZTrackableSettingsRange,
    type: z.literal("range"),
  }),
]);

export const trackableRouter = createTRPCRouter({
  getAllIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const entries = await prisma.trackable.findMany({ where: { userId } });
    return entries.map((entry) => entry.id);
  }),

  getTrackableById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const id: string = input;

      const userId = ctx.session.user.id;

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
        data: {},
        settings: {},
      };

      data.forEach((el) => {
        returnedTrackable.data[format(el.date, "yyyy-MM-dd")] = el.value;
      });

      let settingsParser;
      const type = trackable.type;
      if (type === "boolean") {
        settingsParser = ZTrackableSettingsBoolean;
      }
      if (type === "number") {
        settingsParser = ZTrackableSettingsNumber;
      }
      if (type === "range") {
        settingsParser = ZTrackableSettingsRange;
      }
      if (!settingsParser) throw new Error("No parser for settings");

      // Note that this we store settings as JSON, therefore dates there are stored as strings.
      // Here z.coerce.date() auto converts them to JS dates.
      const parseRes = settingsParser.safeParse(trackable.settings);
      if (parseRes.success) {
        returnedTrackable.settings = parseRes.data;
      }

      return returnedTrackable;
    }),

  updateTrackableById: protectedProcedure
    .input(ZTrackableUpdate)
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

      await prisma.trackableRecord.upsert({
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
      const userId: string = ctx.session.user.id;

      const created = await prisma.trackable.create({
        data: {
          type: input.type,
          settings: input.settings as Prisma.JsonObject,
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
      const trackable = await prisma.trackable.findUnique({
        where: { id: input.id },
      });

      if (!trackable) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No trackable with ID" + input.id,
        });
      }

      let parsed;

      if (trackable.type === "boolean") {
        parsed = ZTrackableSettingsBoolean.safeParse(input.settings);
      }

      if (trackable.type === "number") {
        parsed = ZTrackableSettingsNumber.safeParse(input.settings);
      }

      if (trackable.type === "range") {
        parsed = ZTrackableSettingsRange.safeParse(input.settings);
      }

      if (!parsed || !parsed?.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Settings do not match Trackable type schema",
        });
      }

      await prisma.trackable.update({
        data: {
          settings: parsed.data as Prisma.JsonObject,
        },
        where: {
          id: input.id,
        },
      });

      return parsed.data;
    }),
});
