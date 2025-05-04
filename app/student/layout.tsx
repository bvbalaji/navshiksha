import type { ReactNode } from "react"
import { StudentSidebar } from "@/components/student/student-sidebar"
import { StudentHeader } from "@/components/student/student-header"
import { requireRole } from "@/lib/auth/auth"

export default async function StudentLayout({ children }: { children: ReactNode }) {
  // Check if user has student role
  await requireRole(["STUDENT", "ADMIN"])

  return (
    <div className="flex min-h-screen flex-col">
      <StudentHeader />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
