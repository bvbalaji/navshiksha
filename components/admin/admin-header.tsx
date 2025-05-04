"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Search,
  Menu,
  X,
  Settings,
  User,
  LogOut,
  Shield,
  ChevronDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function AdminHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    router.push("/signout")
  }

  const systemStatus = "operational" // Could be: operational, degraded, maintenance, outage

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6" />
              <span>Navshiksha Admin</span>
            </Link>
          </div>
          {/* Mobile navigation will be rendered here by the AdminSidebar component */}
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-2">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Shield className="h-6 w-6" />
          <span className="hidden md:inline-block">Navshiksha Admin</span>
        </Link>

        <div className="ml-4 flex items-center gap-2">
          <Badge
            variant={systemStatus === "operational" ? "outline" : "destructive"}
            className="hidden md:flex items-center gap-1"
          >
            {systemStatus === "operational" ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
            <span className="text-xs">
              {systemStatus === "operational" ? "All Systems Operational" : "System Issues Detected"}
            </span>
          </Badge>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {isSearchOpen ? (
          <div className="relative md:w-64 lg:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search admin..."
              className="w-full bg-background pl-8 md:w-64 lg:w-80"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-2">
              <h2 className="font-medium">Notifications</h2>
              <Button variant="ghost" size="sm" className="text-xs">
                Mark all as read
              </Button>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2 p-2 hover:bg-muted">
                  <AlertCircle className="mt-1 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">System Alert</p>
                    <p className="text-xs text-muted-foreground">Database backup completed successfully</p>
                    <p className="text-xs text-muted-foreground">10 minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2 text-center">
              <Link href="/admin/notifications" className="text-xs text-primary hover:underline">
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden gap-2 md:flex">
              <span>Administrator</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="flex items-center gap-2 p-2">
              <div className="rounded-full bg-primary/10 p-1">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@navshiksha.org</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
