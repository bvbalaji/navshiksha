"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GripVertical, Clock, FileText, Video, Layers } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { EditLessonDialog } from "@/components/teacher/courses/edit-lesson-dialog"

type LessonsListProps = {
  courseId: string
  moduleId: string
  lessons: {
    id: string
    title: string
    contentType: string
    sequenceOrder: number
    estimatedDuration: number | null
  }[]
}

export function LessonsList({ courseId, moduleId, lessons }: LessonsListProps) {
  const router = useRouter()
  const [editingLesson, setEditingLesson] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case "TEXT":
        return <FileText className="h-4 w-4" />
      case "VIDEO":
        return <Video className="h-4 w-4" />
      case "INTERACTIVE":
        return <Layers className="h-4 w-4" />
      case "QUIZ":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Are you sure you want to delete this lesson?")) {
      return
    }

    setIsDeleting(lessonId)

    try {
      const response = await fetch(`/api/teacher/lessons/${lessonId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete lesson")
      }

      toast({
        title: "Lesson deleted",
        description: "The lesson has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the lesson. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  if (lessons.length === 0) {
    return (
      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        No lessons in this module yet. Add your first lesson to get started.
      </div>
    )
  }

  return (
    <div className="space-y-2 px-6">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center rounded-md border bg-card p-3">
          <div className="mr-2 flex h-8 w-8 items-center justify-center">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                {getContentTypeIcon(lesson.contentType)}
              </div>
              <div>
                <h4 className="font-medium">{lesson.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{lesson.contentType}</span>
                  {lesson.estimatedDuration && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.estimatedDuration} mins</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingLesson(lesson.id)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteLesson(lesson.id)}
                disabled={isDeleting === lesson.id}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{isDeleting === lesson.id ? "Deleting..." : "Delete"}</span>
              </Button>
            </div>
          </div>

          {editingLesson === lesson.id && (
            <EditLessonDialog
              courseId={courseId}
              moduleId={moduleId}
              lesson={lesson}
              open={true}
              onOpenChange={(open) => {
                if (!open) setEditingLesson(null)
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
