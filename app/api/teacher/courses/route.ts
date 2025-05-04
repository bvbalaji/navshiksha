import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const subjectId = searchParams.get("subjectId")
    const level = searchParams.get("level")

    const courses = await prisma.course.findMany({
      where: {
        creatorId: session.user.id,
        ...(query && {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(subjectId && { subjectId }),
        ...(level && { level: level as any }),
      },
      include: {
        subject: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("[COURSES_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, description, subjectId, level, estimatedDuration, thumbnailUrl } = body

    if (!title || !subjectId || !level) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        subjectId,
        level,
        estimatedDuration,
        thumbnailUrl,
        creatorId: session.user.id,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("[COURSES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
