import Link from "next/link"
import { getCourses } from "@/lib/teacher/course-service"
import { CourseCard } from "@/components/teacher/courses/course-card"
import { EmptyPlaceholder } from "@/components/teacher/empty-placeholder"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function CoursesList({
  query,
  subjectId,
  level,
}: {
  query?: string
  subjectId?: string
  level?: string
}) {
  const courses = await getCourses({ query, subjectId, level })

  if (courses.length === 0) {
    return (
      <div className="p-6 pt-0">
        <EmptyPlaceholder
          title="No courses found"
          description="You haven't created any courses yet or none match your filters."
          icon="BookOpen"
        >
          <Button asChild>
            <Link href="/teacher/courses/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </EmptyPlaceholder>
      </div>
    )
  }

  return (
    <div className="p-6 pt-0">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
