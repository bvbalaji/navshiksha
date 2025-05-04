import { BookOpen, Users, BarChart, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StatsCard } from "@/components/teacher/dashboard/stats-card"
import { RecentActivities } from "@/components/teacher/dashboard/recent-activities"

export default async function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <Button asChild>
          <Link href="/teacher/content/create">Create New Content</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value="256"
          description="12% increase from last month"
          trend="up"
          trendValue="12%"
          icon={<Users className="h-4 w-4" />}
        />

        <StatsCard
          title="Active Courses"
          value="8"
          description="2 new courses this month"
          trend="up"
          trendValue="25%"
          icon={<BookOpen className="h-4 w-4" />}
        />

        <StatsCard
          title="Completion Rate"
          value="68%"
          description="3% decrease from last month"
          trend="down"
          trendValue="3%"
          icon={<BarChart className="h-4 w-4" />}
        />

        <StatsCard
          title="Learning Plans"
          value="12"
          description="Same as last month"
          trend="neutral"
          trendValue="0%"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="activities">
        <TabsList>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="classes">Recent Classes</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Activities</CardTitle>
              <CardDescription>Recent activities from your students</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivities />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Classes</CardTitle>
              <CardDescription>Your most recent classes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Class information will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Your most recent announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">Announcement information will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
