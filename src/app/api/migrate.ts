import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";

void migrate(db, { migrationsFolder: "./drizzle" });
