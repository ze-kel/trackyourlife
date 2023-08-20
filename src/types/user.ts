import { z } from "zod";

const email = z.string().email("Email is invalid");


export const ZRegister = z.object({
  email,
  password: z.string().min(6).max(255),
  username: z.string().min(1)
})

export type IRegister = z.infer<typeof ZRegister>;

export const ZLogin = z.object({
  email,
  password: z.string(),
})

export type ILogin = z.infer<typeof ZLogin>;

export const ZUserSettings = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export type IUserSettings = z.infer<typeof ZUserSettings>;
