import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Brain, FileText, LayoutDashboard, LineChart, Settings, Users } from "lucide-react"
import Link from "next/link"
import DashboardHeader from "@/components/dashboard-header"
import RecentActivity from "@/components/recent-activity"
import LearningProgress from "@/components/learning-progress"
import RecommendedCourses from "@/components/recommended-courses"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Redirect teachers to their dashboard
  // This is a backup check in case middleware didn't handle it
  if (session.user.role === "teacher") {
    redirect("/dashboard/teacher")
  }

  // Student dashboard content
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Brain className="h-5 w-5 text-primary" />
              <span>Naviksha</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold text-gray-500">Dashboard</h2>
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Overview
                </Link>
                <Link
                  href="/dashboard/courses"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <BookOpen className="h-4 w-4" />
                  My Courses
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <LineChart className="h-4 w-4" />
                  Progress
                </Link>
              </div>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold text-gray-500">Learning</h2>
              <div className="space-y-1">
                <Link
                  href="/dashboard/discover"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <FileText className="h-4 w-4" />
                  Discover
                </Link>
                <Link
                  href="/dashboard/ai-tutor"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <Brain className="h-4 w-4" />
                  AI Tutor
                </Link>
              </div>
            </div>
            <div className="px-4 py-2">
              <h2 className="mb-2 text-xs font-semibold text-gray-500">Account</h2>
              <div className="space-y-1">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <Users className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container max-w-6xl py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Welcome back, {session.user.name?.split(" ")[0] || "Student"}</h1>
              <p className="text-gray-500">Here's an overview of your learning journey</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Courses in Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-gray-500">2 courses ahead of schedule</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7 days</div>
                  <p className="text-xs text-gray-500">Keep it up!</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-gray-500">2 new this week</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="progress">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="progress">Learning Progress</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                  <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="progress" className="mt-4">
                  <LearningProgress />
                </TabsContent>
                <TabsContent value="recommended" className="mt-4">
                  <RecommendedCourses />
                </TabsContent>
                <TabsContent value="activity" className="mt-4">
                  <RecentActivity />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

