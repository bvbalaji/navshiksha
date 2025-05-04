import { getCourseWithModules } from "@/lib/teacher/course-service"
import { ModulesList } from "@/components/teacher/courses/modules-list"
import { EmptyPlaceholder } from "@/components/teacher/empty-placeholder"
import { CreateModuleButton } from "@/components/teacher/courses/create-module-button"

export async function CourseContent({ courseId }: { courseId: string }) {
  const course = await getCourseWithModules(courseId)

  if (!course) {
    return <div>Course not found</div>
  }

  if (course.modules.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <EmptyPlaceholder
            title="No modules yet"
            description="Get started by creating your first module for this course."
            icon="BookOpen"
          >
            <CreateModuleButton courseId={courseId} />
          </EmptyPlaceholder>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Course Content</h2>
          <p className="text-sm text-muted-foreground">Manage modules and lessons for this course</p>
        </div>
        <CreateModuleButton courseId={courseId} />
      </div>

      <ModulesList courseId={courseId} modules={course.modules} />
    </div>
  )
}
