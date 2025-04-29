import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PrismaClient } from "@prisma/client"
import { requireRole } from "@/lib/auth-utils"
import Link from "next/link"
import { Search, Users, UserPlus, Mail, FileText } from "lucide-react"

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
  // Get unique students from all classes taught by this teacher
  const students = await prisma.$queryRaw`
    SELECT DISTINCT u.id, u.name, u.email, u.profile_image_url
    FROM users u
    JOIN class_students cs ON u.id = cs.student_id
    JOIN classes c ON cs.class_id = c.id
    WHERE c.teacher_id = ${teacherId}::uuid
    ORDER BY u.name
  `

  return students
}

export default async function StudentsPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const classes = await getTeacherClasses(teacherId)
  const students = await getStudentsInTeacherClasses(teacherId)

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
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search students..." className="max-w-sm" />
      </div>

      <Tabs defaultValue="classes">
        <TabsList>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">All Students</TabsTrigger>
          <TabsTrigger value="plans">Learning Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4 pt-4">
          {classes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Card key={cls.id}>
                  <CardHeader>
                    <CardTitle>{cls.name}</CardTitle>
                    <CardDescription>{cls.subject.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{cls._count.students} students</span>
                    </div>
                    <p className="mt-2 text-sm">{cls.description || "No description provided."}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/students/class/${cls.id}`}>Manage Class</Link>
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
                    <div key={student.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
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
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/students/${student.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/teacher/students/${student.id}/plans`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Learning Plan
                          </Link>
                        </Button>
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
            <CardHeader>
              <CardTitle>Learning Plans</CardTitle>
              <CardDescription>Personalized learning plans for your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Learning Plans</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Create and manage personalized learning plans for your students
                </p>
                <Button asChild>
                  <Link href="/teacher/plans">Manage Learning Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
