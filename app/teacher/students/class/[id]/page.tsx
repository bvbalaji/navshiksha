import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import { requireRole } from "@/lib/auth/auth" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, UserPlus, FileText, Mail, BookOpen, Calendar, Users } from "lucide-react"
import Link from "next/link"

const prisma = new PrismaClient()

async function getClassDetails(classId: string, teacherId: string) {
  const classDetails = await prisma.class.findUnique({
    where: {
      id: classId,
      teacher_id: teacherId,
    },
    include: {
      subject: true,
      courses: {
        include: {
          course: true,
        },
      },
      students: {
        include: {
          student: {
            include: {
              user_profile: true,
            },
          },
        },
      },
      announcements: {
        orderBy: {
          created_at: "desc",
        },
        take: 5,
      },
    },
  })

  return classDetails
}

export default async function ClassDetailPage({ params }: { params: { id: string } }) {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id
  const classId = params.id

  const classDetails = await getClassDetails(classId, teacherId)

  if (!classDetails) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{classDetails.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{classDetails.subject.name}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4" />
            <span>{new Date(classDetails.start_date).toLocaleDateString()}</span>
            {classDetails.end_date && (
              <>
                <span> - </span>
                <span>{new Date(classDetails.end_date).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/teacher/students/class/${classId}/edit`}>Edit Class</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/teacher/students/class/${classId}/invite`}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Students
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search students..." className="max-w-sm" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>{classDetails.students.length} students enrolled in this class</CardDescription>
            </CardHeader>
            <CardContent>
              {classDetails.students.length > 0 ? (
                <div className="space-y-4">
                  {classDetails.students.map(({ student }) => (
                    <div
                      key={student.id}
                      className="flex flex-col justify-between rounded-md border p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.profile_image_url || "/placeholder.svg"} alt={student.name || ""} />
                          <AvatarFallback>{student.name?.charAt(0) || "S"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                          {student.user_profile?.learning_style && (
                            <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {student.user_profile.learning_style}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/students/${student.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/teacher/students/${student.id}/message`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Message
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
                  <p className="mb-4 text-sm text-muted-foreground">Add students to this class</p>
                  <Button asChild>
                    <Link href={`/teacher/students/class/${classId}/invite`}>Add Students</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Assigned Courses</CardTitle>
                <CardDescription>{classDetails.courses.length} courses assigned to this class</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0" asChild>
                <Link href={`/teacher/students/class/${classId}/assign-course`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Assign Course
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {classDetails.courses.length > 0 ? (
                <div className="space-y-4">
                  {classDetails.courses.map(({ course }) => (
                    <div
                      key={course.id}
                      className="flex flex-col justify-between rounded-md border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.level}</p>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/content/courses/${course.id}`}>View Course</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/teacher/analytics/course/${course.id}/class/${classId}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            Progress
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No courses assigned</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Assign courses to this class</p>
                  <Button asChild>
                    <Link href={`/teacher/students/class/${classId}/assign-course`}>Assign Course</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Recent announcements for this class</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0" asChild>
                <Link href={`/teacher/students/class/${classId}/announcements/new`}>
                  <Mail className="mr-2 h-4 w-4" />
                  New Announcement
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {classDetails.announcements.length > 0 ? (
                <div className="space-y-4">
                  {classDetails.announcements.map((announcement) => (
                    <div key={announcement.id} className="rounded-md border p-4">
                      <h3 className="font-medium">{announcement.title}</h3>
                      <p className="mt-1 text-sm">{announcement.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Posted on {new Date(announcement.created_at).toLocaleDateString()} at{" "}
                        {new Date(announcement.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <Button variant="outline" asChild>
                      <Link href={`/teacher/students/class/${classId}/announcements`}>View All Announcements</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <Mail className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No announcements yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Create your first announcement</p>
                  <Button asChild>
                    <Link href={`/teacher/students/class/${classId}/announcements/new`}>Create Announcement</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Analytics</CardTitle>
              <CardDescription>Performance and engagement metrics for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Analytics Dashboard</h3>
                <p className="mb-4 text-sm text-muted-foreground">View detailed analytics for this class</p>
                <Button asChild>
                  <Link href={`/teacher/analytics/class/${classId}`}>View Analytics</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
