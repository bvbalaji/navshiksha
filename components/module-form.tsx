"use client"

import type React from "react"

import { useState } from "react"
import type { Module } from "@prisma/client"
import { createModule, updateModule } from "@/app/actions/content-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface ModuleFormProps {
  courseId: string
  module?: Module
  isOpen: boolean
  onClose: () => void
}

export function ModuleForm({ courseId, module, isOpen, onClose }: ModuleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    formData.append("courseId", courseId)

    try {
      let result

      if (module) {
        result = await updateModule(module.id, formData)
      } else {
        result = await createModule(formData)
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
          description: module ? "Module updated successfully." : "Module created successfully.",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{module ? "Edit Module" : "Add New Module"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Module Title</Label>
            <Input id="title" name="title" defaultValue={module?.title || ""} required />
            {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={module?.description || ""} />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : module ? "Update Module" : "Create Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
