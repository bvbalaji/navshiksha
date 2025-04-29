import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireRole } from "@/lib/auth-utils"
import { PrismaClient } from "@prisma/client"
import { BarChart, LineChart, PieChart, Activity, Clock, BookOpen, CheckCircle } from "lucide-react"

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

export default async function AnalyticsPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const engagementStats = await getStudentEngagementStats(teacherId)
  const contentStats = await getContentStats(teacherId)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

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
        <TabsList>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="performance">Student Performance</TabsTrigger>
          <TabsTrigger value="content">Content Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Engagement Over Time</CardTitle>
              <CardDescription>Weekly active students in your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Engagement chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Time Spent by Students</CardTitle>
                <CardDescription>Average time spent on content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <Clock className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Time spent chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Popularity</CardTitle>
                <CardDescription>Most accessed lessons and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <BarChart className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Popularity chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance</CardTitle>
              <CardDescription>Average scores across all quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Performance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rates</CardTitle>
                <CardDescription>Course and lesson completion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <PieChart className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Completion chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Outcomes</CardTitle>
                <CardDescription>Achievement of learning objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Outcomes chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Effectiveness</CardTitle>
              <CardDescription>Impact of different content types on learning outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Content effectiveness chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Breakdown of content types in your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <PieChart className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Distribution chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Analysis</CardTitle>
                <CardDescription>Content difficulty based on student performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <Activity className="h-12 w-12 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Difficulty chart will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
