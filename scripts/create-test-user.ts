import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

// This script creates a test user for development purposes

async function main() {
  console.log("Creating test user...")

  const prisma = new PrismaClient()

  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "student@navshiksha.com" },
    })

    if (existingUser) {
      console.log("Test user already exists.")
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        name: "Student User",
        email: "student@navshiksha.com",
        hashed_password: hashedPassword,
        role: "STUDENT",
        bio: "Test student account",
        created_at: new Date(),
        updated_at: new Date(),
      },
    })

    console.log("Test user created successfully:", user.email)
  } catch (error) {
    console.error("Error creating test user:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
