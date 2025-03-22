import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log("No session in dashboard layout, redirecting to login")
    redirect("/login")
  }

  // We'll let the middleware handle role-based redirects
  // and the individual pages can also check roles if needed

  return <>{children}</>
}

