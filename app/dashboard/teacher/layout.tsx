import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth/auth.config"
import TeacherSidebar from "@/components/teacher/teacher-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log("No session in teacher dashboard layout, redirecting to login")
    redirect("/login")
  }

  // We'll let the middleware handle role-based redirects
  // and the individual pages can also check roles if needed

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <TeacherSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

