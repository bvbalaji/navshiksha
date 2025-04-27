"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutButton } from "@/components/logout-button"

interface NavButtonsProps {
  className?: string
}

export function NavButtons({ className }: NavButtonsProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className={className}>
        <Button variant="outline" size="sm" className="mr-2" disabled>
          Loading...
        </Button>
      </div>
    )
  }

  // If authenticated, show logout button and dashboard link
  if (status === "authenticated") {
    return (
      <div className={className}>
        <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
        <LogoutButton />
      </div>
    )
  }

  // If not authenticated, show login and register buttons
  return (
    <div className={className}>
      <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push("/login")}>
        Log in
      </Button>
      <Button size="sm" onClick={() => router.push("/register")}>
        Get Started
      </Button>
    </div>
  )
}
