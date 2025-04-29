import type React from "react"
import { requireRole } from "@/lib/auth-utils"
import TeacherSidebar from "@/components/teacher/teacher-sidebar"

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated or not a teacher
  const session = await requireRole(["TEACHER", "ADMIN"])

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6">{children}</div>
      </div>
    </div>
  )
}
