import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Activity {
  id: string
  user: {
    name: string
    avatar?: string
  }
  action: string
  target: string
  date: string
  time: string
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Rahul Sharma",
      avatar: "/diverse-students-studying.png",
    },
    action: "completed",
    target: "Mathematics Quiz 3",
    date: "Today",
    time: "2:30 PM",
  },
  {
    id: "2",
    user: {
      name: "Priya Patel",
      avatar: "/diverse-students-studying.png",
    },
    action: "submitted",
    target: "Science Project",
    date: "Today",
    time: "11:45 AM",
  },
  {
    id: "3",
    user: {
      name: "Arjun Kumar",
      avatar: "/diverse-students-studying.png",
    },
    action: "asked a question in",
    target: "History Forum",
    date: "Yesterday",
    time: "4:15 PM",
  },
  {
    id: "4",
    user: {
      name: "Ananya Singh",
      avatar: "/diverse-students-studying.png",
    },
    action: "joined",
    target: "English Literature Class",
    date: "Yesterday",
    time: "10:20 AM",
  },
  {
    id: "5",
    user: {
      name: "Vikram Mehta",
      avatar: "/diverse-students-studying.png",
    },
    action: "achieved badge in",
    target: "Computer Science",
    date: "2 days ago",
    time: "3:50 PM",
  },
]

export interface RecentActivitiesProps {
  activities?: Activity[]
  limit?: number
  className?: string
}

export function RecentActivities({ activities = defaultActivities, limit = 5, className }: RecentActivitiesProps) {
  const displayActivities = activities.slice(0, limit)

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
              <span className="font-medium text-muted-foreground">{activity.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.date} at {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
