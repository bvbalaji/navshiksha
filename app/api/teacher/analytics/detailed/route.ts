import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config" 

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
    const period = searchParams.get("period") || "30d" // 7d, 30d, 3m, 6m, 1y, all
    const type = searchParams.get("type") || "engagement" // engagement, performance, content

    // Calculate date range based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "3m":
        startDate.setMonth(now.getMonth() - 3)
        break
      case "6m":
        startDate.setMonth(now.getMonth() - 6)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case "all":
        startDate.setFullYear(2000) // Effectively all data
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    let data = {}

    // Fetch different data based on the requested type
    if (type === "engagement") {
      // Get student engagement data over time
      const engagementData = await prisma.$queryRaw`
        SELECT
          DATE_TRUNC('day', p.updated_at) as date,
          COUNT(DISTINCT p.user_id) as active_students,
          COUNT(CASE WHEN p.status = 'COMPLETED' THEN 1 END) as completed_lessons,
          COUNT(CASE WHEN p.status = 'IN_PROGRESS' THEN 1 END) as in_progress_lessons
        FROM "progress" p
        JOIN "lessons" l ON p.lesson_id = l.id
        JOIN "modules" m ON l.module_id = m.id
        JOIN "courses" c ON m.course_id = c.id
        WHERE c.creator_id = ${teacherId}::uuid
        AND p.updated_at >= ${startDate}
        GROUP BY DATE_TRUNC('day', p.updated_at)
        ORDER BY date ASC
      `

      data = { engagementData }
    } else if (type === "performance") {
      // Get quiz performance data
      const quizPerformance = await prisma.$queryRaw`
        SELECT 
          q.title as quiz_name,
          q.difficulty,
          AVG(qa.score) as average_score,
          COUNT(DISTINCT qa.user_id) as total_attempts,
          COUNT(DISTINCT qa.user_id) * 100.0 / (
            SELECT COUNT(DISTINCT cs.student_id) 
            FROM "class_students" cs
            JOIN "classes" c ON cs.class_id = c.id
            WHERE c.teacher_id = ${teacherId}::uuid
          ) as completion_rate
        FROM "quiz_attempts" qa
        JOIN "quizzes" q ON qa.quiz_id = q.id
        JOIN "lessons" l ON q.lesson_id = l.id
        JOIN "modules" m ON l.module_id = m.id
        JOIN "courses" c ON m.course_id = c.id
        WHERE c.creator_id = ${teacherId}::uuid
        AND qa.created_at >= ${startDate}
        GROUP BY q.id, q.title, q.difficulty
        ORDER BY average_score DESC
      `

      data = { quizPerformance }
    } else if (type === "content") {
      // Get content effectiveness data
      const contentEffectiveness = await prisma.$queryRaw`
        SELECT 
          l.content_type,
          COUNT(DISTINCT p.user_id) as unique_views,
          AVG(EXTRACT(EPOCH FROM (p.updated_at - p.created_at))/60) as avg_time_spent_minutes,
          COUNT(CASE WHEN p.status = 'COMPLETED' THEN 1 END) * 100.0 / COUNT(*) as completion_rate
        FROM "progress" p
        JOIN "lessons" l ON p.lesson_id = l.id
        JOIN "modules" m ON l.module_id = m.id
        JOIN "courses" c ON m.course_id = c.id
        WHERE c.creator_id = ${teacherId}::uuid
        AND p.updated_at >= ${startDate}
        GROUP BY l.content_type
        ORDER BY unique_views DESC
      `

      data = { contentEffectiveness }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error getting detailed analytics:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
