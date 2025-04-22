"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroButtons() {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-2 min-[400px]:flex-row">
      <Button size="lg" className="gap-1.5" onClick={() => router.push("/register")}>
        Start Learning <ArrowRight className="h-4 w-4" />
      </Button>
      <Button size="lg" variant="outline" onClick={() => router.push("/subjects")}>
        Explore Subjects
      </Button>
    </div>
  )
}
