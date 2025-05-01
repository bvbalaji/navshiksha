import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const { studentId, content } = await req.json()

    if (!studentId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if this teacher has access to this student
    const hasAccess = await prisma.classStudent.findFirst({
      where: {
        student_id: studentId,
        class: {
          teacher_id: teacherId,
        },
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "You don't have access to this student" }, { status: 403 })
    }

    // Create the note
    const note = await prisma.teacherNote.create({
      data: {
        teacher_id: teacherId,
        student_id: studentId,
        content,
      },
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id
    const { searchParams } = new URL(req.url)
    const studentId = searchParams.get("studentId")

    if (!studentId) {
      return NextResponse.json({ error: "Missing studentId parameter" }, { status: 400 })
    }

    // Check if this teacher has access to this student
    const hasAccess = await prisma.classStudent.findFirst({
      where: {
        student_id: studentId,
        class: {
          teacher_id: teacherId,
        },
      },
    })

    if (!hasAccess && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have access to this student" }, { status: 403 })
    }

    // Get the notes
    const notes = await prisma.teacherNote.findMany({
      where: {
        teacher_id: teacherId,
        student_id: studentId,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error("Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}
