"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface PerformanceChartProps {
  data: {
    name: string
    average: number
    best: number
    worst: number
  }[]
  title?: string
  description?: string
}

export function PerformanceChart({
  data,
  title = "Student Performance",
  description = "Average, best, and worst scores over time",
}: PerformanceChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            average: {
              label: "Class Average",
              color: "hsl(var(--chart-1))",
            },
            best: {
              label: "Best Score",
              color: "hsl(var(--chart-2))",
            },
            worst: {
              label: "Lowest Score",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="var(--color-average)" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="best" stroke="var(--color-best)" />
              <Line type="monotone" dataKey="worst" stroke="var(--color-worst)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
