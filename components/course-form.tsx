"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Course, Subject } from "@prisma/client"
import { createCourse, updateCourse } from "@/app/actions/content-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"

interface CourseFormProps {
  subjects: Subject[]
  course?: Course
  userId: string
}

export function CourseForm({ subjects, course, userId }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    formData.append("creatorId", userId)

    try {
      let result

      if (course) {
        result = await updateCourse(course.id, formData)
      } else {
        result = await createCourse(formData)
      }

      if (result.error) {
        setErrors(result.error)
        toast({
          title: "Error",
          description: "Please correct the errors in the form.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: course ? "Course updated successfully." : "Course created successfully.",
        })

        if (!course && result.courseId) {
          router.push(`/teacher/content/edit-course/${result.courseId}`)
        } else {
          router.push("/teacher/content")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? "Edit Course" : "Create New Course"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" name="title" defaultValue={course?.title || ""} required />
            {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={course?.description || ""} />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjectId">Subject</Label>
            <Select name="subjectId" defaultValue={course?.subject_id || ""} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select name="level" defaultValue={course?.level || "BEGINNER"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && <p className="text-sm text-red-500">{errors.level[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              type="number"
              min="1"
              defaultValue={course?.estimated_duration?.toString() || ""}
            />
            {errors.estimatedDuration && <p className="text-sm text-red-500">{errors.estimatedDuration[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
            <Input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={course?.thumbnail_url || ""} />
            {errors.thumbnailUrl && <p className="text-sm text-red-500">{errors.thumbnailUrl[0]}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isPublished" name="isPublished" defaultChecked={course?.is_published || false} value="true" />
            <Label htmlFor="isPublished">Publish this course</Label>
            {errors.isPublished && <p className="text-sm text-red-500">{errors.isPublished[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/teacher/content")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : course ? "Update Course" : "Create Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
