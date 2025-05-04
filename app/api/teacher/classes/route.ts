import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config" 

const prisma = new PrismaClient()

// Get all classes for a teacher
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id

    const classes = await prisma.class.findMany({
      where: {
        teacher_id: teacherId,
      },
      include: {
        subject: true,
        _count: {
          select: { students: true },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json({ classes })
  } catch (error) {
    console.error("Error fetching classes:", error)
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 })
  }
}

// Create a new class
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const { name, description, subjectId, startDate, endDate } = await req.json()

    if (!name || !subjectId || !startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        description,
        subject_id: subjectId,
        teacher_id: teacherId,
        start_date: new Date(startDate),
        end_date: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json({ class: newClass })
  } catch (error) {
    console.error("Error creating class:", error)
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 })
  }
}
