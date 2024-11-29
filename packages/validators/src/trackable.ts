import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { ZTrackableDbInsert, ZTrackableDbSelect } from "@tyl/db/schema";

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
  startDate: z.string().datetime().optional(),
};

export const ZTrackableSettingsBase = z.object(basics);

export const ZTrackableSettingsBoolean = z.object({
  ...basics,
  inactiveColor: ZColorValue.optional(),
  activeColor: ZColorValue.optional(),
});

export const ZColorCodingValue = z.object({
  point: z.number(),
  color: ZColorValue,
  // used to key inputs when editing, can be changed voluntarily
  id: z.string().uuid().default(uuidv4),
});

export type IColorCodingValue = z.infer<typeof ZColorCodingValue>;

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
  colorCoding: z.array(ZColorCodingValue).optional(),
});

export const ZTrackableSettingsRange = z.object({
  ...basics,
  labels: z
    .array(
      z.object({
        internalKey: z.string().min(1),
        emoji: z.string().optional(),
        color: ZColorValue.optional(),
        // used to key inputs when editing, can be changed voluntarily
        id: z.string().uuid().default(uuidv4),
      }),
    )
    .optional(),
  isCycle: z.boolean().optional(),
  cycleToEmpty: z.boolean().optional(),
});

const typeSettingsUnion = z.discriminatedUnion("type", [
  z.object({ type: z.literal("boolean"), settings: ZTrackableSettingsBoolean }),
  z.object({ type: z.literal("number"), settings: ZTrackableSettingsNumber }),
  z.object({ type: z.literal("range"), settings: ZTrackableSettingsRange }),
]);

export const ZTrackableSettings = typeSettingsUnion.transform(
  (v) => v.settings,
);

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

export const zTrackableDataMonth = z.record(z.coerce.number(), z.string());
export const zTrackableDataYear = z.record(
  z.coerce.number(),
  zTrackableDataMonth,
);
export const zTrackableData = z.record(z.coerce.number(), zTrackableDataYear);

export type ITrackableDataMonth = z.infer<typeof zTrackableDataMonth>;
export type ITrackableDataYear = z.infer<typeof zTrackableDataYear>;
export type ITrackableData = z.infer<typeof zTrackableData>;

export const ZTrackableFromDb = ZTrackableDbSelect.and(typeSettingsUnion);
export const ZTrackableWithData = ZTrackableFromDb.and(
  z.object({
    data: zTrackableData,
  }),
);
export const ZTrackableToCreate = ZTrackableDbInsert.and(typeSettingsUnion);

export type ITrackableWithoutData = z.infer<typeof ZTrackableFromDb>;
export type ITrackable = z.infer<typeof ZTrackableWithData>;
export type ITrackableToCreate = z.infer<typeof ZTrackableToCreate>;
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
