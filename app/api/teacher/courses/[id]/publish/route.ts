import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { isPublished } = body

    if (isPublished === undefined) {
      return new NextResponse("Missing isPublished field", { status: 400 })
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
        isPublished,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error("[COURSE_PUBLISH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
