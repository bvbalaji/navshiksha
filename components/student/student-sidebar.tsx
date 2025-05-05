"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Brain,
  BookOpen,
  Calendar,
  ChevronDown,
  GraduationCap,
  Home,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Settings,
  User,
  FileText,
  Clock,
  Award,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/student",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "My Courses",
    href: "/student/courses",
    icon: <BookOpen className="h-5 w-5" />,
    submenu: [
      {
        title: "Active Courses",
        href: "/student/courses/active",
        icon: <Clock className="h-4 w-4" />,
      },
      {
        title: "Completed Courses",
        href: "/student/courses/completed",
        icon: <Award className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Assignments",
    href: "/student/assignments",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Schedule",
    href: "/student/schedule",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Progress",
    href: "/student/progress",
    icon: <LineChart className="h-5 w-5" />,
  },
  {
    title: "Tutoring",
    href: "/student/tutoring",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/student/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: <User className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

interface NavItemProps {
  item: NavItem
  isOpen?: Record<string, boolean>
  toggleSubmenu?: (title: string) => void
  className?: string
}

function NavItem({ item, isOpen, toggleSubmenu, className }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === item.href
  const hasSubmenu = item.submenu && item.submenu.length > 0

  return (
    <div className={className}>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
        )}
        onClick={(e) => {
          if (hasSubmenu && toggleSubmenu) {
            e.preventDefault()
            toggleSubmenu(item.title)
          }
        }}
      >
        {item.icon}
        <span className="flex-1">{item.title}</span>
        {hasSubmenu && (
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && isOpen[item.title] ? "rotate-180" : "")}
          />
        )}
      </Link>

      {hasSubmenu && isOpen && isOpen[item.title] && (
        <div className="ml-6 mt-1 space-y-1">
          {item.submenu?.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                pathname === subItem.href
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {subItem.icon}
              <span>{subItem.title}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function StudentSidebar() {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (title: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="hidden border-r bg-background lg:block">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/student" className="flex items-center gap-2 font-semibold">
            <Brain className="h-6 w-6" />
            <span>Student Portal</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} item={item} isOpen={isOpen} toggleSubmenu={toggleSubmenu} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export function StudentMobileNav() {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (title: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Home className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/student" className="flex items-center gap-2 font-semibold">
              <GraduationCap className="h-6 w-6" />
              <span>Student Portal</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavItem key={item.href} item={item} isOpen={isOpen} toggleSubmenu={toggleSubmenu} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
