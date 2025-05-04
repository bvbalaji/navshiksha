import { Skeleton } from "@/components/ui/skeleton"
import { CourseModulesSkeleton } from "@/components/teacher/courses/course-modules-skeleton"

export default function CourseDetailsLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-1 h-4 w-48" />
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <CourseModulesSkeleton />
    </div>
  )
}
