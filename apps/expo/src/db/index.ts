import { openDatabaseSync, SQLiteDatabase } from "expo-sqlite/next";
import { drizzle } from "drizzle-orm/expo-sqlite";

import * as schema from "./schema";

const expoDb = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expoDb, { schema });
export { db, expoDb };
