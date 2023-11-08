import { z } from "zod";

//
// Settings
//

export const color = z.object({
  hue: z.number().min(0).max(360).default(0),
  saturation: z.number().min(0).max(100).default(0),
  lightness: z.number().min(0).max(100).default(0),
});

export type IColor = z.infer<typeof color>;

export const colorValue = z.object({
  lightMode: color,
  darkMode: color,
});

export type IColorValue = z.infer<typeof colorValue>;

const basics = {
  name: z.string().default("Unnamed Trackable").optional(),
  startDate: z.string().datetime().optional(),
  favorite: z.boolean().optional(),
};

export const ZTrackableSettingsBase = z.object(basics);

export const ZTrackableSettingsBoolean = z.object({
  ...basics,
  inactiveColor: colorValue.optional(),
  activeColor: colorValue.optional(),
});

export const ZTrackableSettingsNumber = z.object({
  ...basics,
  incrementBy: z.number().min(1).optional(),
  limits: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      showProgress: z.boolean().optional(),
    })
    .optional(),
  colorCodingEnabled: z.boolean(),
  colorCoding: z
    .array(
      z.object({
        from: z.number(),
        color: colorValue,
        // used to key inputs when editing, can be changed voluntarily
        id: z.string().optional(),
      }),
    )
    .optional(),
});

export const ZTrackableSettingsRange = z.object({
  ...basics,
  labels: z
    .array(
      z.object({
        internalKey: z.string().min(1),
        emoji: z.string().emoji(),
        // used to key inputs when editing, can be changed voluntarily
        id: z.string().optional(),
      }),
    )
    .optional(),
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
