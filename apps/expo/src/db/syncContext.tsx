import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { sql } from "drizzle-orm";

import { db } from "~/db";
import { trackable, trackableRecord } from "~/db/schema";
import { api } from "~/utils/api";

interface ISyncContext {
  sync: () => Promise<void>;
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
  const [lastSync, setLastSync] = useState(new Date(1970));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sync = useCallback(async () => {
    if (isLoading) return;

    const nowDate = new Date();

    setIsLoading(true);

    try {
      const trackablesUpdates =
        await api.syncRouter.getTrackableUpdates.query(lastSync);

      const recordsUpdates =
        await api.syncRouter.getRecordUpdates.query(lastSync);

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

      setLastSync(nowDate);
      setError(undefined);
    } catch (e) {
      console.error(e);
      setError(String(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SyncContext.Provider value={{ lastSync, error, isLoading, sync }}>
      {children}
    </SyncContext.Provider>
  );
};
