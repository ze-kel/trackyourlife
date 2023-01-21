import { z } from "zod";

// Settings only affect visual representation and are different with a lot of optional values.
// So for ease of use we store them in DB as JSON and don't verify on api.
// Verification runs on client and if we detect that something's wrong we ask user to fix it before showing anything.

const basics = {
  name: z.string().optional(),
  startDate: z.date().optional(),
};

export const ZTrackableSettingsBoolean = z.object({
  ...basics,
});

export const ZTrackableSettingsNumber = z.object({
  ...basics,
  incrementBy: z.number().min(1).optional(),
  limits: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
});

export const ZTrackableSettingsRange = z.object({
  ...basics,
});

export type IBooleanSettings = z.infer<typeof ZTrackableSettingsBoolean>;

export type INumberSettings = z.infer<typeof ZTrackableSettingsNumber>;
export type IRangeSettings = z.infer<typeof ZTrackableSettingsRange>;

export type ITrackableSettings =
  | IBooleanSettings
  | INumberSettings
  | IRangeSettings;

const verifySettings = () => {
  console.log("hello");
};

export { verifySettings };
