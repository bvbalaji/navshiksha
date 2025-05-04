import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getCourseById } from "@/lib/teacher/course-service"
import { CourseHeader } from "@/components/teacher/courses/course-header"
import { CourseContent } from "@/components/teacher/courses/course-content"
import { CourseModulesSkeleton } from "@/components/teacher/courses/course-modules-skeleton"

export const metadata = {
  title: "Course Details | Teacher Dashboard",
  description: "View and manage course details, modules, and lessons",
}

export default async function CourseDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const course = await getCourseById(params.id)

  if (!course) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <CourseHeader course={course} />

      <Suspense fallback={<CourseModulesSkeleton />}>
        <CourseContent courseId={params.id} />
      </Suspense>
    </div>
  )
}
