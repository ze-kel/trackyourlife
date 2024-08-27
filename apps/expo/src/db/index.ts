import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";

import * as schema from "./schema";
import { trackable, trackableRecord } from "./schema";

const expoDb = openDatabaseSync("trackyourlife.db", { enableChangeListener: true });
const db = drizzle(expoDb, { schema });

const clearDB = async () => {
  await db.delete(trackable);
  await db.delete(trackableRecord);
};

export { db, expoDb, clearDB };
