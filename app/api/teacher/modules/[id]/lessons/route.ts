import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { title, content, contentType, estimatedDuration } = body

    if (!title || !content || !contentType) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: true,
        lessons: {
          orderBy: {
            sequenceOrder: "desc",
          },
          take: 1,
        },
      },
    })

    if (!module) {
      return new NextResponse("Module not found", { status: 404 })
    }

    if (module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Calculate the next sequence order
    const nextSequenceOrder = module.lessons.length > 0 ? module.lessons[0].sequenceOrder + 1 : 1

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        contentType,
        estimatedDuration,
        moduleId: params.id,
        sequenceOrder: nextSequenceOrder,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("[LESSONS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
