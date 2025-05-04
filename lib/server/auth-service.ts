"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import { createUser, getUserByEmail, updateUserPassword, validateResetToken } from "./auth-utils"
import { UserRole } from "@prisma/client"

/**
 * Get the current session on the server
 */
export async function getSession() {
  return await getServerSession(authOptions)
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await getSession()

  if (!session?.user?.email) {
    return null
  }

  const user = await getUserByEmail(session.user.email)
  return user
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole) {
  const session = await getSession()
  return session?.user?.role === role
}

/**
 * Register a new user
 */
export async function registerUser(name: string, email: string, password: string, role: UserRole = UserRole.STUDENT) {
  // Check if user already exists
  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  return await createUser(name, email, password, role)
}

/**
 * Reset user password using a token
 */
export async function resetPassword(token: string, newPassword: string) {
  const userId = await validateResetToken(token)

  if (!userId) {
    throw new Error("Invalid or expired token")
  }

  return await updateUserPassword(userId, newPassword)
}
