import { notFound } from "next/navigation"
import { CourseForm } from "@/components/teacher/courses/course-form"
import { getCourseById } from "@/lib/teacher/course-service"
import { getSubjects } from "@/lib/teacher/subject-service"

export const metadata = {
  title: "Edit Course | Teacher Dashboard",
  description: "Edit your course details",
}

export default async function EditCoursePage({
  params,
}: {
  params: { id: string }
}) {
  const [course, subjects] = await Promise.all([getCourseById(params.id), getSubjects()])

  if (!course) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
        <p className="text-muted-foreground">Update your course details and content</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CourseForm course={course} subjects={subjects} />
      </div>
    </div>
  )
}
