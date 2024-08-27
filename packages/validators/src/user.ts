import { z } from "zod";

import { ZColorValue } from "./trackable";

const email = z.string().email("Email is invalid");

export const ZRegister = z.object({
  email,
  password: z
    .string()
    .min(6, "Password must be at least 6 symbols")
    .max(50, "Password can be at most 50 symbols"),
  username: z.string().min(1, "Username must contain at least 1 symbol"),
  role: z.string().optional(),
});

export type IRegister = z.infer<typeof ZRegister>;

export const ZLogin = z.object({
  email,
  password: z.string(),
});

export type ILogin = z.infer<typeof ZLogin>;

export const ZUserSettings = z.object({
  favorites: z.array(z.string()).default([]),
  colorPresets: z.array(ZColorValue).optional(),
  timezone: z
    .object({
      name: z.string(),
      label: z.string(),
      tzCode: z.string(),
      utc: z.string(),
    })
    .optional(),
});

export type IUserSettings = z.infer<typeof ZUserSettings>;

export const UserSettingsFallback: NonNullable<IUserSettings> = {
  favorites: [],
};
