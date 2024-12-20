import type { TRPCRouterRecord } from "@trpc/server";
import { parse } from "date-fns";
import { z } from "zod";

import type { DbTrackableRecordInsert } from "@tyl/db/schema";
import { and, between, eq, sql } from "@tyl/db";
import { trackable, trackableRecord } from "@tyl/db/schema";
import { zUpdateTrackableEntries } from "@tyl/validators/import";
import {
  ZTrackableSettings,
  ZTrackableToCreate,
  ZTrackableUpdate,
} from "@tyl/validators/trackable";

import { ZGETLimits } from "../../../helpers/api";
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
      const userSettings = await GetUserSettings({ userId: ctx.user.id });
      const bounds = getDateBounds(
        input.limits ?? { type: "last", days: 31 },
        userSettings.timezone,
      );

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

      return raw.map((v) =>
        prepareTrackable(v, input.limits, userSettings.timezone),
      );
    }),

  getTrackableById: protectedProcedure
    .input(z.object({ id: z.string(), limits: ZGETLimits }))
    .query(async ({ ctx, input }) => {
      const userSettings = await GetUserSettings({ userId: ctx.user.id });
      const bounds = getDateBounds(
        input.limits ?? { type: "last", days: 31 },
        userSettings.timezone,
      );
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

      return prepareTrackable(tr, input.limits, userSettings.timezone);
    }),

  getTrackableData: protectedProcedure
    .input(z.object({ id: z.string(), limits: ZGETLimits }))
    .query(async ({ ctx, input }) => {
      const userSettings = await GetUserSettings({ userId: ctx.user.id });
      const bounds = getDateBounds(input.limits, userSettings.timezone);

      const data = await ctx.db.query.trackableRecord.findMany({
        where: and(
          eq(trackableRecord.trackableId, input.id),
          eq(trackableRecord.userId, ctx.user.id),
          between(trackableRecord.date, bounds.from, bounds.to),
        ),
      });

      return makeTrackableData(data, input.limits, userSettings.timezone);
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
    .input(ZTrackableToCreate)
    .mutation(async ({ ctx, input }) => {
      const cr = await ctx.db
        .insert(trackable)
        .values({
          ...input,
          userId: ctx.user.id,
          updated: new Date(),
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
          updated: new Date(),
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
          set: { value: input.value, updated: new Date() },
        })
        .returning();

      return input;
    }),
  updateTrackableEntries: protectedProcedure
    .input(z.object({ data: z.array(ZTrackableUpdate) }))
    .mutation(async ({ ctx, input }) => {
      const toInsert: DbTrackableRecordInsert[] = input.data.map((i) => ({
        trackableId: i.id,
        value: i.value,
        date: new Date(Date.UTC(i.year, i.month, i.day, 0, 0, 0, 0)),
        userId: ctx.user.id,
        updated: new Date(),
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

  importTrackableEntries: protectedProcedure
    .input(zUpdateTrackableEntries)
    .mutation(async ({ ctx, input }) => {
      const tr = await ctx.db.query.trackable.findFirst({
        where: and(
          eq(trackable.id, input.id),
          eq(trackable.userId, ctx.user.id),
        ),
      });

      if (!tr) {
        throw new Error(`No trackable with id ${input.id}`);
      }

      if (tr.type !== input.data.type) {
        throw new Error(
          `Trackable type mismatch: trackable is ${tr.type} but data is ${input.data.type}`,
        );
      }

      const toInsert: DbTrackableRecordInsert[] = Object.entries(
        input.data.data,
      ).map(([date, value]) => ({
        trackableId: input.id,
        value: String(value),
        date: parse(date, "yyyy-MM-dd", new Date()),
        userId: ctx.user.id,
        updated: new Date(),
      }));

      if (toInsert.length === 0) {
        throw new Error("No entries to import");
      }

      switch (input.actionOnConflict) {
        case "skip":
          await ctx.db
            .insert(trackableRecord)
            .values(toInsert)
            .onConflictDoNothing();
          break;
        case "overwrite":
          await ctx.db
            .insert(trackableRecord)
            .values(toInsert)
            .onConflictDoUpdate({
              target: [trackableRecord.trackableId, trackableRecord.date],
              set: { value: sql.raw(`excluded.${trackableRecord.value.name}`) },
            });
          break;
      }

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
        .set({ name: input.newName, updated: new Date() })
        .where(
          and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
        );
    }),
  updateTrackableNote: protectedProcedure
    .input(
      z.object({
        note: z.string(),
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(trackable)
        .set({ note: input.note, updated: new Date() })
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
        .set({ settings: parsed.data, updated: new Date() })
        .where(
          and(eq(trackable.id, input.id), eq(trackable.userId, ctx.user.id)),
        );

      return parsed.data;
    }),
} satisfies TRPCRouterRecord;
