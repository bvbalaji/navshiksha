import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 })
    }

    if (lesson.module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("[LESSON_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
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

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 })
    }

    if (lesson.module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        content,
        contentType,
        estimatedDuration,
      },
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error("[LESSON_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: params.id,
      },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    })

    if (!lesson) {
      return new NextResponse("Lesson not found", { status: 404 })
    }

    if (lesson.module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.lesson.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[LESSON_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
