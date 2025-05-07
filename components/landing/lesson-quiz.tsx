"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { markLessonAsCompleted } from "@/lib/student"

interface QuizProps {
  quiz: {
    id: string
    questions: Array<{
      id: string
      content: string
      options: string[]
      correctOption: number
    }>
  }
  userId: string
}

export function LessonQuiz({ quiz, userId }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()

  const question = quiz.questions[currentQuestion]
  const totalQuestions = quiz.questions.length

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQuestion]: optionIndex,
    })
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Calculate score
      let correctAnswers = 0
      quiz.questions.forEach((q, index) => {
        if (selectedOptions[index] === q.correctOption) {
          correctAnswers++
        }
      })

      const finalScore = Math.round((correctAnswers / totalQuestions) * 100)
      setScore(finalScore)

      // Save quiz result
      const response = await fetch("/api/quiz-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          score: correctAnswers,
          totalQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save quiz result")
      }

      // Mark lesson as completed
      await markLessonAsCompleted(userId, quiz.id)

      setIsCompleted(true)

      toast({
        title: "Quiz completed!",
        description: `You scored ${finalScore}%`,
      })
    } catch (error) {
      console.error("Error submitting quiz:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCompleted) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
          <CardDescription>
            You scored {score}% ({Math.round((score / 100) * totalQuestions)} out of {totalQuestions} correct)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            {score >= 70 ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-2">Great job!</div>
                <p>You've successfully completed this lesson.</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500 mb-2">Keep practicing!</div>
                <p>Review the lesson material and try again to improve your score.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Quiz</CardTitle>
        <CardDescription>
          Question {currentQuestion + 1} of {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="font-medium">{question.content}</div>
          <RadioGroup
            value={selectedOptions[currentQuestion]?.toString()}
            onValueChange={(value) => handleOptionSelect(Number.parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          Previous
        </Button>
        <div className="flex space-x-2">
          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={handleNext} disabled={selectedOptions[currentQuestion] === undefined}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(selectedOptions).length !== totalQuestions}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
