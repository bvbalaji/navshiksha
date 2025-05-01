import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PrismaClient } from "@prisma/client"
import { requireRole } from "@/lib/auth-utils"
import Link from "next/link"
import { Search, Users, UserPlus, Mail, FileText, Filter, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const prisma = new PrismaClient()

async function getTeacherClasses(teacherId: string) {
  return prisma.class.findMany({
    where: { teacher_id: teacherId },
    include: {
      subject: true,
      _count: {
        select: { students: true },
      },
    },
    orderBy: { created_at: "desc" },
  })
}

async function getStudentsInTeacherClasses(teacherId: string) {
  // Get unique students from all classes taught by this teacher with more details
  const students = await prisma.$queryRaw`
    SELECT DISTINCT 
      u.id, 
      u.name, 
      u.email, 
      u.profile_image_url,
      up.preferred_language,
      up.learning_style,
      (
        SELECT COUNT(*) FROM enrollments e 
        WHERE e.user_id = u.id
      ) as course_count,
      (
        SELECT COUNT(*) FROM plan_assignments pa 
        WHERE pa.user_id = u.id AND pa.status = 'IN_PROGRESS'
      ) as active_plans
    FROM users u
    JOIN class_students cs ON u.id = cs.student_id
    JOIN classes c ON cs.class_id = c.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE c.teacher_id = ${teacherId}::uuid
    ORDER BY u.name
  `

  return students
}

async function getSubjects() {
  return prisma.subject.findMany({
    orderBy: { name: "asc" },
  })
}

export default async function StudentsPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const classes = await getTeacherClasses(teacherId)
  const students = await getStudentsInTeacherClasses(teacherId)
  const subjects = await getSubjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/teacher/students/create-class">
              <Users className="mr-2 h-4 w-4" />
              New Class
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/students/invite">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Students
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/teacher/students/export">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search students..." className="w-full" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">All Students</TabsTrigger>
          <TabsTrigger value="plans">Learning Plans</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 pt-4">
          {classes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Card key={cls.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription>{cls.subject.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cls._count.students} students</span>
                    </div>
                    <p className="mt-2 text-sm line-clamp-2">{cls.description || "No description provided."}</p>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Start:</span> {new Date(cls.start_date).toLocaleDateString()}
                      </div>
                      {cls.end_date && (
                        <div>
                          <span className="font-medium">End:</span> {new Date(cls.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                    <Button variant="default" size="sm" asChild>
                      <Link href={`/teacher/students/class/${cls.id}`}>Manage</Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/teacher/students/class/${cls.id}/announcements`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Announcements
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No classes yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Create your first class to start managing students</p>
              <Button asChild>
                <Link href="/teacher/students/create-class">Create Class</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="students" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Students</CardTitle>
              <CardDescription>Students enrolled in your classes</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col justify-between rounded-md border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-muted">
                          {student.profile_image_url ? (
                            <img
                              src={student.profile_image_url || "/placeholder.svg"}
                              alt={student.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                              {student.name?.charAt(0) || "S"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {student.learning_style && (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {student.learning_style}
                              </span>
                            )}
                            {student.preferred_language && (
                              <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {student.preferred_language}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-0">
                        <div className="mr-4 flex flex-col items-center">
                          <span className="text-lg font-bold">{student.course_count || 0}</span>
                          <span className="text-xs text-muted-foreground">Courses</span>
                        </div>
                        <div className="mr-4 flex flex-col items-center">
                          <span className="text-lg font-bold">{student.active_plans || 0}</span>
                          <span className="text-xs text-muted-foreground">Plans</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/teacher/students/${student.id}`}>Profile</Link>
                          </Button>
                          <Button variant="default" size="sm" asChild>
                            <Link href={`/teacher/students/${student.id}/plans`}>
                              <FileText className="mr-2 h-4 w-4" />
                              Learning Plan
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Users className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No students yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Invite students to your classes</p>
                  <Button asChild>
                    <Link href="/teacher/students/invite">Invite Students</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Learning Plans</CardTitle>
                <CardDescription>Personalized learning plans for your students</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0" asChild>
                <Link href="/teacher/plans/create">Create New Plan</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-1 divide-y">
                    <div className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium">Personalized Math Learning Plan</h3>
                          <p className="text-sm text-muted-foreground">Intermediate • 8 weeks</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            3 Students Assigned
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/teacher/plans/edit/1">Edit</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href="/teacher/plans/assign/1">Assign</Link>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-medium">Science Fundamentals</h3>
                          <p className="text-sm text-muted-foreground">Beginner • 6 weeks</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                            2 Students Assigned
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/teacher/plans/edit/2">Edit</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href="/teacher/plans/assign/2">Assign</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
              <CardDescription>Track and analyze student performance across classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">76%</div>
                      <p className="text-xs text-muted-foreground">Across all courses</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">82%</div>
                      <p className="text-xs text-muted-foreground">Across all students</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Students needing attention</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="mb-4 font-medium">Performance by Class</h3>
                    <div className="space-y-4">
                      {classes.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            <p className="text-sm text-muted-foreground">{cls._count.students} students</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-medium">78%</p>
                              <p className="text-xs text-muted-foreground">Avg. Completion</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/teacher/analytics/class/${cls.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button asChild>
                    <Link href="/teacher/analytics">View Detailed Analytics</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
