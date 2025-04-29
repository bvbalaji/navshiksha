"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

// Mock data for recent activities
const mockActivities = [
  {
    id: 1,
    student: "Aisha Patel",
    activity: "Completed Physics Quiz",
    score: "85%",
    time: "2 hours ago",
  },
  {
    id: 2,
    student: "Raj Kumar",
    activity: "Submitted Math Assignment",
    score: "Pending",
    time: "3 hours ago",
  },
  {
    id: 3,
    student: "Priya Singh",
    activity: "Started Chemistry Course",
    score: "In Progress",
    time: "5 hours ago",
  },
  {
    id: 4,
    student: "Arjun Mehta",
    activity: "Completed Biology Lesson",
    score: "100%",
    time: "Yesterday",
  },
  {
    id: 5,
    student: "Neha Sharma",
    activity: "Joined Live Session",
    score: "Attended",
    time: "Yesterday",
  },
]

export default function RecentActivities() {
  const [activities] = useState(mockActivities)

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">{activity.student.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium">{activity.student}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{activity.activity}</p>
            </div>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-medium",
                activity.score === "Pending"
                  ? "text-yellow-500"
                  : activity.score === "In Progress"
                    ? "text-blue-500"
                    : activity.score === "Attended"
                      ? "text-green-500"
                      : "",
              )}
            >
              {activity.score}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
