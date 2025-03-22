"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { z } from "zod"

// Signup schema for client-side validation
const SignupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["student", "teacher"], { message: "Please select a role" }),
})

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setGeneralError(null)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("first-name") as string
    const lastName = formData.get("last-name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    // Validate form data
    const validationResult = SignupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      role,
    })

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors)
      setIsLoading(false)
      return
    }

    // In a real app, you would call an API to register the user
    // For now, we'll just simulate success
    setSuccess(true)
    setSelectedRole(role)
    setIsLoading(false)

    // In a real implementation, you would register the user and then sign them in
    // await signIn("credentials", {
    //   email,
    //   password,
    //   callbackUrl: role === "teacher" ? "/dashboard/teacher" : "/dashboard",
    // })
  }

  // Update the success message to reflect the selected role
  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center">
              <Link href="/">
                <Brain className="h-10 w-10 text-primary" />
              </Link>
            </div>
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
              Account created successfully!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              Please check your email to verify your account.
              {selectedRole === "teacher"
                ? " You will be able to access the teacher dashboard after verification."
                : ""}
            </p>
            <div className="mt-6 flex justify-center">
              <Link href="/login">
                <Button>Go to Login</Button>
              </Link>
            </div>
          </div>
        </div>
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
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">Create your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {generalError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first-name">First name</Label>
                <div className="mt-2">
                  <Input id="first-name" name="first-name" type="text" autoComplete="given-name" required />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName[0]}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="last-name">Last name</Label>
                <div className="mt-2">
                  <Input id="last-name" name="last-name" type="text" autoComplete="family-name" required />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName[0]}</p>}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input id="email" name="email" type="email" autoComplete="email" required />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email[0]}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="mt-2">
                <Input id="password" name="password" type="password" autoComplete="new-password" required />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password[0]}</p>}
              </div>
            </div>

            <div>
              <Label>I am a</Label>
              <RadioGroup defaultValue="student" name="role" className="mt-2 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">Teacher</Label>
                </div>
              </RadioGroup>
              {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role[0]}</p>}
            </div>

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold leading-6 text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

