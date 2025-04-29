import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherId = session.user.id

    // Get URL parameters
    const { searchParams } = new URL(req.url)
    const classId = searchParams.get("classId")
    const search = searchParams.get("search")

    let students = []

    if (classId) {
      // Get students in a specific class
      students = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          ClassStudent: {
            some: {
              class_id: classId,
              class: {
                teacher_id: teacherId,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile_image_url: true,
          created_at: true,
        },
        orderBy: {
          name: "asc",
        },
      })
    } else {
      // Get all students in teacher's classes
      const whereClause: any = {
        role: "STUDENT",
        ClassStudent: {
          some: {
            class: {
              teacher_id: teacherId,
            },
          },
        },
      }

      // Add search filter if provided
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ]
      }

      students = await prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          profile_image_url: true,
          created_at: true,
        },
        orderBy: {
          name: "asc",
        },
      })
    }

    return NextResponse.json({ students })
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}
