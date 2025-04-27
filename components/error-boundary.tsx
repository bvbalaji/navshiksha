"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">Something went wrong</h2>
      <p className="mb-6 text-muted-foreground">
        An error occurred while rendering this page. Our team has been notified.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()}>Refresh page</Button>
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  )
}
