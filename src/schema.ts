import {
  pgEnum,
  pgTable,
  bigint,
  varchar,
  json,
  uuid,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const USER_ID_LEN = 15;

export const auth_user = pgTable("auth_user", {
  id: varchar("id", { length: USER_ID_LEN }).primaryKey(),

  email: varchar("email").unique().notNull(),
  username: varchar("username").notNull(),

  settings: json("settings").default({}).$type<Record<string, unknown>>(),
  // Currently only used to identify users created by e2e testing
  role: varchar("role"),
});

export const user_session = pgTable("user_session", {
  id: varchar("id", { length: 128 }).primaryKey(),

  userId: varchar("user_id", { length: 15 })
    .notNull()
    .references(() => auth_user.id),

  activeExpires: bigint("active_expires", { mode: "number" }).notNull(),

  idleExpires: bigint("idle_expires", { mode: "number" }).notNull(),
});

export const user_key = pgTable("user_key", {
  id: varchar("id", { length: 255 }).primaryKey(),

  userId: varchar("user_id", { length: USER_ID_LEN })
    .notNull()
    .references(() => auth_user.id),

  hashedPassword: varchar("hashed_password", { length: 255 }),
});

export const trackableTypeEnum = pgEnum("type", ["boolean", "number", "range"]);

export const trackable = pgTable("trackable", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: USER_ID_LEN })
    .notNull()
    .references(() => auth_user.id),

  type: trackableTypeEnum("type").notNull(),

  settings: json("settings").default({}),
});

export const trackableRelations = relations(trackable, ({ many }) => ({
  data: many(trackableRecord),
}));

export const trackableRecord = pgTable(
  "trackableRecord",
  {
    trackableId: uuid("trackableId")
      .notNull()
      .references(() => trackable.id),
    date: date("date").notNull(),
    value: varchar("value").notNull(),
    userId: varchar("user_id", { length: USER_ID_LEN })
      .notNull()
      .references(() => auth_user.id),
  },
  (t) => ({
    pk: primaryKey(t.trackableId, t.date),
    //unq: unique().on(t.trackableId, t.date).nullsNotDistinct(),
  }),
);

export const recordRelations = relations(trackableRecord, ({ one }) => ({
  trackableId: one(trackable, {
    fields: [trackableRecord.trackableId],
    references: [trackable.id],
  }),
  userId: one(auth_user, {
    fields: [trackableRecord.userId],
    references: [auth_user.id],
  }),
}));

export type DbTrackableSelect = typeof trackable.$inferSelect;
export type DbTrackableInsert = typeof trackable.$inferInsert;

export type DbTrackableRecordSelect = typeof trackableRecord.$inferSelect;
export type DbTrackableRecordInsert = typeof trackableRecord.$inferInsert;
