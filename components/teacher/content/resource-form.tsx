"use client"

import type React from "react"

import { useState } from "react"
import type { Resource } from "@prisma/client"
import { createResource, updateResource } from "@/app/actions/content-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ResourceFormProps {
  resource?: Resource
  userId: string
}

export function ResourceForm({ resource, userId }: ResourceFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [resourceType, setResourceType] = useState(resource?.resource_type || "PDF")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    formData.append("createdBy", userId)

    try {
      let result

      if (resource) {
        result = await updateResource(resource.id, formData)
      } else {
        result = await createResource(formData)
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
          description: resource ? "Resource updated successfully." : "Resource created successfully.",
        })
        router.push("/teacher/content")
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
        <CardTitle>{resource ? "Edit Resource" : "Create New Resource"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resource Title</Label>
            <Input id="title" name="title" defaultValue={resource?.title || ""} required />
            {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={resource?.description || ""} />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceType">Resource Type</Label>
            <Select
              name="resourceType"
              defaultValue={resource?.resource_type || "PDF"}
              onValueChange={setResourceType}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="VIDEO">Video</SelectItem>
                <SelectItem value="LINK">Link</SelectItem>
                <SelectItem value="IMAGE">Image</SelectItem>
                <SelectItem value="DOCUMENT">Document</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.resourceType && <p className="text-sm text-red-500">{errors.resourceType[0]}</p>}
          </div>

          {(resourceType === "LINK" || resourceType === "VIDEO" || resourceType === "IMAGE") && (
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" type="url" defaultValue={resource?.url || ""} required />
              {errors.url && <p className="text-sm text-red-500">{errors.url[0]}</p>}
            </div>
          )}

          {(resourceType === "PDF" || resourceType === "DOCUMENT" || resourceType === "OTHER") && (
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" rows={5} defaultValue={resource?.content || ""} />
              {errors.content && <p className="text-sm text-red-500">{errors.content[0]}</p>}
            </div>
          )}
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
            {isSubmitting ? "Saving..." : resource ? "Update Resource" : "Create Resource"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
