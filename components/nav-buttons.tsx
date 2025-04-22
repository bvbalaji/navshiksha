"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface NavButtonsProps {
  className?: string
}

export function NavButtons({ className }: NavButtonsProps) {
  const router = useRouter()

  return (
    <div className={className}>
      <Button variant="outline" size="sm" className="mr-2" onClick={() => router.push("/login")}>
        Log in
      </Button>
      <Button size="sm" onClick={() => router.push("/register")}>
        Get Started
      </Button>
    </div>
  )
}
