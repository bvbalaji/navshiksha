import { CourseForm } from "@/components/teacher/courses/course-form"
import { getSubjects } from "@/lib/teacher/subject-service"

export const metadata = {
  title: "Create Course | Teacher Dashboard",
  description: "Create a new course for your students",
}

export default async function CreateCoursePage() {
  const subjects = await getSubjects()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-muted-foreground">Create a new course and add modules and lessons</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <CourseForm subjects={subjects} />
      </div>
    </div>
  )
}
