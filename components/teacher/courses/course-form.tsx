"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  subjectId: z.string({
    required_error: "Please select a subject.",
  }),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
    required_error: "Please select a level.",
  }),
  estimatedDuration: z.coerce.number().min(1).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
})

type CourseFormValues = z.infer<typeof formSchema>

type CourseFormProps = {
  course?: {
    id: string
    title: string
    description: string | null
    subjectId: string
    level: string
    estimatedDuration: number | null
    thumbnailUrl: string | null
    isPublished: boolean
  }
  subjects: {
    id: string
    name: string
  }[]
}

export function CourseForm({ course, subjects }: CourseFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      subjectId: course?.subjectId || "",
      level: (course?.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED") || "BEGINNER",
      estimatedDuration: course?.estimatedDuration || undefined,
      thumbnailUrl: course?.thumbnailUrl || "",
    },
  })

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true)

    try {
      const url = course ? `/api/teacher/courses/${course.id}` : "/api/teacher/courses"

      const method = course ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save course")
      }

      const data = await response.json()

      toast({
        title: course ? "Course updated" : "Course created",
        description: course
          ? "Your course has been updated successfully."
          : "Your new course has been created successfully.",
      })

      router.push(`/teacher/courses/${data.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Mathematics" {...field} />
              </FormControl>
              <FormDescription>The title of your course as it will appear to students.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A comprehensive introduction to basic mathematical concepts..."
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>Describe what students will learn in this course.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subjectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The subject area this course belongs to.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>The difficulty level of this course.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} placeholder="60" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>Approximate time to complete the course.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>URL to an image that represents your course.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : course ? "Update Course" : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
