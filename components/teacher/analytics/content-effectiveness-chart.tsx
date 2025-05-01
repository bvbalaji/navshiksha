"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// Sample data - in a real app, this would come from props
const data = [
  { name: "Video Lessons", effectiveness: 85, engagement: 78 },
  { name: "Interactive", effectiveness: 92, engagement: 95 },
  { name: "Text Content", effectiveness: 65, engagement: 60 },
  { name: "Quizzes", effectiveness: 88, engagement: 75 },
  { name: "Discussions", effectiveness: 72, engagement: 82 },
]

export function ContentEffectivenessChart() {
  return (
    <ChartContainer
      config={{
        effectiveness: {
          label: "Learning Effectiveness",
          color: "hsl(var(--chart-1))",
        },
        engagement: {
          label: "Student Engagement",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar dataKey="effectiveness" fill="var(--color-effectiveness)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="engagement" fill="var(--color-engagement)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
