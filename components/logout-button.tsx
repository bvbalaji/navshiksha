"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface LogoutButtonProps {
  callbackUrl?: string
  className?: string
}

export function LogoutButton({ callbackUrl = "/", className }: LogoutButtonProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({
        callbackUrl,
        redirect: true,
      })
    } catch (error) {
      console.error("Sign out error:", error)
      // Fallback redirect if client-side signOut fails
      window.location.href = callbackUrl
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Button onClick={handleSignOut} disabled={isSigningOut} className={className} variant="outline">
      {isSigningOut ? "Signing out..." : "Sign out"}
    </Button>
  )
}

