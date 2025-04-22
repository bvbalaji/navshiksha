import { NextResponse } from "next/server"
import { createUser } from "@/lib/auth-service"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    try {
      const user = await createUser({
        name,
        email,
        password,
        role,
      })

      return NextResponse.json({
        success: true,
        user,
      })
    } catch (error) {
      if ((error as Error).message === "User already exists") {
        return NextResponse.json({ error: "User already exists" }, { status: 409 })
      }
      throw error
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}
