import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

import * as schema from "./schema";

export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";

const connectionString = process.env.DATABASE_URL || "";

const pool = new pg.Pool({
  connectionString: connectionString,
});

const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

if (process.env.MIGRATE === "true") {
  void migrate(db, { migrationsFolder: "./drizzle" });
}

export { db, pool };
