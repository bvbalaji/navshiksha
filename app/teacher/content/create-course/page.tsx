import { PrismaClient } from "@prisma/client"
import { CourseForm } from "@/components/teacher/content/course-form"
import { requireRole } from "@/lib/auth/auth"

const prisma = new PrismaClient()

async function getSubjects() {
  return prisma.subject.findMany({
    orderBy: { name: "asc" },
  })
}

export default async function CreateCoursePage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const subjects = await getSubjects()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Course</h1>
      <CourseForm subjects={subjects} userId={session.user.id} />
    </div>
  )
}
