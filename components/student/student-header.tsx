"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Search, User, LogOut, Settings, HelpCircle, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StudentMobileNav } from "./student-sidebar"
import { LogoutButton } from "@/components/logout-button"

export function StudentHeader() {
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <StudentMobileNav />

      <div className="hidden md:flex md:items-center md:gap-2">
        <GraduationCap className="h-6 w-6" />
        <span className="text-lg font-semibold">Navshiksha</span>
      </div>

      <div className="relative hidden md:flex md:flex-1 md:items-center md:gap-2">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search courses, assignments..." className="w-full max-w-sm pl-8" />
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {notifications}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5" />
              </div>
              <div className="flex flex-col space-y-0.5">
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">alex.j@example.com</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/student/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/student/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutButton variant="ghost" className="w-full justify-start p-0 font-normal" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
