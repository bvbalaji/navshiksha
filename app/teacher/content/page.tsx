import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PrismaClient } from "@prisma/client"
import { requireRole } from "@/lib/auth/auth"
import Link from "next/link"
import { BookOpen, FileText, Plus, Edit, Eye, Archive } from "lucide-react"

const prisma = new PrismaClient()

async function getTeacherCourses(teacherId: string) {
  return prisma.course.findMany({
    where: { creator_id: teacherId },
    orderBy: { updated_at: "desc" },
    include: {
      subject: true,
      _count: {
        select: { modules: true, enrollments: true },
      },
    },
  })
}

async function getTeacherResources(teacherId: string) {
  return prisma.resource.findMany({
    where: { created_by: teacherId },
    orderBy: { created_at: "desc" },
    take: 10,
  })
}

export default async function ContentCreationPage() {
  const session = await requireRole(["TEACHER", "ADMIN"])
  const teacherId = session.user.id

  const courses = await getTeacherCourses(teacherId)
  const resources = await getTeacherResources(teacherId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Creation</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/teacher/content/create-course">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/content/create-resource">
              <Plus className="mr-2 h-4 w-4" />
              New Resource
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4 pt-4">
          {courses.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${course.is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <CardDescription>
                      {course.subject.name} • {course.level}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {course.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course._count.modules} modules</span>
                      </div>
                      <div>{course._count.enrollments} enrollments</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/teacher/content/edit-course/${course.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No courses yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">Create your first course to start teaching</p>
              <Button asChild>
                <Link href="/teacher/content/create-course">Create Course</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Resources</CardTitle>
              <CardDescription>Manage your uploaded resources</CardDescription>
            </CardHeader>
            <CardContent>
              {resources.length > 0 ? (
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-xs text-muted-foreground">{resource.resource_type}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No resources yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Upload resources to use in your courses</p>
                  <Button asChild>
                    <Link href="/teacher/content/create-resource">Upload Resource</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quizzes & Assessments</CardTitle>
              <CardDescription>Create and manage assessments for your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">Quiz Management</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Quizzes are created within courses. Go to a course to create or manage quizzes.
                </p>
                <Button asChild>
                  <Link href="/teacher/content">View Courses</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
