"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  type: "course" | "assignment" | "quiz" | "discussion" | "grade"
  title: string
  course: string
  timestamp: Date
  status?: string
  score?: string
}

// Sample data
const defaultActivities: Activity[] = [
  {
    id: "1",
    type: "assignment",
    title: "Submitted Physics Lab Report",
    course: "Physics 101",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "Submitted",
  },
  {
    id: "2",
    type: "quiz",
    title: "Completed Weekly Quiz",
    course: "Mathematics",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    score: "85%",
  },
  {
    id: "3",
    type: "course",
    title: "Started new module",
    course: "Introduction to Programming",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    type: "discussion",
    title: "Posted in discussion forum",
    course: "World History",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
  },
  {
    id: "5",
    type: "grade",
    title: "Received grade for essay",
    course: "English Literature",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    score: "A-",
  },
  {
    id: "6",
    type: "assignment",
    title: "Started research paper",
    course: "Biology",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    status: "In Progress",
  },
]

interface StudentRecentActivitiesProps {
  activities?: Activity[]
  limit?: number
}

export function StudentRecentActivities({ activities = defaultActivities, limit = 5 }: StudentRecentActivitiesProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedActivities = showAll ? activities : activities.slice(0, limit)

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "course":
        return "C"
      case "assignment":
        return "A"
      case "quiz":
        return "Q"
      case "discussion":
        return "D"
      case "grade":
        return "G"
      default:
        return "•"
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "course":
        return "bg-blue-100 text-blue-700"
      case "assignment":
        return "bg-purple-100 text-purple-700"
      case "quiz":
        return "bg-green-100 text-green-700"
      case "discussion":
        return "bg-yellow-100 text-yellow-700"
      case "grade":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedActivities.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No recent activities</p>
        ) : (
          <>
            <div className="space-y-4">
              {displayedActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <Avatar className={cn("h-9 w-9", getActivityColor(activity.type))}>
                    <AvatarFallback>{getActivityIcon(activity.type)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.course}
                      {activity.status && ` • ${activity.status}`}
                      {activity.score && ` • Score: ${activity.score}`}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>

            {activities.length > limit && (
              <Button variant="ghost" className="w-full" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show Less" : `Show All (${activities.length})`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to combine class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
