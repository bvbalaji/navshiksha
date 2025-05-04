"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"

export function CoursesHeader() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    router.push(`/teacher/courses?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="flex flex-col items-start justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Courses</h1>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <Button onClick={() => router.push("/teacher/courses/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>
    </div>
  )
}
