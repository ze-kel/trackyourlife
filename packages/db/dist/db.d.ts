import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
export declare const pool: Pool;
export declare const db: NodePgDatabase<typeof schema>;
//# sourceMappingURL=db.d.ts.map