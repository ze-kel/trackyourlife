import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import type { DbTrackableRecordInsert } from "@tyl/db/schema";
import { and, between, eq, sql } from "@tyl/db";
import { trackable, trackableRecord } from "@tyl/db/schema";
import { getNowInTimezone, getStartOfDayGMT } from "@tyl/helpers/timezone";
import { ZGETLimits } from "@tyl/validators/api";
import {
  trackableToCreate,
  ZTrackableSettings,
  ZTrackableUpdate,
} from "@tyl/validators/trackable";

import {
  getDateBounds,
  GetUserSettings,
  makeTrackableData,
  makeTrackableSettings,
  prepareTrackable,
} from "../helpers";
import { protectedProcedure } from "../trpc";

export const trackablesRouter = {
  getTrackableIdList: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.trackable.findMany({
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
  }),
  getAllTrackables: protectedProcedure
    .input(z.object({ limits: ZGETLimits }))
    .query(async ({ ctx, input }) => {
      const settings = await GetUserSettings({ userId: ctx.user.id });

      const bounds = getDateBounds(input.limits ?? { type: "last", days: 31 });

      const raw = await ctx.db.query.trackable.findMany({
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
    }),

  getTrackableById: protectedProcedure
    .input(z.object({ id: z.string(), limits: ZGETLimits }))
    .query(async ({ ctx, input }) => {
      const settings = await GetUserSettings({ userId: ctx.user.id });
      const bounds = getDateBounds(input.limits ?? { type: "last", days: 31 });
      const tr = await ctx.db.query.trackable.findFirst({
        where: and(
          eq(trackable.id, input.id),
          eq(trackable.userId, ctx.user.id),
        ),
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
    }),

  getTrackableData: protectedProcedure
    .input(z.object({ id: z.string(), limits: ZGETLimits }))
    .query(async ({ ctx, input }) => {
      const settings = await GetUserSettings({ userId: ctx.user.id });
      const bounds = getDateBounds(input.limits);

      const data = await ctx.db.query.trackableRecord.findMany({
        where: and(
          eq(trackableRecord.trackableId, input.id),
          eq(trackableRecord.userId, ctx.user.id),
          between(trackableRecord.date, bounds.from, bounds.to),
        ),
      });

      return makeTrackableData(data, input.limits);
    }),

  getTrackableSettings: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const tr = await ctx.db.query.trackable.findFirst({
        where: and(
          eq(trackable.id, input.id),
          eq(trackable.userId, ctx.user.id),
        ),
      });

      if (!tr) {
        throw new Error(`Unable to find trackable with id: ${input.id}`);
      }
      return makeTrackableSettings(tr);
    }),

  createTrackable: protectedProcedure
    .input(trackableToCreate)
    .mutation(async ({ ctx, input }) => {
      const cr = await ctx.db
        .insert(trackable)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      if (!cr[0]) {
        throw new Error("DB Error: Insert did not return any rows");
      }

      return cr[0];
    }),

  deleteTrackable: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(trackable)
        .set({
          isDeleted: true,
        })
        .where(
          and(eq(trackable.userId, ctx.user.id), eq(trackable.id, input.id)),
        );
    }),

  updateTrackableEntry: protectedProcedure
    .input(ZTrackableUpdate)
    .mutation(async ({ ctx, input }) => {
      const toInsert: DbTrackableRecordInsert = {
        trackableId: input.id,
        value: input.value,
        date: new Date(
          Date.UTC(input.year, input.month, input.day, 0, 0, 0, 0),
        ),
        userId: ctx.user.id,
      };

      await ctx.db
        .insert(trackableRecord)
        .values(toInsert)
        .onConflictDoUpdate({
          target: [trackableRecord.trackableId, trackableRecord.date],
          set: { value: input.value },
        })
        .returning();

      return input;
    }),
  updateTrackableEntries: protectedProcedure
    .input(z.array(ZTrackableUpdate))
    .mutation(async ({ ctx, input }) => {
      const toInsert: DbTrackableRecordInsert[] = input.map((i) => ({
        trackableId: i.id,
        value: i.value,
        date: new Date(Date.UTC(i.year, i.month, i.day, 0, 0, 0, 0)),
        userId: ctx.user.id,
      }));

      await ctx.db
        .insert(trackableRecord)
        .values(toInsert)
        .onConflictDoUpdate({
          target: [trackableRecord.trackableId, trackableRecord.date],
          set: { value: sql.raw(`excluded.${trackableRecord.value.name}`) },
        });

      return input;
    }),
  updateTrackableName: protectedProcedure
    .input(
      z.object({
        newName: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(trackable)
        .set({ name: input.newName })
        .where(
          and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
        );
    }),

  updateTrackableSettings: protectedProcedure
    .input(
      z.object({ id: z.string(), newSettings: z.object({}).passthrough() }),
    )
    .mutation(async ({ ctx, input }) => {
      const tr = await ctx.db.query.trackable.findFirst({
        where: and(
          eq(trackable.id, input.id),
          eq(trackable.userId, ctx.user.id),
        ),
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

      await ctx.db
        .update(trackable)
        .set({ settings: parsed.data })
        .where(
          and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
        );

      return parsed.data;
    }),
} satisfies TRPCRouterRecord;
