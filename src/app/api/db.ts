import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import type * as schema from "../../schema";

const connectionString = process.env.DATABASE_URL || "";

if (!connectionString) {
  throw new Error("Unable to read process.env.DATABASE_URL");
}

export const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient);
