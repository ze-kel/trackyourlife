import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";

import { prisma } from "../../../server/db";
import { env } from "src/env/server.mjs";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = { id: user.id, email: user.email, name: user.name };
      }
      return token;
    },
    session: ({ token, session }) => {
      session.user = token.user as { id: string; email: string; name: string };

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;
        const compare = await bcrypt.compare(password, user.passwordHash);
        if (!compare) return null;
        const returnedUser = {
          name: user.name,
          email: user.email,
          id: user.id,
          image: user.image,
        };

        return returnedUser;
      },
    }),
  ],
};

export default NextAuth(authOptions);
