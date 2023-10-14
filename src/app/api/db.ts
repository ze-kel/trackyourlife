import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "../../schema";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("Unable to read process.env.DATABASE_URL");
}

export const pool = new Pool({
  connectionString: connectionString,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
