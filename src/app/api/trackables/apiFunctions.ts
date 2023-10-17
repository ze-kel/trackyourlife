import { log } from "console";
import { and, eq } from "drizzle-orm";
import { db } from "src/app/api/db";
import { trackable } from "src/schema";

export const DeleteTrackable = async (id: string, userId: string) => {
  log(`API: Trackable Delete ${id}`);

  await db
    .delete(trackable)
    .where(and(eq(trackable.userId, userId), eq(trackable.id, id)));
};
