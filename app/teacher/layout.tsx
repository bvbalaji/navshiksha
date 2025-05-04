import type React from "react"
import { requireRole } from "@/lib/auth/auth"
import { TeacherSidebar } from "@/components/teacher/teacher-sidebar"
import { TeacherHeader } from "@/components/teacher/teacher-header"

export default async function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated or not a teacher
  await requireRole(["TEACHER", "ADMIN"])

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col">
        <TeacherHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
