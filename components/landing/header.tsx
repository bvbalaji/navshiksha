"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/landing/theme-toggle"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600"></span>
            <span className="text-xl font-bold">NavShiksha</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link href="/courses" className="text-sm font-medium hover:text-primary">
              Courses
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:text-primary">
              Blog
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/courses" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                Courses
              </Link>
              <Link href="/about" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                About
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                Pricing
              </Link>
              <Link href="/blog" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                Blog
              </Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                Contact
              </Link>
            </nav>
            <div className="flex flex-col space-y-2">
              <Link href="/login" onClick={toggleMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Log in
                </Button>
              </Link>
              <Link href="/signup" onClick={toggleMenu}>
                <Button className="w-full justify-start">Sign up</Button>
              </Link>
            </div>
            <div className="pt-2 border-t">
              <ModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
