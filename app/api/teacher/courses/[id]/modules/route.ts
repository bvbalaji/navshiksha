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
    const { title, description } = body

    if (!title) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const course = await prisma.course.findUnique({
      where: {
        id: params.id,
      },
      include: {
        modules: {
          orderBy: {
            sequenceOrder: "desc",
          },
          take: 1,
        },
      },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    if (course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Calculate the next sequence order
    const nextSequenceOrder = course.modules.length > 0 ? course.modules[0].sequenceOrder + 1 : 1

    const module = await prisma.module.create({
      data: {
        title,
        description,
        courseId: params.id,
        sequenceOrder: nextSequenceOrder,
      },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error("[MODULES_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
