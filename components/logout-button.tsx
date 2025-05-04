"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  callbackUrl?: string
  className?: string
}

export function LogoutButton({ callbackUrl = "/", className }: LogoutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      // First try the custom API approach
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callbackUrl }),
      })

      const data = await response.json()

      if (data.success) {
        // Clear any client-side auth state
        window.localStorage.removeItem("next-auth.session-token")
        window.localStorage.removeItem("next-auth.callback-url")
        window.localStorage.removeItem("next-auth.csrf-token")

        // Navigate to the callback URL
        router.push(data.url)
        router.refresh()
      } else {
        // Fallback to direct navigation
        window.location.href = callbackUrl
      }
    } catch (error) {
      console.error("Log out error:", error)
      // Fallback redirect
      window.location.href = callbackUrl
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut} className={className} variant="outline">
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}
