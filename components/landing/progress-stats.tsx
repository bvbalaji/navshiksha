"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, GraduationCap, Award } from "lucide-react"

interface ProgressStatsProps {
  progress: {
    coursesProgress: {
      completed: number
      total: number
      percentage: number
    }
    lessonsProgress: {
      completed: number
      total: number
      percentage: number
    }
    averageScore: number
  }
}

export function ProgressStats({ progress }: ProgressStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {progress.coursesProgress.completed}/{progress.coursesProgress.total}
          </div>
          <Progress value={progress.coursesProgress.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {progress.coursesProgress.percentage.toFixed(0)}% complete
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {progress.lessonsProgress.completed}/{progress.lessonsProgress.total}
          </div>
          <Progress value={progress.lessonsProgress.percentage} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {progress.lessonsProgress.percentage.toFixed(0)}% complete
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{progress.averageScore.toFixed(0)}%</div>
          <Progress value={progress.averageScore} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">Based on your recent quiz results</p>
        </CardContent>
      </Card>
    </div>
  )
}
