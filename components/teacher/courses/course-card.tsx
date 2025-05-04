"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, BookOpen, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

type CourseCardProps = {
  course: {
    id: string
    title: string
    description: string | null
    level: string
    isPublished: boolean
    estimatedDuration: number | null
    thumbnailUrl: string | null
    createdAt: Date
    updatedAt: Date | null
    subject: {
      name: string
    }
    _count: {
      modules: number
      enrollments: number
    }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/teacher/courses/${course.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete course")
      }

      toast({
        title: "Course deleted",
        description: "The course has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Badge variant={course.isPublished ? "default" : "outline"}>
            {course.isPublished ? "Published" : "Draft"}
          </Badge>
          <Badge variant="secondary">{course.level}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isDeleting}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/teacher/courses/${course.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/teacher/courses/${course.id}/edit`}>Edit Course</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Course"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1">
        <Link href={`/teacher/courses/${course.id}`} className="block space-y-2 hover:underline">
          <h3 className="font-semibold leading-none tracking-tight">{course.title}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {course.description || "No description provided"}
          </p>
        </Link>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{course.subject.name}</span>
          </div>
          {course.estimatedDuration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.estimatedDuration} mins</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course._count.enrollments} students</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <span>
            {course._count.modules} module{course._count.modules !== 1 ? "s" : ""}
          </span>
          <span>
            Updated {formatDistanceToNow(new Date(course.updated_at || course.created_at), { addSuffix: true })}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
