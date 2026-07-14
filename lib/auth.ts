import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            accessToken: account.access_token,
            refreshToken: account.refresh_token ?? undefined,
            tokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : undefined,
          },
          create: {
            email: user.email,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            tokenExpiry: account.expires_at
              ? new Date(account.expires_at * 1000)
              : undefined,
          },
        });
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
};