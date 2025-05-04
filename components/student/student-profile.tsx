"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, FileText, Mail, Calendar, User, MapPin, Globe, Lightbulb, Plus, Pencil } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface StudentProfileProps {
  student: {
    id: string
    name: string
    email: string
    profileImageUrl?: string
    role: string
    createdAt: string
    profile?: {
      dateOfBirth?: string
      educationLevel?: string
      preferredLanguage?: string
      timezone?: string
      learningStyle?: string
      preferredSubjects?: string[]
    }
  }
  enrollments: Array<{
    id: string
    courseId: string
    courseTitle: string
    progress: number
    lastAccessedAt?: string
    completedAt?: string
  }>
  learningPlans: Array<{
    id: string
    title: string
    status: string
    assignedAt: string
    startDate?: string
    endDate?: string
  }>
  teacherNotes: Array<{
    id: string
    content: string
    created_at: string
    updated_at: string
  }>
}

export function StudentProfile({ student, enrollments, learningPlans, teacherNotes }: StudentProfileProps) {
  const { toast } = useToast()
  const [isAssigningPlan, setIsAssigningPlan] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    setIsSubmittingNote(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/teacher/students/notes", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     studentId: student.id,
      //     content: newNote
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Note added",
        description: "Your note has been added successfully.",
      })

      // Reset form and close
      setNewNote("")
      setIsAddingNote(false)

      // In a real app, you would refresh the notes list
      // Either by refetching or by optimistically updating the UI
    } catch (error) {
      console.error("Error adding note:", error)
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingNote(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={student.profileImageUrl || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{student.email}</span>
            </div>
            <div className="mt-1">
              <Badge variant="outline">Student</Badge>
              {student.profile?.learningStyle && (
                <Badge variant="secondary" className="ml-2">
                  {student.profile.learningStyle}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/teacher/students/${student.id}/message`}>
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Link>
          </Button>
          <Button onClick={() => setIsAssigningPlan(!isAssigningPlan)}>
            <FileText className="mr-2 h-4 w-4" />
            {isAssigningPlan ? "Cancel" : "Assign Learning Plan"}
          </Button>
        </div>
      </div>

      {isAssigningPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Learning Plan</CardTitle>
            <CardDescription>Select a learning plan to assign to this student</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">Learning plan assignment form will be displayed here</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="plans">Learning Plans</TabsTrigger>
          <TabsTrigger value="notes">Teacher Notes</TabsTrigger>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrollments.length}</div>
                <p className="text-xs text-muted-foreground">
                  {enrollments.filter((e) => e.completedAt).length} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {enrollments.length > 0
                    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                    : 0}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Learning Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {learningPlans.filter((p) => p.status === "IN_PROGRESS").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {learningPlans.filter((p) => p.status === "COMPLETED").length} completed
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Student's recent course activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.length > 0 ? (
                  enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{enrollment.courseTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          Last accessed:{" "}
                          {enrollment.lastAccessedAt
                            ? new Date(enrollment.lastAccessedAt).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{enrollment.progress}%</p>
                        <p className="text-xs text-muted-foreground">Progress</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No course activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Courses</CardTitle>
              <CardDescription>Courses this student is enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="rounded-md border p-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>
                          <h3 className="font-medium">{enrollment.courseTitle}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {enrollment.lastAccessedAt
                                ? `Last accessed: ${new Date(enrollment.lastAccessedAt).toLocaleDateString()}`
                                : "Not started yet"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-medium">{enrollment.progress}%</p>
                            <p className="text-xs text-muted-foreground">Progress</p>
                          </div>
                          <div className="w-24">
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                        </div>
                      </div>

                      {enrollment.completedAt && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Completed
                          </Badge>
                          <span>{new Date(enrollment.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">This student is not enrolled in any courses yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Learning Plans</CardTitle>
                <CardDescription>Personalized learning plans assigned to this student</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0" onClick={() => setIsAssigningPlan(!isAssigningPlan)}>
                <Plus className="mr-2 h-4 w-4" />
                Assign New Plan
              </Button>
            </CardHeader>
            <CardContent>
              {learningPlans.length > 0 ? (
                <div className="space-y-4">
                  {learningPlans.map((plan) => (
                    <div key={plan.id} className="rounded-md border p-4">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>
                          <h3 className="font-medium">{plan.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Assigned: {new Date(plan.assignedAt).toLocaleDateString()}</span>
                          </div>
                          {plan.startDate && plan.endDate && (
                            <div className="mt-1 text-sm text-muted-foreground">
                              {new Date(plan.startDate).toLocaleDateString()} -{" "}
                              {new Date(plan.endDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              plan.status === "COMPLETED"
                                ? "default"
                                : plan.status === "IN_PROGRESS"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {plan.status.replace("_", " ")}
                          </Badge>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/teacher/plans/${plan.id}/student/${student.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No learning plans assigned yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Teacher Notes</CardTitle>
                <CardDescription>Your private notes about this student</CardDescription>
              </div>
              <Button className="mt-4 sm:mt-0" onClick={() => setIsAddingNote(!isAddingNote)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </CardHeader>
            <CardContent>
              {isAddingNote && (
                <div className="mb-4 rounded-md border p-4">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddNote} disabled={isSubmittingNote || !newNote.trim()}>
                      {isSubmittingNote ? "Saving..." : "Save Note"}
                    </Button>
                  </div>
                </div>
              )}

              {teacherNotes.length > 0 ? (
                <div className="space-y-4">
                  {teacherNotes.map((note) => (
                    <div key={note.id} className="rounded-md border p-4">
                      <div className="flex items-start justify-between">
                        <p className="text-sm">{note.content}</p>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()} at{" "}
                        {new Date(note.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No notes added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Student's personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Personal Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Name: {student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Email: {student.email}</span>
                      </div>
                      {student.profile?.dateOfBirth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            Date of Birth: {new Date(student.profile.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {student.profile?.educationLevel && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Education Level: {student.profile.educationLevel}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {student.profile?.preferredSubjects && student.profile.preferredSubjects.length > 0 && (
                    <div>
                      <h3 className="mb-2 font-medium">Preferred Subjects</h3>
                      <div className="flex flex-wrap gap-2">
                        {student.profile.preferredSubjects.map((subject, index) => (
                          <Badge key={index} variant="secondary">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-medium">Learning Preferences</h3>
                    <div className="space-y-2">
                      {student.profile?.learningStyle && (
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Learning Style: {student.profile.learningStyle}</span>
                        </div>
                      )}
                      {student.profile?.preferredLanguage && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Preferred Language: {student.profile.preferredLanguage}</span>
                        </div>
                      )}
                      {student.profile?.timezone && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Timezone: {student.profile.timezone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 font-medium">Account Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Joined: {new Date(student.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
