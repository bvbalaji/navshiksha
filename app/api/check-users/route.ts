import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "This endpoint is only available in development" }, { status: 403 })
    }

    const userCount = await prisma.user.count()

    return NextResponse.json(
      {
        userCount,
        message: userCount > 0 ? `Found ${userCount} users in the database` : "No users found in the database",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error checking users:", error)
    return NextResponse.json({ error: "Failed to check users" }, { status: 500 })
  }
}
