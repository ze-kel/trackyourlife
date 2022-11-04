import { z } from "zod";

// Settings only affect visual representation and are different with a lot of optional values.
// So for ease of use we store them in DB as JSON and don't verify on api.
// Verification runs on client and if we detect that something's wrong we ask user to fix it before showing anything.

const basics = {
  name: z.string().optional(),
  startDate: z.date().optional(),
};

const boolean = z.object({
  ...basics,
  timesADay: z.number().min(1).max(5).optional(),
  everyNDays: z.boolean().optional(),
});

const number = z.object({
  ...basics,
  incrementBy: z.number().optional(),
  limits: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
});

export type IBooleanSettings = z.infer<typeof boolean>;

export type INumberSettings = z.infer<typeof number>;

const verifySettings = () => {
  console.log("hello");
};

export { verifySettings };
