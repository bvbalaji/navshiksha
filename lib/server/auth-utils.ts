import { hashPassword, verifyPassword } from '@/lib/crypto/simple-crypto';
import { PrismaClient } from "@prisma/client"
import { UserRole } from "@prisma/client"


const prisma = new PrismaClient()

/**
 * Server-side function to verify user credentials
 * This should only be called from server components or server actions
 */
export async function verifyUserCredentials(email: string, password: string) {
  console.log(`Verifying credentials for email: ${email} (server-side)`)

  if (!email || !password) {
    console.log("Missing email or password")
    return null
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("User not found")
      return null
    }

    if (!user.hashed_password) {
      console.log("User has no password set")
      return null
    }

    // Compare the provided password with the hashed password
    // const passwordMatch = await bcrypt.verifyPassword(password, user.hashed_password)
    const passwordMatch = await verifyPassword(password, user.hashed_password);
    console.log(`Password match: ${passwordMatch}`)

    if (!passwordMatch) {
      return null
    }

    // Return the user object without the password
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profile_image_url,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

/**
 * Server-side function to hashPassword a password
 * This should only be called from server components or server actions
 */
export async function hashUserPassword(password: string): Promise<string> {
  return bcrypt.hashPassword(password, 10)
}

/**
 * Server-side function to create a new user
 */
export async function createUser(name: string, email: string, password: string, role: UserRole = UserRole.STUDENT) {
  try {
    // const hashedPassword = await hashUserPassword(password)
    
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashed_password: hashedPassword,
        role,
      },
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

/**
 * Server-side function to get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profile_image_url,
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

/**
 * Server-side function to get user by ID
 */
export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profile_image_url,
    }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

/**
 * Server-side function to update user password
 */
export async function updateUserPassword(userId: string, newPassword: string) {
  try {
    // const hashedPassword = await hashUserPassword(newPassword)
    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { hashed_password: hashedPassword },
    })

    return true
  } catch (error) {
    console.error("Error updating password:", error)
    return false
  }
}

/**
 * Server-side function to validate reset token
 */
export async function validateResetToken(token: string) {
  // Implementation would depend on how you store reset tokens
  // This is a placeholder
  try {
    // Check if token exists and is valid
    // Return user ID if valid
    return null
  } catch (error) {
    console.error("Error validating reset token:", error)
    return null
  }
}
