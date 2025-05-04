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

  // If authenticated, show logout button and dashboard link based on user role
  if (status === "authenticated") {
    // Determine dashboard route based on user role
    const dashboardRoute = getDashboardRouteByRole(session?.user?.role as string)

    return (
      <div className={className}>
        <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push(dashboardRoute)}>
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

// Helper function to determine dashboard route based on user role
function getDashboardRouteByRole(role?: string): string {
  if (!role) return "/student"

  const normalizedRole = role.toUpperCase()

  if (normalizedRole === "ADMIN") return "/admin"
  if (normalizedRole === "TEACHER") return "/teacher"

  // Default to student dashboard
  return "/student"
}
