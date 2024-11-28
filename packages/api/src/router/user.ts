import type { TRPCRouterRecord } from "@trpc/server";

import { eq } from "@tyl/db";
import { auth_user } from "@tyl/db/schema";
import { UserSettingsFallback, ZUserSettings } from "@tyl/validators/user";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  getMe: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.auth_user.findFirst({
      where: eq(auth_user.id, ctx.user.id),
    });

    if (!user) return UserSettingsFallback;
    const parsed = ZUserSettings.safeParse(user.settings);
    if (!parsed.success) {
      return UserSettingsFallback;
    }
    return parsed.data;
  }),

  updateUserSettings: protectedProcedure
    .input(ZUserSettings)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(auth_user)
        .set({ settings: input })
        .where(eq(auth_user.id, ctx.user.id));

      return input;
    }),
} satisfies TRPCRouterRecord;
