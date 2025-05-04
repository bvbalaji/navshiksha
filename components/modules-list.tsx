"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, GripVertical, Plus } from "lucide-react"
import { LessonsList } from "@/components/teacher/courses/lessons-list"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { EditModuleDialog } from "@/components/teacher/courses/edit-module-dialog"
import { CreateLessonDialog } from "@/components/teacher/courses/create-lesson-dialog"

type ModulesListProps = {
  courseId: string
  modules: {
    id: string
    title: string
    description: string | null
    sequenceOrder: number
    lessons: {
      id: string
      title: string
      contentType: string
      sequenceOrder: number
      estimatedDuration: number | null
    }[]
  }[]
}

export function ModulesList({ courseId, modules }: ModulesListProps) {
  const router = useRouter()
  const [expandedModules, setExpandedModules] = useState<string[]>([modules[0]?.id || ""])
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [addingLessonToModule, setAddingLessonToModule] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm("Are you sure you want to delete this module and all its lessons?")) {
      return
    }

    setIsDeleting(moduleId)

    try {
      const response = await fetch(`/api/teacher/modules/${moduleId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete module")
      }

      toast({
        title: "Module deleted",
        description: "The module and its lessons have been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the module. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="border-t">
      <Accordion type="multiple" value={expandedModules} onValueChange={setExpandedModules} className="divide-y">
        {modules.map((module) => (
          <AccordionItem key={module.id} value={module.id} className="border-none">
            <div className="flex items-center px-6">
              <div className="mr-2 flex h-9 w-9 items-center justify-center">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <AccordionTrigger className="flex-1 py-4 hover:no-underline">
                <div className="flex flex-1 items-center justify-between">
                  <div className="text-left">
                    <h3 className="font-medium">{module.title}</h3>
                    {module.description && <p className="text-sm text-muted-foreground">{module.description}</p>}
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {module.lessons.length} lesson{module.lessons.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
            </div>

            <AccordionContent className="pb-6">
              <div className="mb-4 flex items-center justify-between px-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingModule(module.id)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit Module
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteModule(module.id)}
                    disabled={isDeleting === module.id}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    {isDeleting === module.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
                <Button size="sm" onClick={() => setAddingLessonToModule(module.id)}>
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add Lesson
                </Button>
              </div>

              <LessonsList courseId={courseId} moduleId={module.id} lessons={module.lessons} />
            </AccordionContent>

            {editingModule === module.id && (
              <EditModuleDialog
                courseId={courseId}
                module={module}
                open={true}
                onOpenChange={(open) => {
                  if (!open) setEditingModule(null)
                }}
              />
            )}

            {addingLessonToModule === module.id && (
              <CreateLessonDialog
                courseId={courseId}
                moduleId={module.id}
                open={true}
                onOpenChange={(open) => {
                  if (!open) setAddingLessonToModule(null)
                }}
              />
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
