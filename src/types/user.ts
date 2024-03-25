import { ZColorValue } from "@t/trackable";
import { z } from "zod";

const email = z.string().email("Email is invalid");

export const ZRegister = z.object({
  email,
  password: z.string().min(6).max(255),
  username: z.string().min(1),
  role: z.string().optional(),
});

export type IRegister = z.infer<typeof ZRegister>;

export const ZLogin = z.object({
  email,
  password: z.string(),
});

export type ILogin = z.infer<typeof ZLogin>;

export const ZUserSettings = z.object({
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
