import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyCredentials } from "@/lib/auth-service"

const prisma = new PrismaClient()

// Get the current session on the server
export async function getSession() {
  try {
    return await getServerSession(authOptions)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

// Get the current user on the server
export async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profile_image_url: true,
        bio: true,
        created_at: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Protect a server component or server action
export async function requireAuth() {
  try {
    const session = await getSession()

    if (!session?.user) {
      redirect("/login")
    }

    return session
  } catch (error) {
    console.error("Auth error:", error)
    redirect("/login")
  }
}

// Require a specific role
export async function requireRole(allowedRoles: string[]) {
  try {
    const session = await getSession()

    if (!session?.user) {
      redirect("/login")
    }

    if (!allowedRoles.includes(session.user.role as string)) {
      redirect("/dashboard")
    }

    return session
  } catch (error) {
    console.error("Role check error:", error)
    redirect("/login")
  }
}

export const authOptions: NextAuthOptions = {
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
          const user = await verifyCredentials(credentials.email, credentials.password)
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
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
    signOut: "/",
  },
  // Trust the host header for production environments
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signOut({ token }) {
      // You can add custom logic here if needed when a user signs out
      console.log("User signed out:", token?.email)
    },
  },
}
