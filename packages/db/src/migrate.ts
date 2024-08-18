import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from ".";

// Folder path is correct for docker deployment of production build.
// When developing locally do not set migration to true, use commands in package.json instead
void migrate(db, { migrationsFolder: "./drizzle" });
