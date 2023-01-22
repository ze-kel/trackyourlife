import { z } from "zod";

export const colorOptions = z.enum([
  "neutral",
  "green",
  "lime",
  "red",
  "blue",
  "purple",
  "pink",
  "orange",
]);

export type IColorOptions = z.infer<typeof colorOptions>;

const basics = {
  name: z.string().optional(),
  startDate: z.date().optional(),
};

export const ZTrackableSettingsBoolean = z.object({
  ...basics,
  inactiveColor: colorOptions.optional(),
  activeColor: colorOptions.optional(),
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
