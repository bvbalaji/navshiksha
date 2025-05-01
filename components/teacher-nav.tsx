"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, GraduationCap, LayoutDashboard, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/teacher",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Content",
    href: "/teacher/content",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
  },
  {
    title: "Learning Plans",
    href: "/teacher/plans",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
]

export function TeacherNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

        return (
          <Button
            key={item.href}
            variant={isActive ? "secondary" : "ghost"}
            className={cn("justify-start", isActive && "bg-secondary font-medium")}
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
