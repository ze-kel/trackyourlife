import { openDatabaseSync } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";

import * as schema from "./schema";

const expoDb = openDatabaseSync("ttttt.db", { enableChangeListener: true });
const db = drizzle(expoDb, { schema });

const clearDB = async () => {
  await db.delete(schema.trackable);
  await db.delete(schema.trackableRecord);
  await db.delete(schema.authUser);
  await db.delete(schema.meta);
};

export { db, expoDb, clearDB };
