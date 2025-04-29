"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Save } from "lucide-react"

export default function CreateLearningPlanPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState({
    title: "",
    description: "",
    subjectId: "",
    level: "BEGINNER",
    duration: "",
    isTemplate: true,
  })

  const [objectives, setObjectives] = useState([{ description: "", successCriteria: "" }])

  // Mock subjects for the demo
  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
  ]

  const handlePlanChange = (field: string, value: string | boolean) => {
    setPlan({ ...plan, [field]: value })
  }

  const handleObjectiveChange = (index: number, field: string, value: string) => {
    const updatedObjectives = [...objectives]
    updatedObjectives[index] = { ...updatedObjectives[index], [field]: value }
    setObjectives(updatedObjectives)
  }

  const addObjective = () => {
    setObjectives([...objectives, { description: "", successCriteria: "" }])
  }

  const removeObjective = (index: number) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create the learning plan
      // const response = await fetch("/api/teacher/plans", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ plan, objectives }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Learning plan created",
        description: "Your learning plan has been created successfully.",
      })

      router.push("/teacher/plans")
    } catch (error) {
      console.error("Error creating learning plan:", error)
      toast({
        title: "Error",
        description: "Failed to create learning plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Learning Plan</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Basic information about the learning plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={plan.title}
                  onChange={(e) => handlePlanChange("title", e.target.value)}
                  placeholder="Enter plan title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={plan.description}
                  onChange={(e) => handlePlanChange("description", e.target.value)}
                  placeholder="Describe the purpose and goals of this learning plan"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={plan.subjectId} onValueChange={(value) => handlePlanChange("subjectId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select value={plan.level} onValueChange={(value) => handlePlanChange("level", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={plan.duration}
                  onChange={(e) => handlePlanChange("duration", e.target.value)}
                  placeholder="e.g., 4 weeks, 2 months"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isTemplate"
                  checked={plan.isTemplate}
                  onCheckedChange={(checked) => handlePlanChange("isTemplate", !!checked)}
                />
                <Label htmlFor="isTemplate">Save as template for future use</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Objectives</CardTitle>
              <CardDescription>Define what students should achieve with this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectives.map((objective, index) => (
                <div key={index} className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Objective {index + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeObjective(index)}
                      disabled={objectives.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`objective-${index}`}>Description</Label>
                    <Textarea
                      id={`objective-${index}`}
                      value={objective.description}
                      onChange={(e) => handleObjectiveChange(index, "description", e.target.value)}
                      placeholder="What should the student be able to do?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`criteria-${index}`}>Success Criteria</Label>
                    <Textarea
                      id={`criteria-${index}`}
                      value={objective.successCriteria}
                      onChange={(e) => handleObjectiveChange(index, "successCriteria", e.target.value)}
                      placeholder="How will you know the student has achieved this objective?"
                    />
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addObjective} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Objective
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/teacher/plans")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                "Creating..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
