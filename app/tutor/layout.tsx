import type React from "react"
import { requireAuth } from "@/lib/auth-utils"

export default async function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if not authenticated
  await requireAuth()

  return <>{children}</>
}
