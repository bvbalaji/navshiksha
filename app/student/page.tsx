import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentStatsCard } from "@/components/student/dashboard/student-stats-card"
import { StudentRecentActivities } from "@/components/student/dashboard/student-recent-activities"
import { BookOpen, Clock, Award, Calendar } from "lucide-react"

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight"> Student Dashboard</h1>          
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StudentStatsCard
          title="Active Courses"
          value="4"
          description="2 courses in progress"
          trend="neutral"
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StudentStatsCard
          title="Completed Courses"
          value="12"
          description="3 more than last semester"
          trend="up"
          trendValue="25%"
          icon={<Award className="h-4 w-4" />}
        />
        <StudentStatsCard
          title="Study Hours"
          value="32"
          description="This week"
          trend="up"
          trendValue="8%"
          icon={<Clock className="h-4 w-4" />}
        />
        <StudentStatsCard
          title="Upcoming Deadlines"
          value="5"
          description="Next 7 days"
          trend="down"
          trendValue="2"
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="space-y-4">
          <StudentRecentActivities />
        </TabsContent>
        <TabsContent value="assignments" className="space-y-4">
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium">Upcoming Assignments</h3>
            <p className="text-sm text-muted-foreground">You have 5 assignments due in the next 7 days.</p>
          </div>
        </TabsContent>
        <TabsContent value="progress" className="space-y-4">
          <div className="rounded-lg border p-8 text-center">
            <h3 className="text-lg font-medium">Learning Progress</h3>
            <p className="text-sm text-muted-foreground">You're making great progress! Keep it up.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
