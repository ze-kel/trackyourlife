import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

import { ITrackable } from "@tyl/validators/trackable";

export const trackable = sqliteTable("trackable", {
  updated: integer("updated", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => new Date()),

  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  type: text("type").notNull().$type<ITrackable["type"]>(),

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
      .default(sql`(current_timestamp)`)
      .$onUpdate(() => new Date()),

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
