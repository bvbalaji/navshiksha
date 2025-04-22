import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function verifyCredentials(email: string, password: string) {
  console.log(`Verifying credentials for email: ${email}`)

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

    // Log the hash format for debugging
    console.log(`Password hash format: ${user.hashed_password.substring(0, 10)}...`)

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.hashed_password)
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

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function createUser(data: {
  email: string
  password: string
  name?: string
  role?: string
}) {
  const { email, password, name = "New User", role = "STUDENT" } = data

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash the password
  const hashedPassword = await hashPassword(password)

  // Create the user
  return prisma.user.create({
    data: {
      name,
      email,
      hashed_password: hashedPassword,
      role,
      created_at: new Date(),
      updated_at: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  })
}
