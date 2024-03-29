"use server";

import type { IUserSettings } from "@t/user";
import { RSAGetUserIdAndRedirect, checkForSession } from "src/app/api/helpers";
import {
  GetUserSettings,
  UpdateUserSettings,
} from "src/app/api/user/settings/apiFunctions";

export const RSAGetUserSettings = async () => {
  const { userId } = await checkForSession();
  if (!userId) return {};
  const result = await GetUserSettings({ userId });
  return result;
};

export const RSAUpdateUserSettings = async (data: IUserSettings) => {
  const userId = await RSAGetUserIdAndRedirect();
  const result = await UpdateUserSettings({ userId, data });
  return result;
};
