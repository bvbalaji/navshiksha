import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Star } from "lucide-react"

export default function RecommendedCourses() {
  const courses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      description: "Calculus, linear algebra, and more",
      level: "Advanced",
      duration: "8 weeks",
      rating: 4.8,
      match: "Based on your algebra progress",
    },
    {
      id: 2,
      title: "Creative Writing",
      description: "Develop your storytelling skills",
      level: "Intermediate",
      duration: "6 weeks",
      rating: 4.6,
      match: "Recommended for your interests",
    },
    {
      id: 3,
      title: "Physics Fundamentals",
      description: "Mechanics, thermodynamics, and waves",
      level: "Beginner",
      duration: "10 weeks",
      rating: 4.9,
      match: "Complements your math courses",
    },
  ]

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{course.title}</CardTitle>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {course.level}
              </Badge>
            </div>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span>12 lessons</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-primary">{course.match}</div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Enroll Now</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

