"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Users, BarChart, FileText, Settings, Menu, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { LogoutButton } from "@/components/logout-button"
import { useSession } from "next-auth/react"

export function TeacherSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const userName = session?.user?.name || "Teacher"

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/teacher",
      active: pathname === "/teacher",
    },
    {
      label: "Content Creation",
      icon: BookOpen,
      href: "/teacher/content",
      active: pathname === "/teacher/content" || pathname.startsWith("/teacher/content/"),
    },
    {
      label: "Students",
      icon: Users,
      href: "/teacher/students",
      active: pathname === "/teacher/students" || pathname.startsWith("/teacher/students/"),
    },
    {
      label: "Analytics",
      icon: BarChart,
      href: "/teacher/analytics",
      active: pathname === "/teacher/analytics",
    },
    {
      label: "Learning Plans",
      icon: FileText,
      href: "/teacher/plans",
      active: pathname === "/teacher/plans" || pathname.startsWith("/teacher/plans/"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/teacher/settings",
      active: pathname === "/teacher/settings",
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-semibold">Teacher Dashboard</h2>
          </div>

          {/* User info */}
          <div className="border-b p-6">
            <p className="font-medium">{userName}</p>
            <p className="text-sm text-muted-foreground">Teacher</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <LogoutButton className="w-full" />
          </div>
        </div>
      </div>
    </>
  )
}
