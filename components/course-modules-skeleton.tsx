import { Skeleton } from "@/components/ui/skeleton"

export function CourseModulesSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="border-t">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="border-b py-4">
              <div className="flex items-center px-6">
                <Skeleton className="mr-2 h-9 w-9" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="mt-1 h-4 w-64" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
