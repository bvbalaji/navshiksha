"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type CourseHeaderProps = {
  course: {
    id: string
    title: string
    isPublished: boolean
    level: string
    subject: {
      name: string
    }
  }
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)

  const togglePublishStatus = async () => {
    setIsPublishing(true)

    try {
      const response = await fetch(`/api/teacher/courses/${course.id}/publish`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !course.isPublished,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update publish status")
      }

      toast({
        title: course.isPublished ? "Course unpublished" : "Course published",
        description: course.isPublished
          ? "The course is now hidden from students"
          : "The course is now visible to students",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update publish status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/teacher/courses">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to courses</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{course.subject.name}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant={course.isPublished ? "default" : "outline"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant={course.isPublished ? "outline" : "default"}
          onClick={togglePublishStatus}
          disabled={isPublishing}
        >
          {isPublishing ? (
            "Updating..."
          ) : course.isPublished ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Publish
            </>
          )}
        </Button>

        <Button asChild variant="outline">
          <Link href={`/teacher/courses/${course.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>
    </div>
  )
}
