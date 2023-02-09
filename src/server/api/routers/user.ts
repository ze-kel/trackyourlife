// TODO
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { publicProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { ZUserSettings } from "@t/user";
const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, password, email } = input;

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { name, passwordHash, email },
      });

      const returnedUser = {
        name: user.name,
        email: user.email,
        id: user.id,
        image: user.image,
        settings: {},
      };

      return returnedUser;
    }),
  getUserSettings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) return {};

    return ZUserSettings.parse(user.settings);
  }),
  updateUserSettings: protectedProcedure
    .input(ZUserSettings)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new Error("Cant find user with provided ID to access settings");
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          settings: input,
        },
      });

      return input;
    }),
});
