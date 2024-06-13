import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from ".";

void migrate(db, { migrationsFolder: "./drizzle" });
