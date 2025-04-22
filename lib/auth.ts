import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get the current session on the server
export async function getSession() {
  return await getServerSession()
}

// Get the current user on the server
export async function getCurrentUser() {
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
}

// Protect a server component or server action
export async function requireAuth() {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login")
  }

  return session
}

// Require a specific role
export async function requireRole(allowedRoles: string[]) {
  const session = await getSession()

  if (!session?.user) {
    redirect("/login")
  }

  if (!allowedRoles.includes(session.user.role as string)) {
    redirect("/dashboard")
  }

  return session
}
