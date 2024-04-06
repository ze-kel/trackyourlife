import { UserSettingsFallback, ZUserSettings } from "@t/user";
import { eq } from "drizzle-orm";
import { db } from "src/app/api/db";
import { ApiFunctionError } from "src/app/api/helpers";
import { auth_user } from "src/schema";

export const GetUserSettings = async ({ userId }: { userId: string }) => {
  const user = await db.query.auth_user.findFirst({
    where: eq(auth_user.id, userId),
  });

  if (!user) return UserSettingsFallback;

  const parsed = ZUserSettings.safeParse(user.settings);

  if (!parsed.success) {
    return UserSettingsFallback;
  }
  return parsed.data;
};

export const UpdateUserSettings = async ({
  data,
  userId,
}: {
  data: unknown;
  userId: string;
}) => {
  const input = ZUserSettings.safeParse(data);
  if (!input.success) {
    throw new ApiFunctionError(input.error.message, 400);
  }

  await db
    .update(auth_user)
    .set({ settings: input.data })
    .where(eq(auth_user.id, userId));

  return input.data;
};
