import { PrismaClient } from "@prisma/client"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

const prisma = new PrismaClient()

// GET /api/teacher/content/courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const subjectId = searchParams.get("subjectId") || undefined
    const level = searchParams.get("level") || undefined
    const published = searchParams.get("published")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      creator_id: userId,
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (subjectId) {
      where.subject_id = subjectId
    }

    if (level) {
      where.level = level
    }

    if (published !== null && published !== undefined) {
      where.is_published = published === "true"
    }

    // Get courses with count
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        orderBy: { updated_at: "desc" },
        skip,
        take: limit,
        include: {
          subject: true,
          _count: {
            select: { modules: true, enrollments: true },
          },
        },
      }),
      prisma.course.count({ where }),
    ])

    return NextResponse.json({
      courses,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit,
      },
    })
  } catch (error) {
    console.error("Error fetching courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}
