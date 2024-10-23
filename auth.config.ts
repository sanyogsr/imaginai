import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const publicRoutes = ["/", "/pricing", "/resources", "/dashboard"];
const authRoutes = ["/login", "/register"];

export default {
  providers: [Google],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (publicRoutes.includes(pathname)) {
        return true;
      }

      if (authRoutes.includes(pathname)) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },

  
  },
  pages: {
    signIn: "/",
  },
} satisfies NextAuthConfig;
