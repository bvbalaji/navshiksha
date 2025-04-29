"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, FileText, Mail } from "lucide-react"
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
}

export function StudentProfile({ student, enrollments, learningPlans }: StudentProfileProps) {
  const [isAssigningPlan, setIsAssigningPlan] = useState(false)
  
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
                  {enrollments.filter(e => e.completedAt).length} completed
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
                    : 0}%
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
                  {learningPlans.filter(p => p.status === "IN_PROGRESS").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {learningPlans.filter(p => p.status === "COMPLETED").length} completed
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
                          Last accessed: {enrollment.lastAccessedAt 
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
                        &lt;div className="flex items-center gap-2"&gt;&lt;/div&gt;

\
