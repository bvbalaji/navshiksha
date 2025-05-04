import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth/auth.config"

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
