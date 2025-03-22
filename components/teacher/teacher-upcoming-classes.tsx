import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Video } from "lucide-react"
import Link from "next/link"

export default function TeacherUpcomingClasses() {
  const classes = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      time: "Today, 10:00 AM - 11:30 AM",
      students: 24,
      type: "In-person",
      location: "Room 203",
    },
    {
      id: 2,
      title: "Advanced Calculus",
      time: "Today, 2:00 PM - 3:30 PM",
      students: 18,
      type: "Virtual",
      location: "Zoom",
    },
    {
      id: 3,
      title: "Geometry Basics",
      time: "Tomorrow, 9:00 AM - 10:30 AM",
      students: 22,
      type: "In-person",
      location: "Room 105",
    },
    {
      id: 4,
      title: "Statistics Workshop",
      time: "Tomorrow, 1:00 PM - 2:30 PM",
      students: 15,
      type: "Virtual",
      location: "Google Meet",
    },
  ]

  return (
    <div className="space-y-4">
      {classes.map((cls) => (
        <Card key={cls.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold">{cls.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{cls.time}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{cls.students} students</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  {cls.type === "Virtual" ? <Video className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                  <span>
                    {cls.type} • {cls.location}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/teacher/classes/${cls.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                {cls.type === "Virtual" && <Button size="sm">Start Class</Button>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

