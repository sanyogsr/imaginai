import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./utils/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  // debug: true,
  callbacks: {
    async session({ token, session }) {
      session.user.id = token.sub as string;
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      try {
        await prisma.userCredit.create({
          data: {
            userId: user.id as string,
            credits: 2,
          },
        });
      } catch (error) {
        console.error("Error initializing the user credits : ", error);
      }
    },
  },
});
