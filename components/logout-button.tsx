"use client"

import type React from "react"

import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  redirectTo?: string
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ redirectTo = "/", className, children = "Log out" }: LogoutButtonProps) {
  const handleLogout = async () => {
    // Use a direct navigation to our custom logout endpoint
    // window.location.href = `/api/auth/signout?redirectTo=${encodeURIComponent(redirectTo)}`
    const logoutResponse = await fetch( `/api/auth/signout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify({
        callbackUrl: encodeURIComponent(redirectTo)
      })
    })
   
  }

  return (
    <Button onClick={handleLogout} className={className} variant="outline">
      {children}
    </Button>
  )
}
