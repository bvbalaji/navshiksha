import type { ReactNode } from "react"

interface TutorLayoutProps {
  children: ReactNode
}

export default function TutorLayout({ children }: TutorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="pt-16 pb-20">{children}</main>
    </div>
  )
}
