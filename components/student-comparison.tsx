"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// Sample data - in a real app, this would come from props or an API
const students = [
  { id: "s1", name: "Alex Johnson" },
  { id: "s2", name: "Jamie Smith" },
  { id: "s3", name: "Taylor Brown" },
  { id: "s4", name: "Jordan Lee" },
  { id: "s5", name: "Casey Wilson" },
]

const generateComparisonData = (studentIds: string[]) => {
  const metrics = ["Quiz Scores", "Engagement", "Completion", "Participation", "Assignments"]

  return metrics.map((metric) => {
    const data: any = { name: metric }

    studentIds.forEach((id) => {
      // Generate random score between 60-100
      data[id] = Math.floor(Math.random() * 40) + 60
    })

    return data
  })
}

export function StudentComparison() {
  const [selectedStudents, setSelectedStudents] = useState<string[]>(["s1", "s2", "s3"])
  const [comparisonData, setComparisonData] = useState(() => generateComparisonData(["s1", "s2", "s3"]))

  const handleStudentChange = (studentId: string) => {
    let newSelection

    if (selectedStudents.includes(studentId)) {
      // Remove student if already selected
      newSelection = selectedStudents.filter((id) => id !== studentId)
    } else {
      // Add student if not already selected (max 5)
      if (selectedStudents.length < 5) {
        newSelection = [...selectedStudents, studentId]
      } else {
        return // Don't allow more than 5 selections
      }
    }

    setSelectedStudents(newSelection)
    setComparisonData(generateComparisonData(newSelection))
  }

  // Generate config for the chart
  const chartConfig = selectedStudents.reduce(
    (config, studentId) => {
      const student = students.find((s) => s.id === studentId)
      if (student) {
        config[studentId] = {
          label: student.name,
          // Assign different colors based on index
          color: `hsl(var(--chart-${selectedStudents.indexOf(studentId) + 1}))`,
        }
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Comparison</CardTitle>
        <CardDescription>Compare performance metrics across selected students</CardDescription>
        <div className="mt-2 flex flex-wrap gap-2">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => handleStudentChange(student.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedStudents.includes(student.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {student.name}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {selectedStudents.map((studentId) => (
                  <Bar key={studentId} dataKey={studentId} fill={`var(--color-${studentId})`} radius={[4, 4, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
