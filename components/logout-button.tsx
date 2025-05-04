"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface LogoutButtonProps {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter()

  const handleSignOut = () => {
    // Navigate to our custom sign-out page
    router.push("/signout")
  }

  return (
    <Button variant="ghost" className={className} onClick={handleSignOut}>
      Logout
    </Button>
  )
}
