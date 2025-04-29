import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, FileText } from "lucide-react"
import { requireRole } from "@/lib/auth-utils"
import { PrismaClient } from "@prisma/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const prisma = new PrismaClient()

async function getTeacherStats(teacherId: string) {
  const coursesCount = await prisma.course.count({
    where: { creator_id: teacherId },
  })

  const classesCount = await prisma.class.count({
    where: { teacher_id: teacherId },
  })

  const studentsCount = await prisma.$queryRaw`
    SELECT COUNT(DISTINCT cs.student_id) 
    FROM "class_students" cs
    JOIN "classes" c ON cs.class_id = c.id
    WHERE c.teacher_id = ${teacherId}::uuid
  `

  const plansCount = await prisma.learningPlan.count({
    where: { created_by: teacherId },
  })

  return {
    coursesCount,
    classesCount,
    studentsCount: Number(studentsCount[0]?.count || 0),
    plansCount,
  }
}

async function getRecentClasses(teacherId: string) {
  return prisma.class.findMany({
    where: { teacher_id: teacherId },
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      subject: true,
      _count: {
        select: { students: true },
      },
    },
  })
}

async function getRecentAnnouncements(teacherId: string) {
  return prisma.announcement.findMany({
    where: { teacher_id: teacherId },
    orderBy: { created_at: "desc" },
    take: 5,
    include: {
      class: true,
    },
  })
}

export default async function TeacherDashboard() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const stats = await getTeacherStats(teacherId)
  const recentClasses = await getRecentClasses(teacherId)
  const recentAnnouncements = await getRecentAnnouncements(teacherId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button asChild>
          <Link href="/teacher/content/create">Create New Content</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
              <p className="text-3xl font-bold">{stats.coursesCount}</p>
            </div>
            <BookOpen className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
              <p className="text-3xl font-bold">{stats.classesCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold">{stats.studentsCount}</p>
            </div>
            <Users className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-row items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Learning Plans</p>
              <p className="text-3xl font-bold">{stats.plansCount}</p>
            </div>
            <FileText className="h-8 w-8 text-primary/60" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Recent Classes</TabsTrigger>
          <TabsTrigger value="announcements">Recent Announcements</TabsTrigger>
          <TabsTrigger value="activity">Student Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 pt-4">
          {recentClasses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentClasses.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription>{cls.subject.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{cls._count.students} students</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/teacher/students/class/${cls.id}`}>View Class</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No classes found. Create your first class!</p>
          )}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/teacher/students/classes">View All Classes</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 pt-4">
          {recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{announcement.title}</CardTitle>
                      <span className="text-xs text-muted-foreground">
                        {new Date(announcement.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardDescription>Class: {announcement.class.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No announcements found.</p>
          )}
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/teacher/students/announcements">Manage Announcements</Link>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Student Activity</CardTitle>
              <CardDescription>Overview of student engagement in the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Student activity chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
