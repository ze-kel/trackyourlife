import { migrate } from "drizzle-orm/node-postgres/migrator";

import { db } from "./client.js";

void migrate(db, { migrationsFolder: "./drizzle" });
