"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getRecentLessons } from "@/lib/lessons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, ArrowRight } from "lucide-react"

interface RecentLessonsProps {
  userId: string
}

export function RecentLessons({ userId }: RecentLessonsProps) {
  const [lessons, setLessons] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentLessons() {
      try {
        const recentLessons = await getRecentLessons(userId)
        setLessons(recentLessons)
      } catch (error) {
        console.error("Failed to fetch recent lessons:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentLessons()
  }, [userId])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No recent lessons</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {lessons.map((progress) => (
        <div key={progress.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <Link href={`/lessons/${progress.lesson.id}`} className="font-medium hover:underline">
              {progress.lesson.title}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {new Date(progress.lastViewed).toLocaleDateString()}
            </div>
          </div>
          <Link href={`/lessons/${progress.lesson.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ))}
    </div>
  )
}
