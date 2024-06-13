import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";
declare const pool: Pool;
declare const db: NodePgDatabase<typeof schema>;
export { db, pool };
//# sourceMappingURL=index.d.ts.map