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

    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
        subject: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: {
            sequenceOrder: "asc",
          },
        },
      },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    if (course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error("[COURSE_GET]", error)
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
    const { title, description, subjectId, level, estimatedDuration, thumbnailUrl } = body

    if (!title || !subjectId || !level) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    if (course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        subjectId,
        level,
        estimatedDuration,
        thumbnailUrl,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("[COURSE_PUT]", error)
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

    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    if (course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.course.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[COURSE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
