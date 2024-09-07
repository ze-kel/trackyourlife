import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

import { ITrackable } from "@tyl/validators/trackable";
import { IUserSettings } from "@tyl/validators/user";

export const meta = sqliteTable("meta", {
  userId: text("user_id").primaryKey(),
  lastSync: integer("updated", { mode: "timestamp_ms" }),
});

export const authUser = sqliteTable("auth_user", {
  id: text("id").primaryKey(),
  settings: text("settings", { mode: "json" }).$type<IUserSettings>(),
  username: text("username"),
  email: text("email"),
  updated: integer("updated", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const trackable = sqliteTable("trackable", {
  updated: integer("updated", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(current_timestamp)`),
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull().$type<ITrackable["type"]>(),

  isDeleted: integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),

  settings: text("settings", { mode: "json" }).default({}),
});

export const trackableRelations = relations(trackable, ({ many }) => ({
  data: many(trackableRecord),
}));

export const trackableRecord = sqliteTable(
  "trackableRecord",
  {
    updated: integer("updated", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(current_timestamp)`),

    trackableId: text("trackableId")
      .notNull()
      .references(() => trackable.id, { onDelete: "cascade" }),
    date: integer("date", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(current_timestamp)`),
    value: text("value").notNull(),
    userId: text("user_id").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.trackableId, t.date] }),
    unq: unique().on(t.trackableId, t.date),
  }),
);

export const recordRelations = relations(trackableRecord, ({ one }) => ({
  trackableId: one(trackable, {
    fields: [trackableRecord.trackableId],
    references: [trackable.id],
  }),
}));

export type LDbTrackableSelect = typeof trackable.$inferSelect;
export type LDbTrackableInsert = typeof trackable.$inferInsert;

export type LDbUserDataSelect = typeof authUser.$inferSelect;
export type LDbUserDataInsert = typeof authUser.$inferInsert;

export type LDbTrackableRecordSelect = typeof trackableRecord.$inferSelect;
export type LDbTrackableRecordInsert = typeof trackableRecord.$inferInsert;
