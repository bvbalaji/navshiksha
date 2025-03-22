import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Calendar, Clock, FileText, Mail, MessageSquare, TrendingDown, User } from "lucide-react"
import Link from "next/link"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the student data based on the ID
  const student = {
    id: params.id,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "(555) 123-4567",
    enrollmentDate: "September 5, 2023",
    progress: "At Risk",
    performance: "declining",
    courses: [
      {
        id: 1,
        title: "Algebra Fundamentals",
        progress: 45,
        lastActivity: "2 days ago",
        grade: "C",
      },
      {
        id: 2,
        title: "Introduction to Geometry",
        progress: 30,
        lastActivity: "1 week ago",
        grade: "D",
      },
      {
        id: 3,
        title: "Basic Statistics",
        progress: 60,
        lastActivity: "3 days ago",
        grade: "B-",
      },
    ],
    assignments: [
      {
        id: 1,
        title: "Quadratic Equations Quiz",
        course: "Algebra Fundamentals",
        dueDate: "Oct 15, 2023",
        status: "Submitted",
        grade: "72/100",
      },
      {
        id: 2,
        title: "Geometry Proofs Assignment",
        course: "Introduction to Geometry",
        dueDate: "Oct 10, 2023",
        status: "Late",
        grade: "65/100",
      },
      {
        id: 3,
        title: "Statistical Analysis Project",
        course: "Basic Statistics",
        dueDate: "Oct 20, 2023",
        status: "Not Started",
        grade: "N/A",
      },
    ],
    activity: [
      {
        id: 1,
        type: "login",
        description: "Logged into the platform",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "assignment",
        description: "Viewed Quadratic Equations Quiz",
        time: "3 hours ago",
      },
      {
        id: 3,
        type: "course",
        description: "Watched video lesson in Algebra Fundamentals",
        time: "1 day ago",
      },
      {
        id: 4,
        type: "message",
        description: "Sent message to instructor",
        time: "2 days ago",
      },
    ],
    notes: [
      {
        id: 1,
        date: "Oct 5, 2023",
        author: "Sarah Smith",
        content:
          "Michael is struggling with algebraic concepts. Recommended additional practice problems and one-on-one tutoring.",
      },
      {
        id: 2,
        date: "Sep 20, 2023",
        author: "Sarah Smith",
        content:
          "Discussed study strategies with Michael. He committed to spending more time on homework and attending office hours.",
      },
    ],
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/dashboard/teacher/students"
          className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Students
        </Link>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-gray-500">Student Profile</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center justify-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-12 w-12" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{student.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{student.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
                <p>{student.enrollmentDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Progress Status</p>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {student.progress}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Performance Trend</p>
                <div className="mt-1 flex items-center gap-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="capitalize">{student.performance}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="p-6">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="mt-6 space-y-4">
                {student.courses.map((course) => (
                  <div key={course.id} className="rounded-lg border p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Last activity: {course.lastActivity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span>Grade: {course.grade}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="assignments" className="mt-6 space-y-4">
                {student.assignments.map((assignment) => (
                  <div key={assignment.id} className="rounded-lg border p-4">
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                      <div>
                        <h3 className="font-semibold">{assignment.title}</h3>
                        <p className="text-sm text-gray-500">{assignment.course}</p>
                        <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {assignment.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={
                            assignment.status === "Submitted"
                              ? "bg-green-100 text-green-800"
                              : assignment.status === "Late"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {assignment.status}
                        </Badge>
                        <div className="text-right">
                          <p className="font-medium">{assignment.grade}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="activity" className="mt-6 space-y-4">
                {student.activity.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        {item.type === "login" ? (
                          <User className="h-4 w-4 text-primary" />
                        ) : item.type === "assignment" ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : item.type === "course" ? (
                          <BookOpen className="h-4 w-4 text-primary" />
                        ) : (
                          <MessageSquare className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <p>{item.description}</p>
                        <p className="text-sm text-gray-500">{item.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Teacher Notes</CardTitle>
          <CardDescription>Private notes about this student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {student.notes.map((note) => (
              <div key={note.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium">{note.author}</p>
                  <p className="text-sm text-gray-500">{note.date}</p>
                </div>
                <p>{note.content}</p>
              </div>
            ))}
            <div className="mt-4">
              <Button>Add Note</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

