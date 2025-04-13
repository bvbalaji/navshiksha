"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, FileText } from "lucide-react"
import { LearningPlanCreator } from "@/components/teacher/learning-plan-creator"

export default function LearningPlansPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("create")

  // Mock data for saved plans
  const savedPlans = [
    {
      id: "plan-1",
      title: "Advanced Algebra Mastery",
      subject: "Mathematics",
      level: "Advanced",
      createdAt: "2023-04-10",
      assignedTo: 3,
    },
    {
      id: "plan-2",
      title: "Introduction to Scientific Method",
      subject: "Science",
      level: "Beginner",
      createdAt: "2023-04-08",
      assignedTo: 5,
    },
    {
      id: "plan-3",
      title: "World History: Ancient Civilizations",
      subject: "History",
      level: "Intermediate",
      createdAt: "2023-04-05",
      assignedTo: 2,
    },
  ]

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Plans</h1>
        <p className="text-muted-foreground">Create and manage personalized learning plans for your students.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create New Plan</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <LearningPlanCreator />
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Saved Learning Plans</CardTitle>
              <CardDescription>View and manage your previously created learning plans.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{plan.title}</h3>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span>{plan.subject}</span>
                        <span>•</span>
                        <span>{plan.level} Level</span>
                        <span>•</span>
                        <span>Created on {plan.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <UserPlus className="h-3 w-3" />
                        <span>Assigned to {plan.assignedTo} students</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/teacher/learning-plans/${plan.id}`)}
                      >
                        <FileText className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button variant="outline" size="sm">
                        <UserPlus className="h-4 w-4 mr-1" /> Assign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Learning Plan Templates</CardTitle>
              <CardDescription>Start with a template to quickly create personalized learning plans.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Mathematics Fundamentals", level: "Beginner", duration: "6 weeks" },
                  { title: "Advanced Scientific Inquiry", level: "Advanced", duration: "8 weeks" },
                  { title: "Language Arts Essentials", level: "Intermediate", duration: "10 weeks" },
                  { title: "Historical Analysis", level: "Advanced", duration: "12 weeks" },
                  { title: "Computer Science Basics", level: "Beginner", duration: "6 weeks" },
                  { title: "Critical Thinking Development", level: "All Levels", duration: "Ongoing" },
                ].map((template, index) => (
                  <Card key={index} className="border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Level: {template.level}</div>
                        <div>Duration: {template.duration}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("create")}>
                        Use Template
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
