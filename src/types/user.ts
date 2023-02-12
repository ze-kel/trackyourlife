import { z } from "zod";

export const ZUserSettings = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
});

export type IUserSettings = z.infer<typeof ZUserSettings>;
