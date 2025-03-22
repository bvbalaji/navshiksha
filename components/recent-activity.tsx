import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react"

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completion",
      title: "Completed Lesson",
      description: "Introduction to Algebraic Expressions",
      time: "2 hours ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: 2,
      type: "achievement",
      title: "Earned Achievement",
      description: "Quick Learner: Complete 5 lessons in a day",
      time: "Yesterday",
      icon: <Trophy className="h-5 w-5 text-amber-500" />,
    },
    {
      id: 3,
      type: "started",
      title: "Started New Course",
      description: "World History: Ancient Civilizations",
      time: "3 days ago",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 4,
      type: "practice",
      title: "Practice Session",
      description: "Algebra Problem Set #3",
      time: "4 days ago",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              {activity.icon}
              <div>
                <CardTitle className="text-base">{activity.title}</CardTitle>
                <CardDescription>{activity.time}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p>{activity.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

