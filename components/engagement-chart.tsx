"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface EngagementChartProps {
  data: {
    name: string
    completed: number
    inProgress: number
    notStarted: number
  }[]
  title?: string
  description?: string
}

export function EngagementChart({
  data,
  title = "Student Engagement",
  description = "Lesson completion status across classes",
}: EngagementChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            inProgress: {
              label: "In Progress",
              color: "hsl(var(--chart-2))",
            },
            notStarted: {
              label: "Not Started",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="completed" fill="var(--color-completed)" stackId="a" />
              <Bar dataKey="inProgress" fill="var(--color-inProgress)" stackId="a" />
              <Bar dataKey="notStarted" fill="var(--color-notStarted)" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
