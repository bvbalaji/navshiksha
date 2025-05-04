import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
        <Skeleton className="h-9 w-40" />
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

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
      </div>
    </div>
  )
}
