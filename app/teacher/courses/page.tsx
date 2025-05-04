import { Suspense } from "react"
import { CoursesList } from "@/components/teacher/courses/courses-list"
import { CoursesHeader } from "@/components/teacher/courses/courses-header"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Courses Management | Teacher Dashboard",
  description: "Manage your courses, modules, and lessons",
}

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <CoursesHeader />

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Your Courses</h2>
          <p className="text-sm text-muted-foreground">
            Manage your courses, create new content, and assign to classes
          </p>
        </div>

        <Suspense
          fallback={
            <div className="p-6 pt-0">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="col-span-1">
                      <Skeleton className="h-[220px] w-full rounded-md" />
                    </div>
                  ))}
              </div>
            </div>
          }
        >
          <CoursesList />
        </Suspense>
      </div>
    </div>
  )
}
