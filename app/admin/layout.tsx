import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { requireRole } from "@/lib/auth/auth"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  // Check if user has student role
  await requireRole(["ADMIN"])

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <AdminSidebar />
      </div>
      <div className="flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
