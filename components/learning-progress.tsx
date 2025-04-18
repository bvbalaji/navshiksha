"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Clock, ArrowUpRight } from "lucide-react"

interface ProgressItemProps {
  title: string
  progress: number
  lastActivity?: string
  badges?: string[]
}

function ProgressItem({ title, progress, lastActivity, badges }: ProgressItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="font-medium">{title}</div>
        <div className="text-sm text-muted-foreground">{progress}% complete</div>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between items-center text-sm">
        {lastActivity && <div className="text-muted-foreground">{lastActivity}</div>}
        <div className="flex gap-2">
          {badges?.map((badge) => (
            <Badge key={badge} variant="outline">
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function LearningProgress() {
  const [activeTab, setActiveTab] = useState("courses")

  // Mock data
  const courseProgress = [
    {
      title: "Introduction to Algebra",
      progress: 75,
      lastActivity: "Last studied 2 days ago",
      badges: ["Math", "In Progress"],
    },
    {
      title: "World History: Ancient Civilizations",
      progress: 32,
      lastActivity: "Last studied 1 week ago",
      badges: ["History", "In Progress"],
    },
    {
      title: "Basic Chemistry Concepts",
      progress: 100,
      lastActivity: "Completed on April 2, 2023",
      badges: ["Science", "Completed"],
    },
  ]

  const skillProgress = [
    {
      title: "Problem Solving",
      progress: 68,
      badges: ["Core Skill"],
    },
    {
      title: "Critical Thinking",
      progress: 82,
      badges: ["Core Skill"],
    },
    {
      title: "Mathematical Reasoning",
      progress: 59,
      badges: ["Subject Skill"],
    },
  ]

  const achievements = [
    {
      title: "Quick Learner",
      description: "Completed 5 lessons in a single day",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Perfect Score",
      description: "Achieved 100% on a quiz",
      icon: <Award className="h-8 w-8 text-primary" />,
    },
    {
      title: "Bookworm",
      description: "Read all recommended materials for a course",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
        <CardDescription>Track your progress across courses and skills</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {courseProgress.map((course) => (
              <ProgressItem
                key={course.title}
                title={course.title}
                progress={course.progress}
                lastActivity={course.lastActivity}
                badges={course.badges}
              />
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Courses <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {skillProgress.map((skill) => (
              <ProgressItem key={skill.title} title={skill.title} progress={skill.progress} badges={skill.badges} />
            ))}
            <Button variant="outline" className="w-full mt-4">
              View Skill Details <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {achievements.map((achievement) => (
              <div key={achievement.title} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="bg-muted rounded-full p-2">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Achievements <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
