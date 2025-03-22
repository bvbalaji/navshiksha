"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

// Login schema for client-side validation
const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [redirectAttempted, setRedirectAttempted] = useState(false)

  // Get error from URL if present
  const urlError = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  useEffect(() => {
    if (urlError) {
      if (urlError === "CredentialsSignin") {
        setGeneralError("Invalid email or password")
      } else if (urlError === "unauthenticated") {
        setGeneralError("Please log in to access this page")
      } else {
        setGeneralError(`Authentication error: ${urlError}`)
      }
    }
  }, [urlError])

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated" && !redirectAttempted) {
      setRedirectAttempted(true)
      console.log("User is authenticated, redirecting to appropriate dashboard")

      // Redirect based on role
      if (session.user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard")
      }
    }
  }, [status, session, router, redirectAttempted])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setGeneralError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate form data
    const validationResult = LoginSchema.safeParse({ email, password })

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors)
      setIsLoading(false)
      return
    }

    try {
      console.log("Attempting to sign in with", email)

      // Sign in with NextAuth
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        setGeneralError("Invalid email or password")
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        console.log("Login successful, refreshing...")
        // Let the useEffect handle the redirect based on role
        router.refresh()
      }
    } catch (error) {
      console.error("Login error:", error)
      setGeneralError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // If already authenticated, show loading state
  if (status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <Link href="/">
              <Brain className="h-10 w-10 text-primary" />
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500" id="email-error">
                    {errors.email[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-semibold text-primary hover:text-primary/80">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500" id="password-error">
                    {errors.password[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link href="/signup" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

