import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { gte, sql } from "drizzle-orm";

import { db, expoDb } from "~/db";
import { trackable, trackableRecord } from "~/db/schema";
import { api } from "~/utils/api";

interface ISyncContext {
  sync: (clear?: boolean) => Promise<void>;
  lastSync: Date;
  isLoading: boolean;
  error?: string;
}

const SyncContext = createContext<ISyncContext>({
  sync: async () => {},
  lastSync: new Date(),
  isLoading: false,
});

export const useSync = () => {
  return useContext(SyncContext);
};

export const SyncContextProvider = ({ children }: PropsWithChildren) => {
  useDrizzleStudio(expoDb);
  const [lastSync, setLastSync] = useState(new Date(1970));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sync = async (clear = false) => {
    if (isLoading) return;

    const nowDate = new Date();

    console.log("SYNC", clear);
    setIsLoading(true);

    try {
      if (!clear) {
        const updated = await db.query.trackableRecord.findMany({
          where: gte(trackableRecord.updated, lastSync),
        });

        console.log(updated);

        if (updated) {
          await api.syncRouter.pushRecordUpdates.query(updated);
        }
      }

      const trackablesUpdates =
        await api.syncRouter.getTrackableUpdates.query(lastSync);

      const recordsUpdates =
        await api.syncRouter.getRecordUpdates.query(lastSync);

      if (clear) {
        await db.delete(trackable);
        await db.delete(trackableRecord);
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
      setLastSync(nowDate);
      setError(undefined);
    } catch (e) {
      console.error(e);
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SyncContext.Provider value={{ lastSync, error, isLoading, sync }}>
      {children}
    </SyncContext.Provider>
  );
};
