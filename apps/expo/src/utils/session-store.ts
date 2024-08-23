import * as SecureStore from "expo-secure-store";
import { z } from "zod";

const key = "user_data";
const zUserData = z.object({
  token: z.string(),
  host: z.string(),
  userId: z.string(),
});

export type IUserData = z.infer<typeof zUserData>;

export const getUserData = () => {
  try {
    const r = SecureStore.getItem(key);

    if (!r) return;
    return zUserData.parse(JSON.parse(r));
  } catch {
    return;
  }
};

export const setUserData = async (data: IUserData) => {
  await SecureStore.setItemAsync(key, JSON.stringify(data));
};

export const clearUserData = async () => {
  await SecureStore.deleteItemAsync(key);
};
