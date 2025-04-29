"use client"

import type React from "react"

import { useState } from "react"
import type { Lesson } from "@prisma/client"
import { createLesson, updateLesson } from "@/app/actions/content-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface LessonFormProps {
  moduleId: string
  lesson?: Lesson
  isOpen: boolean
  onClose: () => void
}

export function LessonForm({ moduleId, lesson, isOpen, onClose }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    formData.append("moduleId", moduleId)

    try {
      let result

      if (lesson) {
        result = await updateLesson(lesson.id, formData)
      } else {
        result = await createLesson(formData)
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
          description: lesson ? "Lesson updated successfully." : "Lesson created successfully.",
        })
        onClose()
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Lesson Title</Label>
            <Input id="title" name="title" defaultValue={lesson?.title || ""} required />
            {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select name="contentType" defaultValue={lesson?.content_type || "TEXT"} required>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="INTERACTIVE">Interactive</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
              </SelectContent>
            </Select>
            {errors.contentType && <p className="text-sm text-red-500">{errors.contentType[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" rows={10} defaultValue={lesson?.content || ""} required />
            {errors.content && <p className="text-sm text-red-500">{errors.content[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
            <Input
              id="estimatedDuration"
              name="estimatedDuration"
              type="number"
              min="1"
              defaultValue={lesson?.estimated_duration?.toString() || ""}
            />
            {errors.estimatedDuration && <p className="text-sm text-red-500">{errors.estimatedDuration[0]}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
