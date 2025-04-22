import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("Test login attempt for:", email)

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        hashed_password: true,
        name: true,
        role: true,
      },
    })

    if (!user) {
      console.log("User not found")
      return NextResponse.json({ error: "User not found", success: false }, { status: 404 })
    }

    console.log("User found:", {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      has_password: !!user.hashed_password,
    })

    if (!user.hashed_password) {
      console.log("User has no password")
      return NextResponse.json({ error: "User has no password set", success: false }, { status: 400 })
    }

    // Test password comparison
    try {
      const passwordMatch = await bcrypt.compare(password, user.hashed_password)
      console.log("Password match:", passwordMatch)

      return NextResponse.json({
        success: passwordMatch,
        message: passwordMatch ? "Login would succeed" : "Password doesn't match",
      })
    } catch (error) {
      console.error("Password comparison error:", error)
      return NextResponse.json(
        {
          error: "Error comparing passwords",
          details: (error as Error).message,
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Test login error:", error)
    return NextResponse.json({ error: "Server error", success: false }, { status: 500 })
  }
}
