"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CSSDebugger() {
  const [isDebugging, setIsDebugging] = useState(false)

  const toggleDebugging = () => {
    setIsDebugging(!isDebugging)

    if (!isDebugging) {
      // Add debug outlines to all elements
      document.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement
        element.style.outline = "1px solid rgba(255, 0, 0, 0.2)"
      })
    } else {
      // Remove debug outlines
      document.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement
        element.style.outline = ""
      })
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={toggleDebugging} variant={isDebugging ? "destructive" : "secondary"} size="sm">
        {isDebugging ? "Disable CSS Debug" : "Enable CSS Debug"}
      </Button>
    </div>
  )
}
