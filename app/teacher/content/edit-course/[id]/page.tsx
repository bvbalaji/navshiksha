import { PrismaClient } from "@prisma/client"
import { CourseEditor } from "@/components/teacher/content/course-editor"
import { requireRole } from "@/lib/auth/auth"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

async function getCourseWithModulesAndLessons(id: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id, creator_id: userId },
    include: {
      modules: {
        orderBy: { sequence_order: "asc" },
        include: {
          lessons: {
            orderBy: { sequence_order: "asc" },
          },
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return course
}

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const course = await getCourseWithModulesAndLessons(params.id, session.user.id)

  return (
    <div className="space-y-6">
      <CourseEditor course={course} />
    </div>
  )
}
