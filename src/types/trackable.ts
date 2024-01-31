import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

//
// Settings
//

export const colorRGB = z.object({
  r: z.number().min(0).max(255).default(0),
  g: z.number().min(0).max(255).default(0),
  b: z.number().min(0).max(255).default(0),
});

export type IColorRGB = z.infer<typeof colorRGB>;

export const colorHSL = z.object({
  h: z.number().min(0).max(360).default(0),
  s: z.number().min(0).max(100).default(0),
  l: z.number().min(0).max(100).default(0),
});

export type IColorHSL = z.infer<typeof colorHSL>;

export const ZColorValue = z.object({
  lightMode: colorHSL,
  darkMode: colorHSL,
});

export type IColorValue = z.infer<typeof ZColorValue>;

const basics = {
  name: z.string().default("Unnamed Trackable").optional(),
  startDate: z.string().datetime().optional(),
  favorite: z.boolean().optional(),
};

export const ZTrackableSettingsBase = z.object(basics);

export const ZTrackableSettingsBoolean = z.object({
  ...basics,
  inactiveColor: ZColorValue.optional(),
  activeColor: ZColorValue.optional(),
});

export const ZTrackableSettingsNumber = z.object({
  ...basics,
  incrementBy: z.number().min(1).optional(),
  progressEnabled: z.boolean().optional(),
  progress: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
    })
    .optional(),
  colorCodingEnabled: z.boolean().optional(),
  colorCoding: z
    .array(
      z.object({
        point: z.number(),
        color: ZColorValue,
        // used to key inputs when editing, can be changed voluntarily
        id: z.string().uuid().default(uuidv4),
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
        id: z.string().uuid().default(uuidv4),
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
