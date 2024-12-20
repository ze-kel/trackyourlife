import { relations } from "drizzle-orm";
import {
  boolean,
  json,
  pgEnum,
  pgTableCreator,
  primaryKey,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { ITrackableSettings, IUserSettings } from "./jsonValidators";

const pgTable = pgTableCreator((name) => `TYL_${name}`);

export const auth_user = pgTable("auth_user", {
  id: varchar("id").primaryKey(),

  email: varchar("email").unique().notNull(),
  username: varchar("username").notNull(),

  hashedPassword: varchar("hashed_password").notNull(),

  settings: json("settings").default({}).$type<IUserSettings>(),
  // Currently only used to identify users created by e2e testing
  role: varchar("role"),
});

export const user_session = pgTable("user_session", {
  id: varchar("id").primaryKey(),

  userId: varchar("user_id")
    .notNull()
    .references(() => auth_user.id),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const trackableTypeEnum = pgEnum("type", ["boolean", "number", "range"]);

export const trackable = pgTable("trackable", {
  is_deleted: boolean("is_deleted").notNull().default(false),
  user_id: varchar("user_id")
    .notNull()
    .references(() => auth_user.id, { onDelete: "cascade" }),

  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name").notNull(),
  type: trackableTypeEnum("type").notNull(),
  attached_note: varchar("attached_note"),
  settings: json("settings").default({}).$type<ITrackableSettings>(),
});

export const ZTrackableDbSelect = createSelectSchema(trackable);
export const ZTrackableDbInsert = createInsertSchema(trackable).omit({
  is_deleted: true,
  id: true,
  user_id: true,
});

export const trackableRelations = relations(trackable, ({ many }) => ({
  data: many(trackableRecord),
}));

export const trackableRecord = pgTable(
  "trackableRecord",
  {
    trackableId: uuid("trackableId")
      .notNull()
      .references(() => trackable.id, { onDelete: "cascade" }),
    date: timestamp("date").notNull(),
    value: varchar("value").notNull(),
    user_id: varchar("user_id")
      .notNull()
      .references(() => auth_user.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.trackableId, t.date] }),
    unq: unique().on(t.trackableId, t.date).nullsNotDistinct(),
  }),
);

export const recordRelations = relations(trackableRecord, ({ one }) => ({
  trackableId: one(trackable, {
    fields: [trackableRecord.trackableId],
    references: [trackable.id],
  }),
  userId: one(auth_user, {
    fields: [trackableRecord.user_id],
    references: [auth_user.id],
  }),
}));

export type DbUserSelect = typeof auth_user.$inferSelect;
export type DbSessionSelect = typeof user_session.$inferSelect;

export type DbTrackableSelect = typeof trackable.$inferSelect;
export type DbTrackableInsert = typeof trackable.$inferInsert;

export type DbTrackableRecordSelect = typeof trackableRecord.$inferSelect;
export type DbTrackableRecordInsert = typeof trackableRecord.$inferInsert;
