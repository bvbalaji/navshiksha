"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

interface StudentPerformanceOverviewProps {
  studentId: string
}

export function StudentPerformanceOverview({ studentId }: StudentPerformanceOverviewProps) {
  const [loading, setLoading] = useState(true)
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // fetch(`/api/teacher/students/${studentId}/performance`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setPerformanceData(data)
    //     setLoading(false)
    //   })
    //   .catch(err => {
    //     console.error("Error fetching student performance:", err)
    //     setLoading(false)
    //   })

    // Simulate API call with mock data
    setTimeout(() => {
      setPerformanceData({
        quizScores: [
          { date: "Jan", score: 65 },
          { date: "Feb", score: 72 },
          { date: "Mar", score: 78 },
          { date: "Apr", score: 85 },
          { date: "May", score: 82 },
          { date: "Jun", score: 90 },
        ],
        subjectPerformance: [
          { subject: "Math", score: 85 },
          { subject: "Science", score: 78 },
          { subject: "English", score: 92 },
          { subject: "History", score: 65 },
        ],
        strengths: ["Problem Solving", "Critical Thinking", "Research Skills"],
        weaknesses: ["Time Management", "Geometry Concepts"],
        engagementData: [
          { week: "Week 1", engagement: 75 },
          { week: "Week 2", engagement: 82 },
          { week: "Week 3", engagement: 78 },
          { week: "Week 4", engagement: 90 },
          { week: "Week 5", engagement: 85 },
          { week: "Week 6", engagement: 88 },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [studentId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Loading student performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
        <CardDescription>Student's academic performance and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="mb-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-4">
            <div className="h-[250px]">
              <ChartContainer
                config={{
                  score: {
                    label: "Quiz Score",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.quizScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--color-score)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium">Strengths</h4>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {performanceData.strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Areas for Improvement</h4>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  {performanceData.weaknesses.map((weakness: string, index: number) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects">
            <div className="h-[250px]">
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData.subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="h-[250px]">
              <ChartContainer
                config={{
                  engagement: {
                    label: "Engagement Score",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData.engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="var(--color-engagement)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
