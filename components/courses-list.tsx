"use client"

import { useEffect, useState } from "react"
import { CourseCard } from "./course-card"
import { EmptyPlaceholder } from "../empty-placeholder"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpenCheck } from "lucide-react"

interface Course {
  id: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  level: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
  subject: {
    name: string
  }
  _count: {
    modules: number
    enrollments: number
  }
}

export function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/teacher/courses")

        if (!response.ok) {
          throw new Error("Failed to fetch courses")
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
        setError("Failed to load courses. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (isLoading) {
    return (
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
    )
  }

  if (error) {
    return (
      <div className="p-6 pt-0">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="p-6 pt-0">
        <EmptyPlaceholder
          icon={BookOpenCheck}
          title="No courses found"
          description="You haven't created any courses yet. Start creating your first course."
          buttonText="Create Course"
          buttonHref="/teacher/courses/create"
        />
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
