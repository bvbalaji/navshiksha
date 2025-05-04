"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface LogoutButtonProps {
  callbackUrl?: string
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({
  callbackUrl = "/",
  className,
  children = "Sign out",
}: LogoutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      // First approach: Use /signout API endpoint
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callbackUrl }),
      })

      if (response.ok) {
        // Clear client-side storage
        localStorage.removeItem("next-auth.session-token")
        localStorage.removeItem("next-auth.callback-url")
        localStorage.removeItem("next-auth.csrf-token")
        sessionStorage.clear()

        // Force a hard navigation to the callback URL
        window.location.href = callbackUrl
      } else {
        // Fallback: Try direct navigation
        window.location.href = `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`
      }
    } catch (error) {
      console.error("Sign out error:", error)
      // Last resort fallback
      window.location.href = callbackUrl
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut} className={className} variant="outline">
      {isSigningOut ? "Signing out..." : children}
    </Button>
  )
}
