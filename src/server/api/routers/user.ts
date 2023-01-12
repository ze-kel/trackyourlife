// TODO
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { publicProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const userRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    const res = await prisma.user.findMany();
    return res;
  }),
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
      };

      return returnedUser;
    }),
});
