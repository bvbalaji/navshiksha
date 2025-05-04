import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config" 
import { prisma } from "@/lib/prisma"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: true,
      },
    })

    if (!module) {
      return new NextResponse("Module not found", { status: 404 })
    }

    if (module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const updatedModule = await prisma.module.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
      },
    })

    return NextResponse.json(updatedModule)
  } catch (error) {
    console.error("[MODULE_PUT]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const module = await prisma.module.findUnique({
      where: {
        id: params.id,
      },
      include: {
        course: true,
      },
    })

    if (!module) {
      return new NextResponse("Module not found", { status: 404 })
    }

    if (module.course.creatorId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.module.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[MODULE_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
