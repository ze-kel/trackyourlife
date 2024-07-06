import { z } from "zod";

const month = z.number().min(0).max(11);
const year = z.number();

export const ZGETLimits = z
  .union([
    z.object({ type: z.literal("year"), year: z.number() }),
    z.object({
      type: z.literal("month"),
      year: z.number(),
      month: z.number().min(0).max(11),
    }),
    z.object({ type: z.literal("last"), days: z.number().min(1).max(31) }),
    z.object({
      type: z.literal("range"),
      from: z.object({
        year,
        month,
      }),
      to: z.object({
        year,
        month,
      }),
    }),
  ])
  .optional();

export type TGETLimits = z.infer<typeof ZGETLimits>;
