"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Use redirect: true to avoid JSON parsing issues
        await signOut({ redirect: false })

        // Manually redirect after sign out
        router.push("/")
      } catch (error) {
        console.error("Sign out error:", error)
        // Redirect to home page even if there's an error
        router.push("/")
      }
    }

    performSignOut()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p>Please wait while we sign you out.</p>
      </div>
    </div>
  )
}
