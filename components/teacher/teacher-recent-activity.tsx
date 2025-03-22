import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, CheckCircle, MessageSquare, UserPlus } from "lucide-react"

export default function TeacherRecentActivity() {
  const activities = [
    {
      id: 1,
      type: "assignment",
      title: "Graded Assignment",
      description: 'You graded 15 submissions for "Quadratic Equations Quiz"',
      time: "2 hours ago",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      id: 2,
      type: "content",
      title: "Created Content",
      description: 'You created a new lesson "Introduction to Trigonometry"',
      time: "Yesterday",
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 3,
      type: "student",
      title: "New Student",
      description: 'Emma Thompson joined your "Advanced Algebra" course',
      time: "2 days ago",
      icon: <UserPlus className="h-5 w-5 text-purple-500" />,
    },
    {
      id: 4,
      type: "feedback",
      title: "Provided Feedback",
      description: "You provided detailed feedback to Michael Chen on his project",
      time: "3 days ago",
      icon: <MessageSquare className="h-5 w-5 text-amber-500" />,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">{activity.icon}</div>
              <div>
                <h3 className="font-semibold">{activity.title}</h3>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

