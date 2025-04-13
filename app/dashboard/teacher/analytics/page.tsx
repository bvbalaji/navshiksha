"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, Users, Clock, BookOpen, BrainCircuit } from "lucide-react"

// Mock data for demonstration
const studentEngagementData = [
  { date: "2023-04-01", activeStudents: 24, averageSessionTime: 28, questionsAnswered: 156 },
  { date: "2023-04-02", activeStudents: 27, averageSessionTime: 32, questionsAnswered: 187 },
  { date: "2023-04-03", activeStudents: 25, averageSessionTime: 30, questionsAnswered: 163 },
  { date: "2023-04-04", activeStudents: 29, averageSessionTime: 35, questionsAnswered: 201 },
  { date: "2023-04-05", activeStudents: 31, averageSessionTime: 33, questionsAnswered: 215 },
  { date: "2023-04-06", activeStudents: 28, averageSessionTime: 31, questionsAnswered: 192 },
  { date: "2023-04-07", activeStudents: 26, averageSessionTime: 29, questionsAnswered: 178 },
]

const topicPerformanceData = [
  { topic: "Algebra", averageScore: 78, completionRate: 82, studentCount: 23 },
  { topic: "Geometry", averageScore: 72, completionRate: 75, studentCount: 21 },
  { topic: "Calculus", averageScore: 68, completionRate: 65, studentCount: 18 },
  { topic: "Statistics", averageScore: 81, completionRate: 79, studentCount: 20 },
  { topic: "Trigonometry", averageScore: 74, completionRate: 71, studentCount: 19 },
]

const studentProgressData = [
  {
    id: 1,
    name: "Alex Johnson",
    overallProgress: 78,
    recentActivity: "Completed Algebra Quiz",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Maria Garcia",
    overallProgress: 92,
    recentActivity: "Finished Calculus Module",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "James Wilson",
    overallProgress: 65,
    recentActivity: "Started Geometry Lessons",
    lastActive: "3 hours ago",
  },
  {
    id: 4,
    name: "Sophia Chen",
    overallProgress: 88,
    recentActivity: "Completed Practice Problems",
    lastActive: "5 hours ago",
  },
  {
    id: 5,
    name: "Ethan Brown",
    overallProgress: 71,
    recentActivity: "Reviewed Statistics Notes",
    lastActive: "1 hour ago",
  },
]

export default function TeacherAnalytics() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCourse, setSelectedCourse] = useState("all")

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor student engagement and performance across your courses.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="history">History</SelectItem>
              <SelectItem value="language">Language Arts</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">31 min</div>
            <p className="text-xs text-muted-foreground">+4% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tutor Usage</CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">184</div>
            <p className="text-xs text-muted-foreground">+23% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Student Engagement</TabsTrigger>
          <TabsTrigger value="performance">Topic Performance</TabsTrigger>
          <TabsTrigger value="progress">Individual Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Student Engagement</CardTitle>
              <CardDescription>Track active students, session times, and questions answered over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] border-b border-t flex items-center justify-center text-muted-foreground">
                Chart visualization would go here showing engagement metrics over time
              </div>

              <div className="mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Active Students</th>
                      <th className="text-left py-2">Avg. Session (min)</th>
                      <th className="text-left py-2">Questions Answered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentEngagementData.map((day) => (
                      <tr key={day.date} className="border-b">
                        <td className="py-2">{day.date}</td>
                        <td className="py-2">{day.activeStudents}</td>
                        <td className="py-2">{day.averageSessionTime}</td>
                        <td className="py-2">{day.questionsAnswered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topic Performance Analysis</CardTitle>
              <CardDescription>Compare student performance across different topics.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] border-b border-t flex items-center justify-center text-muted-foreground">
                Chart visualization would go here showing performance by topic
              </div>

              <div className="mt-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Topic</th>
                      <th className="text-left py-2">Avg. Score</th>
                      <th className="text-left py-2">Completion Rate</th>
                      <th className="text-left py-2">Student Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topicPerformanceData.map((topic) => (
                      <tr key={topic.topic} className="border-b">
                        <td className="py-2">{topic.topic}</td>
                        <td className="py-2">{topic.averageScore}%</td>
                        <td className="py-2">{topic.completionRate}%</td>
                        <td className="py-2">{topic.studentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Student Progress</CardTitle>
              <CardDescription>Track progress and recent activity for each student.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studentProgressData.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <h3 className="font-medium">{student.name}</h3>
                      <span className="text-sm text-muted-foreground">Last active: {student.lastActive}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Progress</span>
                        <span className="text-sm font-medium">{student.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${student.overallProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Recent activity: {student.recentActivity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
