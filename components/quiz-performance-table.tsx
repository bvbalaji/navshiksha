"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample data - in a real app, this would come from props
const quizData = [
  {
    id: "q1",
    name: "Introduction to Algebra",
    difficulty: "Easy",
    avgScore: 92,
    attempts: 45,
    completionRate: 98,
  },
  {
    id: "q2",
    name: "Advanced Equations",
    difficulty: "Hard",
    avgScore: 76,
    attempts: 38,
    completionRate: 85,
  },
  {
    id: "q3",
    name: "Scientific Method",
    difficulty: "Medium",
    avgScore: 84,
    attempts: 42,
    completionRate: 92,
  },
  {
    id: "q4",
    name: "Cell Biology",
    difficulty: "Medium",
    avgScore: 88,
    attempts: 40,
    completionRate: 95,
  },
  {
    id: "q5",
    name: "Literary Analysis",
    difficulty: "Hard",
    avgScore: 72,
    attempts: 35,
    completionRate: 80,
  },
]

export function QuizPerformanceTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quiz Name</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead className="text-right">Avg. Score</TableHead>
            <TableHead className="text-right">Completion</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quizData.map((quiz) => (
            <TableRow key={quiz.id}>
              <TableCell className="font-medium">{quiz.name}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    quiz.difficulty === "Easy" ? "outline" : quiz.difficulty === "Medium" ? "secondary" : "default"
                  }
                >
                  {quiz.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={
                    quiz.avgScore >= 90 ? "text-green-600" : quiz.avgScore >= 75 ? "text-amber-600" : "text-red-600"
                  }
                >
                  {quiz.avgScore}%
                </span>
              </TableCell>
              <TableCell className="text-right">{quiz.completionRate}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
