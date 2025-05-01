"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface StudentFeedbackFormProps {
  teacherId: string
  studentId: string
}

export function StudentFeedbackForm({ teacherId, studentId }: StudentFeedbackFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    content: "",
    feedbackType: "CONSTRUCTIVE",
  })

  const handleChange = (field: string, value: string) => {
    setFeedbackData({ ...feedbackData, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/teacher/students/feedback", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     teacherId,
      //     studentId,
      //     ...feedbackData
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Feedback submitted",
        description: "Your feedback has been submitted successfully.",
      })

      // Reset form
      setFeedbackData({
        content: "",
        feedbackType: "CONSTRUCTIVE",
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provide Feedback</CardTitle>
        <CardDescription>Share your feedback with the student</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedbackType">Feedback Type</Label>
            <Select value={feedbackData.feedbackType} onValueChange={(value) => handleChange("feedbackType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="POSITIVE">Positive Feedback</SelectItem>
                <SelectItem value="CONSTRUCTIVE">Constructive Feedback</SelectItem>
                <SelectItem value="QUESTION">Question</SelectItem>
                <SelectItem value="SUGGESTION">Suggestion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Feedback Content</Label>
            <Textarea
              id="content"
              value={feedbackData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter your feedback here..."
              rows={5}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || !feedbackData.content.trim()}>
            {isLoading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
