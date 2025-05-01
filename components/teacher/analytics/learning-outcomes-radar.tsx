"use client"

import { ChartContainer } from "@/components/ui/chart"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts"

// Sample data - in a real app, this would come from props
const data = [
  { subject: "Critical Thinking", A: 85, B: 65, fullMark: 100 },
  { subject: "Problem Solving", A: 78, B: 60, fullMark: 100 },
  { subject: "Communication", A: 72, B: 68, fullMark: 100 },
  { subject: "Collaboration", A: 80, B: 70, fullMark: 100 },
  { subject: "Creativity", A: 75, B: 62, fullMark: 100 },
  { subject: "Research", A: 82, B: 65, fullMark: 100 },
]

export function LearningOutcomesRadar() {
  return (
    <ChartContainer
      config={{
        A: {
          label: "Current",
          color: "hsl(var(--chart-1))",
        },
        B: {
          label: "Previous",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Current" dataKey="A" stroke="var(--color-A)" fill="var(--color-A)" fillOpacity={0.6} />
          <Radar name="Previous" dataKey="B" stroke="var(--color-B)" fill="var(--color-B)" fillOpacity={0.6} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
