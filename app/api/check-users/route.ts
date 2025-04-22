import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get a count of users
    const userCount = await prisma.user.count()

    // Get a sample of users (first 5)
    const users = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        // Don't include the password, even hashed
        hashed_password: false,
      },
    })

    return NextResponse.json({
      totalUsers: userCount,
      sampleUsers: users,
    })
  } catch (error) {
    console.error("Error checking users:", error)
    return NextResponse.json({ error: "Failed to check users" }, { status: 500 })
  }
}
