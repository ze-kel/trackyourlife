import {
  addDatabaseChangeListener,
  DatabaseChangeEvent,
} from "expo-sqlite/next";
import { eq, getTableName } from "drizzle-orm";
import { SQLiteTable, TableConfig } from "drizzle-orm/sqlite-core";

import { currentUser } from "~/data/authContext";
import { db, expoDb } from "../db/index";
import {
  authUser,
  LDbTrackableRecordSelect,
  LDbTrackableSelect,
  LDbUserDataSelect,
  trackable,
  trackableRecord,
} from "../db/schema";

const addSubscrption = <T>(
  m: Map<string, Array<(v: T) => void>>,
  key: string,
  cb: (v: T) => void,
) => {
  let v = m.get(key);
  if (!v) {
    m.set(key, [cb]);
  } else {
    v.push(cb);
  }
};
const removeSubscription = <T>(
  m: Map<string, Array<(v: T) => void>>,
  key: string,
  cb: (v: T) => void,
) => {
  const v = m.get(key);
  if (v) {
    m.set(
      key,
      v.filter((v) => v !== cb),
    );
  }
};

const notify = <T>(
  m: Map<string, Array<(v: T) => void>>,
  key: string,
  value: T,
) => {
  const a = m.get(key);
  if (a && a.length) {
    a.forEach((v) => v(value));
  }
};

class Subscribable<
  TAB extends SQLiteTable<TableConfig>,
  KEY,
  SEL extends KEY & TAB["$inferSelect"],
> {
  map: Map<string, Array<(v: SEL) => void>>;
  keyFunction: (v: KEY) => string;
  tableName: string;

  constructor(table: TAB, keyFunction: (v: KEY) => string) {
    this.map = new Map();
    this.keyFunction = keyFunction;
    this.tableName = getTableName(table);
  }

  subscribe(vk: Parameters<typeof this.keyFunction>[0], cb: (v: SEL) => void) {
    const key = this.keyFunction(vk);
    addSubscrption(this.map, key, cb);

    return () => removeSubscription(this.map, key, cb);
  }

  async listenerHook(v: DatabaseChangeEvent) {
    if (v.tableName === this.tableName) {
      const u = (await expoDb.getFirstAsync(
        `SELECT * FROM ${this.tableName} WHERE rowid = ${v.rowId}`,
      )) as SEL;

      const key = this.keyFunction(u);

      const subs = this.map.get(key);

      if (subs && subs.length) {
        subs.forEach((v) => v(u));
      }

      notify(this.map, key, u);
    }
  }

  totalSubs() {
    const a = this.map.values();
    let i = 0;
    for (const b of a) {
      i += b.length;
    }
    return i;
  }
}

//
// Trackable Record
//

const trackableRecordSubKey = (
  v: Pick<LDbTrackableRecordSelect, "trackableId" | "date">,
) => {
  return `${v.trackableId}_${Number(v.date)}`;
};

const TrackableRecordSub = new Subscribable(
  trackableRecord,
  trackableRecordSubKey,
);

//
// Trackable
//

const trackableSubKey = (v: Pick<LDbTrackableSelect, "id" | "userId">) => {
  return `${v.userId}_${v.id}`;
};

const TrackableSub = new Subscribable(trackable, trackableSubKey);

//
// User data
//

const userDataKey = (v: Pick<LDbUserDataSelect, "id">) => {
  return `${v.id}`;
};

const UserDataSub = new Subscribable(authUser, userDataKey);

//
// Trackables list
//

export const allTrackables = new Map<string, LDbTrackableSelect>();

const updateAllTrackables = async () => {
  const r = await db.query.trackable.findMany({
    where: eq(trackable.isDeleted, false),
  });

  allTrackables.clear();

  r.forEach((v) => {
    allTrackables.set(v.id, v);
  });
};

updateAllTrackables();

const allTrackablesHook = (v: DatabaseChangeEvent) => {
  if (v.tableName === getTableName(trackable)) {
    //TODO
  }
};

const listenerRouter = async (v: DatabaseChangeEvent) => {
  await Promise.all(
    [TrackableSub, TrackableRecordSub, UserDataSub].map((s) =>
      s.listenerHook(v),
    ),
  );
};

addDatabaseChangeListener(listenerRouter);

export { UserDataSub, TrackableSub, TrackableRecordSub };
