"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

interface AuthErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthErrorBoundary({ error, reset }: AuthErrorBoundaryProps) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Authentication error:", error)
  }, [error])

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <Alert className="mb-6 max-w-md">
        <AlertTitle className="mb-2 text-xl font-bold">Authentication Error</AlertTitle>
        <AlertDescription>
          There was a problem with your authentication session. This could be due to an expired session or invalid
          credentials.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button onClick={handleGoToLogin}>Go to Login</Button>
        <Button variant="outline" onClick={handleGoHome}>
          Go to Home
        </Button>
        <Button variant="secondary" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  )
}
