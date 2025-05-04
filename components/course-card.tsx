"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CourseCardProps {
  course: {
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
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/teacher/courses/${course.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl || "/placeholder.svg"}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-0">
          <div className="flex items-start justify-between">
            <h3 className="line-clamp-1 font-semibold">{course.title}</h3>
            <Badge variant={course.isPublished ? "default" : "outline"}>
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {course.description || "No description provided"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary">{course.subject.name}</Badge>
            <Badge variant="secondary">{course.level}</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{course._count.modules} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course._count.enrollments} students</span>
          </div>
          <div>Updated {formatDistanceToNow(new Date(course.updatedAt), { addSuffix: true })}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
