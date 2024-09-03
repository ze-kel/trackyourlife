import { useEffect } from "react";
import { AppState } from "react-native";
import { hookstate } from "@hookstate/core";
import { differenceInSeconds, sub } from "date-fns";
import { and, eq, gte, sql } from "drizzle-orm";

import { debounce } from "@tyl/helpers";
import { ITrackableFromDB } from "@tyl/validators/trackable";
import { IUserSettings } from "@tyl/validators/user";

import { currentUser } from "~/data/authContext";
import { db } from "~/db";
import {
  authUser,
  LDbTrackableRecordInsert,
  meta,
  trackable,
  trackableRecord,
} from "~/db/schema";
import { api } from "~/utils/api";

const lastSync = hookstate<Date | null>(null);
const isSyncing = hookstate(false);
const isSyncEnabled = hookstate(false);
const syncError = hookstate("");

const updateLastSyncFromDb = () => {
  const userId = currentUser.get()?.userId;

  if (!userId) {
    lastSync.set(null);
    isSyncEnabled.set(false);
    return;
  }

  db.query.meta.findFirst({ where: eq(meta.userId, userId) }).then((v) => {
    if (v?.lastSync) {
      lastSync.set(v.lastSync);
    }

    isSyncEnabled.set(true);
  });
};

updateLastSyncFromDb();

currentUser.subscribe((v) => {
  updateLastSyncFromDb();
});

const pushChanges = async (ls: Date, userId: string) => {
  const updatedRecords = await db.query.trackableRecord.findMany({
    where: and(
      eq(trackableRecord.userId, userId),
      gte(trackableRecord.updated, ls),
    ),
  });

  const updatedTrackables = await db.query.trackable.findMany({
    where: and(eq(trackable.userId, userId), gte(trackable.updated, ls)),
  });

  console.log("updated records", updatedRecords.length);

  console.log(
    "sending updates trackabalbes",
    updatedTrackables.map((v) => [v.name, differenceInSeconds(v.updated, ls)]),
  );

  const updatedUser = await db.query.authUser.findFirst({
    where: and(eq(authUser.id, userId), gte(authUser.updated, ls)),
  });

  if (updatedRecords && updatedRecords.length) {
    await api.syncRouter.pushRecordUpdates.query(updatedRecords);
  }

  if (updatedTrackables && updatedTrackables.length) {
    await api.syncRouter.pushTrackableUpdates.query(
      updatedTrackables as ITrackableFromDB[],
    );
  }

  if (updatedUser) {
    await api.syncRouter.pushUserUpdates.query({
      updated: updatedUser.updated,
      settings: updatedUser.settings || undefined,
      username: updatedUser.username || "",
    });
  }
};

const pullChanges = async (ls: Date) => {
  const trackablesUpdates = await api.syncRouter.getTrackableUpdates.query(ls);

  const recordsUpdates = await api.syncRouter.getRecordUpdates.query(ls);

  const userUpdates = await api.syncRouter.getUserUpdates.query(ls);

  return { trackablesUpdates, recordsUpdates, userUpdates };
};

const applyPulledChanges = async (
  ls: Date,
  userId: string,
  nowDate: Date,
  u: Awaited<ReturnType<typeof pullChanges>>,
) => {
  const { trackablesUpdates, recordsUpdates, userUpdates } = u;

  if (trackablesUpdates.length) {
    await db
      .insert(trackable)
      .values(trackablesUpdates)
      .onConflictDoUpdate({
        target: [trackable.id],
        set: {
          type: sql.raw(`excluded.${trackable.type.name}`),
          settings: sql.raw(`excluded.${trackable.settings.name}`),
          updated: sql.raw(`excluded.${trackable.updated.name}`),
          name: sql.raw(`excluded.${trackable.name.name}`),
          userId: sql.raw(`excluded.${trackable.userId.name}`),
          isDeleted: sql.raw(`excluded.${trackable.isDeleted.name}`),
        },
      });
  }

  if (recordsUpdates.length) {
    await db
      .insert(trackableRecord)
      .values(recordsUpdates)
      .onConflictDoUpdate({
        target: [trackableRecord.trackableId, trackableRecord.date],
        set: {
          value: sql.raw(`excluded.${trackableRecord.value.name}`),
          updated: sql.raw(`excluded.${trackableRecord.updated.name}`),
        },
      });
  }

  if (userUpdates) {
    await db
      .insert(authUser)
      .values(userUpdates as typeof userUpdates & { settings: IUserSettings })
      .onConflictDoUpdate({
        target: [authUser.id],
        set: {
          username: sql.raw(`excluded.${authUser.username.name}`),
          updated: sql.raw(`excluded.${authUser.updated.name}`),
          settings: sql.raw(`excluded.${authUser.settings.name}`),
          email: sql.raw(`excluded.${authUser.email.name}`),
        },
      });
  }

  await db
    .insert(meta)
    .values({ userId, lastSync: nowDate })
    .onConflictDoUpdate({
      target: meta.userId,
      set: {
        lastSync: nowDate,
      },
    });
};

const sync = async (clear?: boolean) => {
  if (!isSyncEnabled.get()) return;
  if (isSyncing.get()) return;

  const userId = currentUser.get()?.userId;
  if (!userId) return;

  isSyncing.set(true);
  syncError.set("");

  let ls = lastSync.get() || new Date(1971);

  try {
    const nowDate = new Date();
    if (clear) {
      ls = new Date(1970);
    }

    const p = await pullChanges(ls);

    if (!clear && ls) {
      await pushChanges(ls, userId);
    }

    await applyPulledChanges(ls, userId, nowDate, p);

    lastSync.set(nowDate);
  } catch (e) {
    console.log("ERR", e);
    syncError.set(String(e));
  } finally {
    isSyncing.set(false);
  }
};
const debouncedSync = debounce(sync, 500);

const updateTrackableRecord = async (v: LDbTrackableRecordInsert) => {
  await db
    .insert(trackableRecord)
    .values(v)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: {
        value: sql.raw(`excluded.${trackableRecord.value.name}`),
      },
    });
  debouncedSync();
};

const useSyncInterval = () => {
  return;
  useEffect(() => {
    const fsync = () => {
      const ls = lastSync.get();
      if (!ls) {
        sync();
        return;
      }

      const date = new Date();
      const secondsSinceLast = (date.getTime() - ls.getTime()) / 1000;

      const diffToSync = AppState.currentState === "active" ? 15 : 60 * 10;

      if (secondsSinceLast > diffToSync) {
        debouncedSync();
      }
    };

    fsync();

    const i = setInterval(fsync, 5000);

    return () => clearInterval(i);
  });
};

export {
  updateTrackableRecord,
  debouncedSync,
  sync,
  updateLastSyncFromDb,
  isSyncing,
  isSyncEnabled,
  lastSync,
  syncError,
  useSyncInterval,
};
