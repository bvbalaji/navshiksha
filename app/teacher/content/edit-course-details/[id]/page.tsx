import { PrismaClient } from "@prisma/client"
import { CourseForm } from "@/components/teacher/content/course-form"
import { requireRole } from "@/lib/auth/auth"
import { notFound } from "next/navigation"

const prisma = new PrismaClient()

async function getSubjects() {
  return prisma.subject.findMany({
    orderBy: { name: "asc" },
  })
}

async function getCourse(id: string, userId: string) {
  const course = await prisma.course.findUnique({
    where: { id, creator_id: userId },
  })

  if (!course) {
    notFound()
  }

  return course
}

export default async function EditCourseDetailsPage({ params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const [subjects, course] = await Promise.all([getSubjects(), getCourse(params.id, session.user.id)])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Course Details</h1>
      <CourseForm subjects={subjects} course={course} userId={session.user.id} />
    </div>
  )
}
