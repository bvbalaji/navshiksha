import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Play } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"

export default function CoursesPage() {
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Algebra",
      description: "Learn the fundamentals of algebra",
      progress: 75,
      lastActivity: "2 hours ago",
      lessons: 12,
      duration: "6 weeks",
    },
    {
      id: 2,
      title: "World History: Ancient Civilizations",
      description: "Explore the ancient world from Mesopotamia to Rome",
      progress: 45,
      lastActivity: "Yesterday",
      lessons: 15,
      duration: "8 weeks",
    },
    {
      id: 3,
      title: "Biology Fundamentals",
      description: "Understanding the basics of living organisms",
      progress: 30,
      lastActivity: "3 days ago",
      lessons: 10,
      duration: "5 weeks",
    },
  ]

  const completedCourses = [
    {
      id: 4,
      title: "Basic Mathematics",
      description: "Arithmetic, fractions, and decimals",
      completedDate: "2 months ago",
      lessons: 8,
      duration: "4 weeks",
    },
    {
      id: 5,
      title: "Introduction to Literature",
      description: "Exploring classic and contemporary works",
      completedDate: "3 months ago",
      lessons: 10,
      duration: "6 weeks",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-gray-500">Manage your enrolled and completed courses</p>
          </div>

          <Tabs defaultValue="enrolled" className="w-full">
            <TabsList className="mb-6 w-full max-w-md">
              <TabsTrigger value="enrolled" className="flex-1">
                Enrolled
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enrolled">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>{course.progress}% complete</span>
                          <span className="text-gray-500">Last activity: {course.lastActivity}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.lessons} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Completed {course.completedDate}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Review Course
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

