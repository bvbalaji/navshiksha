import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

// Get the current session on the server
export async function getSession() {
  return await getServerSession(authOptions)
}

// Check if the user is authenticated on the server
export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

// Protect a server component or route
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }
  return session
}

// Require a specific role
export async function requireRole(allowedRoles: string[]) {
  const session = await getSession()

  if (!session) {
    redirect("/login?callbackUrl=/dashboard")
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect("/dashboard")
  }

  return session
}
