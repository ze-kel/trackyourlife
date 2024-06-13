import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
declare const pool: Pool;
declare const db: NodePgDatabase<typeof schema>;
declare const test: {
    hello: string;
};
export { test, db, pool, schema };
//# sourceMappingURL=client.d.ts.map