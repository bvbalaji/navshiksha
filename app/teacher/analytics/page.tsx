import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireRole } from "@/lib/auth-utils"
import { PrismaClient } from "@prisma/client"
import { PieChart, Activity, BookOpen, CheckCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PerformanceChart } from "@/components/teacher/analytics/performance-chart"
import { EngagementChart } from "@/components/teacher/analytics/engagement-chart"
import { AnalyticsPeriodSelector } from "@/components/teacher/analytics/analytics-period-selector"
import { ContentEffectivenessChart } from "@/components/teacher/analytics/content-effectiveness-chart"
import { QuizPerformanceTable } from "@/components/teacher/analytics/quiz-performance-table"
import { StudentProgressHeatmap } from "@/components/teacher/analytics/student-progress-heatmap"
import { LearningOutcomesRadar } from "@/components/teacher/analytics/learning-outcomes-radar"

const prisma = new PrismaClient()

async function getStudentEngagementStats(teacherId: string) {
  // Get total students in teacher's classes
  const totalStudents = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT cs.student_id) 
    FROM "class_students" cs
    JOIN "classes" c ON cs.class_id = c.id
    WHERE c.teacher_id = ${teacherId}::uuid
  `

  // Get active students (those who accessed content in the last 7 days)
  const activeStudents = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT p.user_id)
    FROM "progress" p
    JOIN "lessons" l ON p.lesson_id = l.id
    JOIN "modules" m ON l.module_id = m.id
    JOIN "courses" c ON m.course_id = c.id
    WHERE c.creator_id = ${teacherId}::uuid
    AND p.updated_at > NOW() - INTERVAL '7 days'
  `

  // Get completion rate
  const completionStats = await prisma.$queryRaw`
    SELECT 
      COUNT(*) as total_lessons,
      SUM(CASE WHEN p.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_lessons
    FROM "progress" p
    JOIN "lessons" l ON p.lesson_id = l.id
    JOIN "modules" m ON l.module_id = m.id
    JOIN "courses" c ON m.course_id = c.id
    WHERE c.creator_id = ${teacherId}::uuid
  `

  const totalLessons = Number(completionStats[0]?.total_lessons || 0)
  const completedLessons = Number(completionStats[0]?.completed_lessons || 0)
  const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return {
    totalStudents: Number(totalStudents[0]?.count || 0),
    activeStudents: Number(activeStudents[0]?.count || 0),
    completionRate,
  }
}

async function getContentStats(teacherId: string) {
  const coursesCount = await prisma.course.count({
    where: { creator_id: teacherId },
  })

  const lessonsCount = await prisma.$queryRaw`
    SELECT COUNT(l.id)
    FROM "lessons" l
    JOIN "modules" m ON l.module_id = m.id
    JOIN "courses" c ON m.course_id = c.id
    WHERE c.creator_id = ${teacherId}::uuid
  `

  const quizzesCount = await prisma.$queryRaw`
    SELECT COUNT(q.id)
    FROM "quizzes" q
    JOIN "lessons" l ON q.lesson_id = l.id
    JOIN "modules" m ON l.module_id = m.id
    JOIN "courses" c ON m.course_id = c.id
    WHERE c.creator_id = ${teacherId}::uuid
  `

  return {
    coursesCount,
    lessonsCount: Number(lessonsCount[0]?.count || 0),
    quizzesCount: Number(quizzesCount[0]?.count || 0),
  }
}

async function getPerformanceData() {
  // In a real app, this would fetch from the database
  // For now, we'll return mock data
  return [
    { name: "Week 1", average: 72, best: 95, worst: 45 },
    { name: "Week 2", average: 75, best: 98, worst: 50 },
    { name: "Week 3", average: 78, best: 100, worst: 55 },
    { name: "Week 4", average: 80, best: 100, worst: 60 },
    { name: "Week 5", average: 82, best: 100, worst: 65 },
    { name: "Week 6", average: 85, best: 100, worst: 70 },
  ]
}

async function getEngagementData() {
  // In a real app, this would fetch from the database
  // For now, we'll return mock data
  return [
    { name: "Math 101", completed: 45, inProgress: 30, notStarted: 25 },
    { name: "Science", completed: 35, inProgress: 40, notStarted: 25 },
    { name: "History", completed: 55, inProgress: 25, notStarted: 20 },
    { name: "English", completed: 60, inProgress: 30, notStarted: 10 },
  ]
}

export default async function AnalyticsPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const engagementStats = await getStudentEngagementStats(teacherId)
  const contentStats = await getContentStats(teacherId)
  const performanceData = await getPerformanceData()
  const engagementData = await getEngagementData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <AnalyticsPeriodSelector />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{engagementStats.totalStudents}</p>
            </div>
            <Activity className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Students</p>
              <p className="text-3xl font-bold">{engagementStats.activeStudents}</p>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Activity className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <p className="text-3xl font-bold">{engagementStats.completionRate}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Content</p>
              <p className="text-3xl font-bold">{contentStats.lessonsCount}</p>
              <p className="text-xs text-muted-foreground">Lessons</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="pt-4 space-y-4">
          <EngagementChart
            data={engagementData}
            title="Course Engagement"
            description="Lesson completion status across courses"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Students</CardTitle>
                <CardDescription>Average time spent on content (minutes)</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <StudentProgressHeatmap />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Students spend the most time on interactive content.</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Popularity</CardTitle>
                <CardDescription>Most accessed lessons and resources</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ContentEffectivenessChart />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Video lessons have the highest engagement rates.</p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="pt-4 space-y-4">
          <PerformanceChart
            data={performanceData}
            title="Quiz Performance Trends"
            description="Average, best, and worst scores over time"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
                <CardDescription>Achievement of learning objectives</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LearningOutcomesRadar />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Critical thinking skills show the most improvement.</p>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quiz Performance</CardTitle>
                <CardDescription>Performance by quiz difficulty</CardDescription>
              </CardHeader>
              <CardContent>
                <QuizPerformanceTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="pt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Effectiveness</CardTitle>
              <CardDescription>Impact of different content types on learning outcomes</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ContentEffectivenessChart />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Interactive exercises show the highest correlation with improved test scores.
              </p>
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Breakdown of content types in your courses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <PieChart className="h-full w-full text-muted-foreground" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Analysis</CardTitle>
                <CardDescription>Content difficulty based on student performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Activity className="h-full w-full text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>AI-generated insights based on your analytics data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Engagement Patterns</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Students are most active on Tuesdays and Wednesdays. Consider scheduling important content releases on
                  these days.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Performance Insights</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Quiz scores have improved by 15% over the last month, with the greatest improvements in
                  multiple-choice questions.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">Content Recommendations</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Consider adding more interactive exercises to your Science course, as students show higher engagement
                  with this content type.
                </p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium">At-Risk Students</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  5 students have shown declining engagement over the past two weeks. Consider reaching out to provide
                  additional support.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Generate Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
