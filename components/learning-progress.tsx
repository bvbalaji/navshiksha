import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function LearningProgress() {
  const courses = [
    {
      id: 1,
      title: "Introduction to Algebra",
      progress: 75,
      lastActivity: "2 hours ago",
      nextLesson: "Solving Quadratic Equations",
    },
    {
      id: 2,
      title: "World History: Ancient Civilizations",
      progress: 45,
      lastActivity: "Yesterday",
      nextLesson: "The Rise of Rome",
    },
    {
      id: 3,
      title: "Biology Fundamentals",
      progress: 30,
      lastActivity: "3 days ago",
      nextLesson: "Cell Structure and Function",
    },
  ]

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader className="pb-2">
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>Last activity: {course.lastActivity}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">{course.progress}% complete</span>
              <span className="text-sm text-gray-500">Next: {course.nextLesson}</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

