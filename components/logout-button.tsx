"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean
  redirectPath?: string
}

export function LogoutButton({
  children,
  showIcon = true,
  redirectPath = "/",
  variant = "outline",
  size = "sm",
  ...props
}: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      // Use the redirect option instead of handling navigation manually
      await signOut({
        callbackUrl: redirectPath,
        redirect: true,
      })
      // The redirect will be handled by NextAuth, so we don't need to use router.push
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleLogout} disabled={isLoading} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || (isLoading ? "Logging out..." : "Log out")}
    </Button>
  )
}
