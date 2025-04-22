import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists", userId: existingUser.id }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        name: name || "Test User",
        hashed_password: hashedPassword,
        role: role || "STUDENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })

    return NextResponse.json({
      message: "Test user created successfully",
      user,
    })
  } catch (error) {
    console.error("Error creating test user:", error)
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 })
  }
}
