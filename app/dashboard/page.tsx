"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Brain, BookOpen, BarChart, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LogoutButton } from "@/components/logout-button"
import { redirect } from "next/navigation"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Protect the dashboard - redirect if not authenticated
  if (status === "unauthenticated") {
    redirect("/login")
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const userName = session?.user?.name || "Student"

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center gap-2 md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-2 py-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold">Navshiksha</span>
                  </div>
                  <nav className="flex-1 space-y-2 py-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="h-4 w-4" />
                      My Learning
                    </Link>
                    <Link
                      href="/dashboard/progress"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BarChart className="h-4 w-4" />
                      Progress
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </nav>
                  <div className="border-t py-4">
                    <LogoutButton variant="ghost" className="w-full justify-start" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5" />
            <span className="text-lg font-bold">Navshiksha</span>
          </div>
          <nav className="hidden md:ml-8 md:flex md:items-center md:gap-6">
            <Link href="/dashboard" className="text-sm font-medium">
              My Learning
            </Link>
            <Link href="/dashboard/progress" className="text-sm font-medium text-muted-foreground">
              Progress
            </Link>
            <Link href="/dashboard/settings" className="text-sm font-medium text-muted-foreground">
              Settings
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
            <p className="text-muted-foreground">Continue your learning journey where you left off.</p>
          </div>
          <Tabs defaultValue="current">
            <TabsList className="mb-6 w-full overflow-x-auto">
              <TabsTrigger value="current">Current Courses</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col">
                    <CardHeader className="pb-2">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} />
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">Continue</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="recommended" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{course.duration}</span>
                        <span className="text-sm font-medium">{course.level}</span>
                      </div>
                      <Button className="mt-4 w-full">Enroll Now</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {completedCourses.map((course) => (
                  <Card key={course.id} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completed on {course.completedDate}</span>
                        <span className="text-sm font-medium text-green-500">100%</span>
                      </div>
                      <div className="mt-4 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Certificate
                        </Button>
                        <Button variant="secondary" size="sm">
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

const currentCourses = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    description: "Master the basics of algebraic equations and expressions",
    progress: 65,
  },
  {
    id: 2,
    title: "Physics: Mechanics",
    description: "Learn about forces, motion, and energy in physical systems",
    progress: 42,
  },
  {
    id: 3,
    title: "English Literature",
    description: "Analyze classic works and develop critical reading skills",
    progress: 78,
  },
]

const recommendedCourses = [
  {
    id: 4,
    title: "Calculus I",
    description: "Introduction to differential calculus and its applications",
    duration: "8 weeks",
    level: "Intermediate",
  },
  {
    id: 5,
    title: "Chemistry Basics",
    description: "Explore atoms, molecules, and chemical reactions",
    duration: "6 weeks",
    level: "Beginner",
  },
  {
    id: 6,
    title: "World History",
    description: "Survey of major historical events and civilizations",
    duration: "10 weeks",
    level: "All levels",
  },
]

const completedCourses = [
  {
    id: 7,
    title: "Pre-Algebra",
    description: "Foundation for algebraic concepts and problem-solving",
    completedDate: "Mar 15, 2023",
  },
  {
    id: 8,
    title: "Biology: Cells",
    description: "Study of cell structure, function, and processes",
    completedDate: "Jan 22, 2023",
  },
]
