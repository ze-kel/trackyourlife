import { z } from "zod";

//
// Settings
//
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
  startDate: z.coerce.date().optional(),
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
  colorCoding: z
    .array(
      z.object({
        from: z.number(),
        to: z.number(),
      })
    )
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

//
// Trackable
//
export type IFullData = Record<string, string>;

export type ITrackableUnsaved =
  | {
      type: "boolean";
      settings: IBooleanSettings;
      data: Record<string, string>;
    }
  | {
      type: "number";
      settings: INumberSettings;
      data: Record<string, string>;
    }
  | {
      type: "range";
      settings: IRangeSettings;
      data: Record<string, string>;
    };

export type ITrackable = ITrackableUnsaved & { id: string };

//
// Update
//
export const ZTrackableUpdate = z.object({
  id: z.string(),
  year: z.number(),
  month: z.number(),
  day: z.number(),
  value: z.string(),
});

export type ITrackableUpdate = z.infer<typeof ZTrackableUpdate>;
