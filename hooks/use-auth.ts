"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    user: session?.user,
    isAuthenticated: mounted && status === "authenticated",
    isLoading: !mounted || status === "loading",
    isTeacher: mounted && status === "authenticated" && session?.user?.role === "teacher",
    isStudent: mounted && status === "authenticated" && session?.user?.role === "student",
  }
}

