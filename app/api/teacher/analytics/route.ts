import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id

    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const period = searchParams.get("period") || "week" // week, month, year

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

    // Get student engagement data
    const studentEngagement = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', p.updated_at) as date,
        COUNT(DISTINCT p.user_id) as active_students
      FROM "progress" p
      JOIN "lessons" l ON p.lesson_id = l.id
      JOIN "modules" m ON l.module_id = m.id
      JOIN "courses" c ON m.course_id = c.id
      WHERE c.creator_id = ${teacherId}::uuid
      AND p.updated_at >= ${startDate}
    `

    return NextResponse.json(studentEngagement)
  } catch (error) {
    console.error("Error getting teacher analytics:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
