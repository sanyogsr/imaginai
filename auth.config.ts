import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const publicRoutes = [
  "/",
  "/pricing",
  "/tutorials",
  "/about-us",
  "/contact-us",
  "/terms-and-conditions",
  "/refund-policy",
  "/privacy-policy",
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/upgrade",
  "/dashboard/history",
  "/dashboard/payment",
  "/dashboard/payment/success",
  "/dashboard/payment/failure",
];
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
