"use client"

import type React from "react"
import { logout } from "@/app/actions/logout-actions"

import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  redirectTo?: string
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ redirectTo = "/", className, children = "Log out" }: LogoutButtonProps) {
  const handleLogout = async () => {
    // Use a direct navigation to our custom logout endpoint
    window.location.href = `/api/logout?redirectTo=${encodeURIComponent(redirectTo)}`
   
  }

  return (
    <Button onClick={handleLogout} className={className} variant="outline">
      {children}
    </Button>
  )
}
