"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CreateModuleDialog } from "@/components/teacher/courses/create-module-dialog"

export function CreateModuleButton({ courseId }: { courseId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Module
      </Button>

      <CreateModuleDialog courseId={courseId} open={open} onOpenChange={setOpen} />
    </>
  )
}
