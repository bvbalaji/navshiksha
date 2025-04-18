"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Save, UserPlus, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { generateLearningPlan } from "@/lib/ai-utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Student {
  id: string
  name: string
  level: string
  recentActivity: string
}

export function LearningPlanCreator() {
  const [title, setTitle] = useState("")
  const [subject, setSubject] = useState("")
  const [level, setLevel] = useState("")
  const [goals, setGoals] = useState("")
  const [duration, setDuration] = useState("4 weeks")
  const [includeAssessments, setIncludeAssessments] = useState(true)
  const [includeResources, setIncludeResources] = useState(true)
  const [generatedPlan, setGeneratedPlan] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showAssignDialog, setShowAssignDialog] = useState(false)

  // Mock student data
  const students: Student[] = [
    { id: "1", name: "Alex Johnson", level: "Intermediate", recentActivity: "Completed Algebra Quiz" },
    { id: "2", name: "Maria Garcia", level: "Advanced", recentActivity: "Finished Calculus Module" },
    { id: "3", name: "James Wilson", level: "Beginner", recentActivity: "Started Geometry Lessons" },
    { id: "4", name: "Sophia Chen", level: "Intermediate", recentActivity: "Completed Practice Problems" },
    { id: "5", name: "Ethan Brown", level: "Beginner", recentActivity: "Reviewed Statistics Notes" },
  ]

  const handleGeneratePlan = async () => {
    if (!subject || !level || !goals) {
      setError("Please fill in all required fields (subject, level, and goals).")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      const additionalInstructions = [
        includeAssessments ? "Include regular assessments and evaluation criteria." : "",
        includeResources ? "Include recommended learning resources and materials." : "",
        `Plan should span approximately ${duration}.`,
      ]
        .filter(Boolean)
        .join(" ")

      const result = await generateLearningPlan(subject, level, goals + " " + additionalInstructions)

      if (result.success) {
        setGeneratedPlan(result.plan)
        if (!title) {
          setTitle(`${subject} Learning Plan - ${level} Level`)
        }
      } else {
        setError(result.error || "Failed to generate learning plan. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSavePlan = () => {
    // In a real application, this would save the plan to a database
    alert("Learning plan saved successfully!")
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleAssignPlan = () => {
    // In a real application, this would assign the plan to selected students
    alert(`Plan assigned to ${selectedStudents.length} students!`)
    setShowAssignDialog(false)
    setSelectedStudents([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Learning Plan</CardTitle>
          <CardDescription>Fill in the details to generate a personalized learning plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Plan Title</Label>
            <Input
              id="title"
              placeholder="e.g., Algebra Mastery Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Language Arts">Language Arts</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Foreign Language">Foreign Language</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Physical Education">Physical Education</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">
              Level <span className="text-red-500">*</span>
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Mixed">Mixed Levels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">
              Learning Goals <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="goals"
              placeholder="Describe the learning goals and objectives for this plan..."
              className="min-h-[100px]"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 week">1 week</SelectItem>
                <SelectItem value="2 weeks">2 weeks</SelectItem>
                <SelectItem value="4 weeks">4 weeks</SelectItem>
                <SelectItem value="6 weeks">6 weeks</SelectItem>
                <SelectItem value="8 weeks">8 weeks</SelectItem>
                <SelectItem value="12 weeks">12 weeks</SelectItem>
                <SelectItem value="16 weeks">16 weeks</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="assessments"
                checked={includeAssessments}
                onCheckedChange={(checked) => setIncludeAssessments(checked === true)}
              />
              <Label htmlFor="assessments">Include assessments and evaluation criteria</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="resources"
                checked={includeResources}
                onCheckedChange={(checked) => setIncludeResources(checked === true)}
              />
              <Label htmlFor="resources">Include recommended resources and materials</Label>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setTitle("")
              setSubject("")
              setLevel("")
              setGoals("")
              setDuration("4 weeks")
              setIncludeAssessments(true)
              setIncludeResources(true)
              setGeneratedPlan("")
              setError("")
            }}
          >
            Clear
          </Button>
          <Button onClick={handleGeneratePlan} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Plan
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className={`${!generatedPlan && "opacity-75"}`}>
        <CardHeader>
          <CardTitle>Generated Learning Plan</CardTitle>
          <CardDescription>
            {generatedPlan
              ? "Review and edit the AI-generated learning plan before saving."
              : "Fill in the form and click 'Generate Plan' to create a personalized learning plan."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            {generatedPlan ? (
              <div className="whitespace-pre-wrap">
                <h3 className="text-xl font-bold mb-4">{title}</h3>
                {generatedPlan.split("\n").map((line, index) => (
                  <p key={index} className={`${line.match(/^#+\s/) ? "font-bold text-lg mt-4 mb-2" : "mb-2"}`}>
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isGenerating ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Generating your personalized learning plan...</p>
                  </div>
                ) : (
                  <p>Your generated learning plan will appear here.</p>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" disabled={!generatedPlan || isGenerating} onClick={handleGeneratePlan}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <div className="space-x-2">
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!generatedPlan || isGenerating}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign to Students
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Learning Plan</DialogTitle>
                  <DialogDescription>Select students to assign this learning plan to.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={() => toggleStudentSelection(student.id)}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor={`student-${student.id}`} className="font-medium">
                            {student.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {student.level} • {student.recentActivity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAssignPlan} disabled={selectedStudents.length === 0}>
                    Assign to {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button disabled={!generatedPlan || isGenerating} onClick={handleSavePlan}>
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
