import { z } from "zod";

import { db, eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { UserSettingsFallback, ZUserSettings } from "@tyl/validators/user";

export type TCTX = {
  user: { id: string };
};

export const VgetUserSettings = z.object({});
export const FgetUserSettings = async (
  ctx: TCTX,
  input: z.infer<typeof VgetUserSettings>,
) => {
  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, ctx.user.id),
  });

  if (!user) return UserSettingsFallback;
  const parsed = ZUserSettings.safeParse(user.settings);
  if (!parsed.success) {
    return UserSettingsFallback;
  }
  return parsed.data;
};

export const VupdateUserSettings = z.object({});
export const FupdateUserSettings = async (
  ctx: TCTX,
  input: z.infer<typeof VupdateUserSettings>,
) => {
  await db
    .update(auth_user)
    .set({ settings: input })
    .where(eq(auth_user.id, ctx.user.id));

  return input;
};
