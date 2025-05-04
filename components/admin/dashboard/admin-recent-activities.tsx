import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, FileEdit, Trash2, LogIn, Settings, Database, AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

interface Activity {
  id: string
  user?: {
    name: string
    email: string
    avatar?: string
  }
  action: string
  target: string
  timestamp: string
  type: "user" | "system" | "security" | "data"
  icon?: ReactNode
}

const defaultActivities: Activity[] = [
  {
    id: "1",
    user: {
      name: "Admin User",
      email: "admin@navshiksha.org",
      avatar: "",
    },
    action: "created",
    target: "a new teacher account",
    timestamp: "10 minutes ago",
    type: "user",
    icon: <UserPlus className="h-4 w-4" />,
  },
  {
    id: "2",
    action: "Database backup",
    target: "completed successfully",
    timestamp: "1 hour ago",
    type: "system",
    icon: <Database className="h-4 w-4" />,
  },
  {
    id: "3",
    user: {
      name: "John Smith",
      email: "john.smith@navshiksha.org",
      avatar: "",
    },
    action: "logged in",
    target: "to the admin panel",
    timestamp: "2 hours ago",
    type: "security",
    icon: <LogIn className="h-4 w-4" />,
  },
  {
    id: "4",
    user: {
      name: "Admin User",
      email: "admin@navshiksha.org",
      avatar: "",
    },
    action: "updated",
    target: "system settings",
    timestamp: "3 hours ago",
    type: "system",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    id: "5",
    action: "Failed login attempt",
    target: "from IP 192.168.1.254",
    timestamp: "4 hours ago",
    type: "security",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "6",
    user: {
      name: "Admin User",
      email: "admin@navshiksha.org",
      avatar: "",
    },
    action: "deleted",
    target: "a course",
    timestamp: "5 hours ago",
    type: "data",
    icon: <Trash2 className="h-4 w-4" />,
  },
]

interface AdminRecentActivitiesProps {
  activities?: Activity[]
  limit?: number
}

export function AdminRecentActivities({ activities = defaultActivities, limit = 10 }: AdminRecentActivitiesProps) {
  const displayActivities = activities.slice(0, limit)

  const getTypeColor = (type: Activity["type"]) => {
    switch (type) {
      case "user":
        return "bg-blue-500"
      case "system":
        return "bg-purple-500"
      case "security":
        return "bg-red-500"
      case "data":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className={`mt-1 rounded-full p-1 ${getTypeColor(activity.type)}`}>
            {activity.icon || <FileEdit className="h-4 w-4 text-white" />}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              {activity.user ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{activity.user.name}</span>
                </div>
              ) : (
                <span className="font-medium">System</span>
              )}
              <span className="text-sm text-muted-foreground">{activity.action}</span>
              <span className="text-sm">{activity.target}</span>
            </div>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
        </div>
      ))}
      {activities.length > limit && (
        <div className="pt-2 text-center">
          <button className="text-sm text-primary hover:underline">View all activities</button>
        </div>
      )}
    </div>
  )
}
