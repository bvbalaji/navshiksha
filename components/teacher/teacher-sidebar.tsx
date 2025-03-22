"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, LayoutDashboard, Users, FileText, BarChart, Settings, Brain, PenTool } from "lucide-react"

export default function TeacherSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors by only rendering after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => {
    if (!mounted) return false
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/teacher",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Students",
      href: "/dashboard/teacher/students",
      icon: Users,
    },
    {
      title: "Courses",
      href: "/dashboard/teacher/courses",
      icon: BookOpen,
    },
    {
      title: "Content Creator",
      href: "/dashboard/teacher/content",
      icon: PenTool,
    },
    {
      title: "Assignments",
      href: "/dashboard/teacher/assignments",
      icon: FileText,
    },
    {
      title: "Analytics",
      href: "/dashboard/teacher/analytics",
      icon: BarChart,
    },
  ]

  const accountItems = [
    {
      title: "Settings",
      href: "/dashboard/teacher/settings",
      icon: Settings,
    },
  ]

  // Return a simplified version during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Brain className="h-5 w-5 text-primary" />
            <span>Naviksha Teacher</span>
          </div>
        </div>
        <nav className="flex-1 overflow-auto py-4">{/* Simplified content for SSR */}</nav>
      </aside>
    )
  }

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard/teacher" className="flex items-center gap-2 font-semibold">
          <Brain className="h-5 w-5 text-primary" />
          <span>Naviksha Teacher</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 text-xs font-semibold text-gray-500">TEACHING</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.href) && (!item.exact || pathname === item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 text-xs font-semibold text-gray-500">ACCOUNT</h2>
          <div className="space-y-1">
            {accountItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.href) ? "bg-primary/10 text-primary" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  )
}

