import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { verifyUserCredentials } from "@/lib/server/auth-utils"
import { prisma } from "@/lib/prisma"

import { isProduction } from "./auth-utils"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Use our authentication service to verify credentials
          const user = await verifyUserCredentials(credentials.email, credentials.password)
          return user
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  cookies: {
    sessionToken: {
      name: isProduction() ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction(),
      },
    },
    callbackUrl: {
      name: isProduction() ? `__Secure-next-auth.callback-url` : `next-auth.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: isProduction(),
      },
    },
    csrfToken: {
      name: isProduction() ? `__Host-next-auth.csrf-token` : `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction(),
      },
    }
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Handle relative URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Allow redirects to the same site
      else if (new URL(url).origin === baseUrl) {
        return url
      }
      // Default to base URL for safety
      return baseUrl
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/api/auth/signout",
  },
  debug: process.env.NODE_ENV === "development",
}
