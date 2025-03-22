"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, Search, User, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Prevent hydration errors by only rendering client-specific content after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  // Don't render user-specific content during SSR or before client hydration
  if (!mounted) {
    return (
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="ml-auto flex items-center gap-4">
            {/* Minimal header content for SSR */}
            <div className="h-10 w-10"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={status === "authenticated" && session?.user.role === "teacher" ? "/dashboard/teacher" : "/dashboard"}
            className="flex items-center gap-2 font-semibold"
          >
            <span>Naviksha</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search..." className="w-64 rounded-md bg-background pl-8 md:w-80" />
            </div>
          </form>
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full border border-gray-200">
                <User className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === "authenticated" ? (
                <>
                  <DropdownMenuLabel>
                    {session.user.name || "My Account"}
                    <p className="text-xs font-normal text-muted-foreground">{session.user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={session.user.role === "teacher" ? "/dashboard/teacher/profile" : "/dashboard/profile"}>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={session.user.role === "teacher" ? "/dashboard/teacher/settings" : "/dashboard/settings"}
                    >
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuLabel>Loading...</DropdownMenuLabel>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

