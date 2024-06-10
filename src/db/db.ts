import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { migrate } from "drizzle-orm/node-postgres/migrator";

import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

export const pool = new Pool({
  connectionString: connectionString,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

if (process.env.MIGRATE === "true") {
  void migrate(db, { migrationsFolder: "./drizzle" });
}
