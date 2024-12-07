import { z } from "zod";

export const zImport = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("number"),
    data: z.record(z.string().date(), z.number()),
  }),
  z.object({
    type: z.literal("boolean"),
    data: z.record(z.string().date(), z.boolean()),
  }),
  z.object({
    type: z.literal("range"),
    data: z.record(z.string().date(), z.string()),
  }),
]);

export type TImport = z.infer<typeof zImport>;

export const parseImport = async (
  jsonContent: string,
): Promise<{ error?: string; data?: TImport }> => {
  try {
    const content = JSON.parse(jsonContent) as unknown;

    const parsed = await zImport.safeParseAsync(content);

    if (!parsed.success) {
      return { error: parsed.error.message };
    }

    return { data: parsed.data };
  } catch (e) {
    return { error: (e as Error).message };
  }
};

export const zActionOnConflict = z.enum(["skip", "overwrite"]);

export type TActionOnConflict = z.infer<typeof zActionOnConflict>;

export const ActionsOnConflict: { value: TActionOnConflict; label: string }[] =
  [
    { value: "skip", label: "Skip" },
    { value: "overwrite", label: "Overwrite" },
  ];

export const zUpdateTrackableEntries = z.object({
  id: z.string(),
  actionOnConflict: zActionOnConflict,
  data: zImport,
});

export type TUpdateTrackableEntries = z.infer<typeof zUpdateTrackableEntries>;
