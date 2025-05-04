"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  Settings,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FileText,
  Bell,
  Database,
  Shield,
  Server,
  Clock,
  FileCode,
} from "lucide-react"

interface AdminSidebarProps {
  className?: string
}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "User Management",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users" || pathname.startsWith("/admin/users/"),
    },
    {
      label: "Teacher Management",
      icon: GraduationCap,
      href: "/admin/teachers",
      active: pathname === "/admin/teachers" || pathname.startsWith("/admin/teachers/"),
    },
    {
      label: "Student Management",
      icon: BookOpen,
      href: "/admin/students",
      active: pathname === "/admin/students" || pathname.startsWith("/admin/students/"),
    },
    {
      label: "Course Management",
      icon: FileText,
      href: "/admin/courses",
      active: pathname === "/admin/courses" || pathname.startsWith("/admin/courses/"),
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      label: "System",
      icon: Server,
      href: "/admin/system",
      active: pathname === "/admin/system",
      subItems: [
        {
          label: "Database",
          icon: Database,
          href: "/admin/system/database",
          active: pathname === "/admin/system/database",
        },
        {
          label: "Logs",
          icon: FileCode,
          href: "/admin/system/logs",
          active: pathname === "/admin/system/logs",
        },
        {
          label: "Backups",
          icon: Clock,
          href: "/admin/system/backups",
          active: pathname === "/admin/system/backups",
        },
      ],
    },
    {
      label: "Security",
      icon: Shield,
      href: "/admin/security",
      active: pathname === "/admin/security",
    },
    {
      label: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
      active: pathname === "/admin/notifications",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Administration</h2>
          <div className="space-y-1">
            {routes.map((route) => (
              <div key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    route.active ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>

                {route.subItems && route.subItems.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {route.subItems.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                          subItem.active ? "bg-accent text-accent-foreground" : "transparent",
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">System Status</h2>
          <div className="space-y-1">
            <div className="rounded-md bg-green-50 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">All systems operational</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Last checked: 5 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
