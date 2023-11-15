"use server";

import type { IUserSettings } from "@t/user";
import { RSAGetUserId, RSAGetUserIdAndRedirect } from "src/app/api/helpers";
import {
  GetUserSettings,
  UpdateUserSettings,
} from "src/app/api/user/settings/apiFunctions";

export const RSAGetUserSettings = async () => {
  const userId = await RSAGetUserId();
  if (userId === null) return {};
  const result = await GetUserSettings({ userId });
  return result;
};

export const RSAUpdateUserSettings = async (data: IUserSettings) => {
  const userId = await RSAGetUserIdAndRedirect();
  const result = await UpdateUserSettings({ userId, data });
  return result;
};
