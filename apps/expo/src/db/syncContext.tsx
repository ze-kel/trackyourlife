import { useEffect, useState } from "react";
import { eq, gte, sql } from "drizzle-orm";

import { debounce } from "@tyl/helpers";
import { IUserSettings } from "@tyl/validators/user";

import { db } from "~/db";
import {
  LDbTrackableRecordInsert,
  meta,
  trackable,
  trackableRecord,
} from "~/db/schema";
import { updateUserSettings } from "~/db/userSettings";
import { api } from "~/utils/api";
import { proxy, ref, snapshot, subscribe } from "~/utils/proxy";

const USER_KEY = "all";

const syncState = proxy({
  lastSync: new Date(1970),
  isSyncing: false,
  isSyncEnabled: false,
  syncError: "",
});

const useSyncState = () => {
  const [state, setState] = useState(syncState);

  useEffect(() => {
    return subscribe(syncState, () => {
      setState(snapshot(syncState));
    });
  }, []);

  return state;
};

const resetLastSync = () => {
  syncState.lastSync = new Date(1970);
};

const updateLastSyncFromDb = () => {
  db.query.meta.findFirst({ where: eq(meta.user, USER_KEY) }).then((v) => {
    if (v?.lastSync) {
      syncState.lastSync = v.lastSync;
    }
    syncState.isSyncEnabled = true;
  });
};

updateLastSyncFromDb();

const sync = async (clear?: boolean) => {
  if (!syncState.isSyncEnabled) return;

  if (syncState.isSyncing) return;

  syncState.isSyncing = true;

  syncState.syncError = "";

  let lastSync = syncState.lastSync;

  try {
    const nowDate = new Date();
    if (clear) {
      lastSync = new Date(1970);
    }

    if (!clear && lastSync) {
      const updated = await db.query.trackableRecord.findMany({
        where: gte(trackableRecord.updated, lastSync),
      });

      if (updated) {
        await api.syncRouter.pushRecordUpdates.query(updated);
      }

      const updatedUser = await db.query.meta.findFirst({
        where: gte(meta.updated, lastSync),
      });

      if (updatedUser && updatedUser.settings) {
        await api.syncRouter.pushSettingsUpdates.query({
          updated: updatedUser.updated,
          settings: updatedUser.settings,
        });
      }
    }

    const trackablesUpdates =
      await api.syncRouter.getTrackableUpdates.query(lastSync);

    const recordsUpdates =
      await api.syncRouter.getRecordUpdates.query(lastSync);

    const userUpdates = await api.syncRouter.getSettingsUpdates.query(lastSync);

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

    console.log("userUpdates", userUpdates);
    if (userUpdates) {
      await db.update(meta).set({
        settings: userUpdates.settings as IUserSettings,
        updated: userUpdates.updated,
      });
    }

    await db
      .insert(meta)
      .values({ user: USER_KEY, lastSync: nowDate })
      .onConflictDoUpdate({
        target: meta.user,
        set: {
          lastSync: nowDate,
        },
      });

    syncState.lastSync = nowDate;
  } catch (e) {
    syncState.syncError = String(e);
  } finally {
    syncState.isSyncing = false;
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

export {
  updateTrackableRecord,
  debouncedSync,
  sync,
  syncState,
  useSyncState,
  updateLastSyncFromDb,
  resetLastSync,
};
