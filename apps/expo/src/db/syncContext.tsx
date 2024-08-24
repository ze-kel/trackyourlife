import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { eq, gte, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { debounce } from "@tyl/helpers";

import { clearDB, db, expoDb } from "~/db";
import {
  LDbTrackableRecordInsert,
  meta,
  trackable,
  trackableRecord,
} from "~/db/schema";
import { api } from "~/utils/api";

interface ISyncContext {
  sync: (clear?: boolean) => Promise<void>;
  lastSync?: Date;
  isLoading: boolean;
  error?: string;

  updateTrackableRecord: (v: LDbTrackableRecordInsert) => Promise<void>;
}

const updRecord = async (v: LDbTrackableRecordInsert) => {
  await db
    .insert(trackableRecord)
    .values(v)
    .onConflictDoUpdate({
      target: [trackableRecord.trackableId, trackableRecord.date],
      set: {
        value: sql.raw(`excluded.${trackableRecord.value.name}`),
      },
    });
};

const SyncContext = createContext<ISyncContext>({
  sync: async () => {},
  lastSync: new Date(),
  isLoading: false,
  updateTrackableRecord: updRecord,
});

export const useSync = () => {
  return useContext(SyncContext);
};

const USER_KEY = "all";

const synchonizeDb = async (clear: boolean, lastSync?: Date) => {
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
  }

  const trackablesUpdates =
    await api.syncRouter.getTrackableUpdates.query(lastSync);

  const recordsUpdates = await api.syncRouter.getRecordUpdates.query(lastSync);

  if (clear) {
    await clearDB();
  }

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
};

export const SyncContextProvider = ({ children }: PropsWithChildren) => {
  useDrizzleStudio(expoDb);

  const r = db.query.meta.findFirst();

  const { data } = useLiveQuery(
    db.query.meta.findFirst({ where: eq(meta.user, USER_KEY) }),
  );

  const lastSync = data?.lastSync || undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sync = async (clear = false) => {
    if (isLoading) return;

    const nowDate = new Date();
    setIsLoading(true);

    try {
      await synchonizeDb(clear, lastSync);
      await db
        .insert(meta)
        .values({ user: USER_KEY, lastSync: nowDate })
        .onConflictDoUpdate({
          target: meta.user,
          set: {
            lastSync: nowDate,
          },
        });
      setError(undefined);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSync = useCallback(debounce(sync, 500), [sync]);

  const updateAndSync = async (v: LDbTrackableRecordInsert) => {
    await updRecord(v);
    debouncedSync();
  };

  return (
    <SyncContext.Provider
      value={{
        lastSync,
        error,
        isLoading,
        sync,
        updateTrackableRecord: updateAndSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
