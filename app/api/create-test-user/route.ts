import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/server/auth-utils"
import { UserRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "This endpoint is only available in development" }, { status: 403 })
    }

    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create the user with the specified role or default to STUDENT
    const userRole = (role as UserRole) || UserRole.STUDENT
    const user = await createUser(name, email, password, userRole)

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Test user creation error:", error)
    return NextResponse.json({ error: "Failed to create test user" }, { status: 500 })
  }
}
