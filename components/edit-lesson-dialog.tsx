"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  contentType: z.enum(["TEXT", "VIDEO", "INTERACTIVE", "QUIZ"], {
    required_error: "Please select a content type.",
  }),
  estimatedDuration: z.coerce.number().min(1).optional(),
})

type EditLessonFormValues = z.infer<typeof formSchema>

type EditLessonDialogProps = {
  courseId: string
  moduleId: string
  lesson: {
    id: string
    title: string
    contentType: string
    estimatedDuration: number | null
    content?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditLessonDialog({ courseId, moduleId, lesson, open, onOpenChange }: EditLessonDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lessonContent, setLessonContent] = useState<string | null>(null)

  // Fetch the lesson content when the dialog opens
  useState(() => {
    const fetchLessonContent = async () => {
      try {
        const response = await fetch(`/api/teacher/lessons/${lesson.id}`)
        if (response.ok) {
          const data = await response.json()
          setLessonContent(data.content)
          form.setValue("content", data.content)
        }
      } catch (error) {
        console.error("Failed to fetch lesson content:", error)
      }
    }

    if (open && !lessonContent) {
      fetchLessonContent()
    }
  })

  const form = useForm<EditLessonFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lesson.title,
      content: lessonContent || "",
      contentType: lesson.contentType as "TEXT" | "VIDEO" | "INTERACTIVE" | "QUIZ",
      estimatedDuration: lesson.estimatedDuration || undefined,
    },
  })

  const onSubmit = async (values: EditLessonFormValues) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/teacher/lessons/${lesson.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update lesson")
      }

      toast({
        title: "Lesson updated",
        description: "Your lesson has been updated successfully.",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the lesson. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
          <DialogDescription>Update the details of your lesson.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The title of your lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEXT">Text</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="INTERACTIVE">Interactive</SelectItem>
                      <SelectItem value="QUIZ">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The type of content for this lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Approximate time to complete the lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[200px]" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>The main content of your lesson.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
