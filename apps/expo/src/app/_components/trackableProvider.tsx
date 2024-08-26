import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { and, between, eq, sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import {
  ITrackable,
  ITrackableFromList,
  ZTrackableSettings,
} from "@tyl/validators/trackable";

import { MemoDayCellProvider } from "~/app/_components/DayCellProvider";
import { db } from "~/db";
import { dbSub } from "~/db/dbSub";
import { trackableRecord } from "~/db/schema";
import { useSync } from "~/db/syncContext";

type UseReturn = {
  value?: string;
  error?: Error;
};

interface ITrackableContext {
  type: ITrackable["type"];
  name: ITrackable["name"];
  settings: ITrackable["settings"];
  useValue: (d: Date) => UseReturn;
  setValue: (d: Date, v: string) => void;
}

export const makeTrackableSettings = (trackable: unknown) => {
  const parseRes = ZTrackableSettings.safeParse(trackable);
  if (parseRes.success) {
    return parseRes.data;
  }
  return {};
};

const TrackableContext = createContext<ITrackableContext | null>(null);

export type ITrackableFromAppDB = ITrackableFromList & {
  settings: unknown;
  userId: string;
};

const useValueSub = (trackableId: string, date: Date) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    db.query.trackableRecord
      .findFirst({
        where: and(
          eq(trackableRecord.date, date),
          eq(trackableRecord.trackableId, trackableId),
        ),
      })
      .then((v) => {
        setValue(v?.value || "");
      });

    dbSub.subscribeToValue(trackableId, Number(date), setValue);
  });

  return { value };
};

export const TrackableProvider = ({
  trackable,
  children,
}: {
  trackable: ITrackableFromAppDB;
  children: ReactNode;
}) => {
  const { updateTrackableRecord } = useSync();

  const parsedSettings = useMemo(
    () => makeTrackableSettings(trackable),
    [trackable.settings],
  );

  const useValue = (d: Date) => {
    return useValueSub(trackable.id, d);
  };

  const setValue = async (d: Date, v: string) => {
    d.setUTCHours(0, 0, 0, 0);

    await updateTrackableRecord({
      userId: trackable.userId,
      trackableId: trackable.id,
      value: v,
      date: d,
    });
  };

  return (
    <TrackableContext.Provider
      value={{
        type: trackable.type,
        name: trackable.name,
        settings: parsedSettings,
        useValue,
        setValue,
      }}
    >
      <MemoDayCellProvider type={trackable.type} settings={parsedSettings}>
        {children}
      </MemoDayCellProvider>
    </TrackableContext.Provider>
  );
};

export const useTrackableContextSafe = () => {
  const stuff = useContext(TrackableContext);

  if (!stuff) throw new Error("useTrackableContextSafe: no data in context");

  return stuff;
};
