"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, GripVertical, Save } from "lucide-react"

export function CreateCourseForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  const [course, setCourse] = useState({
    title: "",
    description: "",
    subjectId: "",
    level: "BEGINNER",
    estimatedDuration: "",
    isPublished: false,
  })

  const [modules, setModules] = useState([
    { title: "", description: "", lessons: [{ title: "", content: "", contentType: "TEXT" }] },
  ])

  // Mock subjects for the demo
  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
  ]

  const handleCourseChange = (field: string, value: string | boolean | number) => {
    setCourse({ ...course, [field]: value })
  }

  const handleModuleChange = (moduleIndex: number, field: string, value: string) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], [field]: value }
    setModules(updatedModules)
  }

  const handleLessonChange = (moduleIndex: number, lessonIndex: number, field: string, value: string) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex] = {
      ...updatedModules[moduleIndex].lessons[lessonIndex],
      [field]: value,
    }
    setModules(updatedModules)
  }

  const addModule = () => {
    setModules([...modules, { title: "", description: "", lessons: [{ title: "", content: "", contentType: "TEXT" }] }])
  }

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index))
    }
  }

  const addLesson = (moduleIndex: number) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.push({ title: "", content: "", contentType: "TEXT" })
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    if (modules[moduleIndex].lessons.length > 1) {
      const updatedModules = [...modules]
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex)
      setModules(updatedModules)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to create the course
      // const response = await fetch("/api/teacher/courses", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ course, modules }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      })

      router.push("/teacher/content")
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={course.title}
                    onChange={(e) => handleCourseChange("title", e.target.value)}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={course.description}
                    onChange={(e) => handleCourseChange("description", e.target.value)}
                    placeholder="Describe what students will learn in this course"
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select value={course.subjectId} onValueChange={(value) => handleCourseChange("subjectId", value)}>
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
                    <Select value={course.level} onValueChange={(value) => handleCourseChange("level", value)}>
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
                  <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={course.estimatedDuration}
                    onChange={(e) => handleCourseChange("estimatedDuration", e.target.value)}
                    placeholder="e.g., 120"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={course.isPublished}
                    onCheckedChange={(checked) => handleCourseChange("isPublished", checked)}
                  />
                  <Label htmlFor="isPublished">Publish course immediately</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={() => setActiveTab("content")}>
                  Continue to Course Content
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Organize your course into modules and lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="rounded-md border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Module {moduleIndex + 1}</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(moduleIndex)}
                        disabled={modules.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`module-title-${moduleIndex}`}>Module Title</Label>
                        <Input
                          id={`module-title-${moduleIndex}`}
                          value={module.title}
                          onChange={(e) => handleModuleChange(moduleIndex, "title", e.target.value)}
                          placeholder="Enter module title"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`module-description-${moduleIndex}`}>Description</Label>
                        <Textarea
                          id={`module-description-${moduleIndex}`}
                          value={module.description}
                          onChange={(e) => handleModuleChange(moduleIndex, "description", e.target.value)}
                          placeholder="Describe this module"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Lessons</h4>

                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lessonIndex} className="rounded-md border p-3">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <h5 className="text-sm font-medium">Lesson {lessonIndex + 1}</h5>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                disabled={module.lessons.length === 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <div className="space-y-1">
                                <Label htmlFor={`lesson-title-${moduleIndex}-${lessonIndex}`} className="text-xs">
                                  Lesson Title
                                </Label>
                                <Input
                                  id={`lesson-title-${moduleIndex}-${lessonIndex}`}
                                  value={lesson.title}
                                  onChange={(e) =>
                                    handleLessonChange(moduleIndex, lessonIndex, "title", e.target.value)
                                  }
                                  placeholder="Enter lesson title"
                                  required
                                  className="h-8 text-sm"
                                />
                              </div>

                              <div className="grid gap-3 md:grid-cols-4">
                                <div className="space-y-1">
                                  <Label htmlFor={`lesson-type-${moduleIndex}-${lessonIndex}`} className="text-xs">
                                    Content Type
                                  </Label>
                                  <Select
                                    value={lesson.contentType}
                                    onValueChange={(value) =>
                                      handleLessonChange(moduleIndex, lessonIndex, "contentType", value)
                                    }
                                  >
                                    <SelectTrigger className="h-8 text-xs">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="TEXT">Text</SelectItem>
                                      <SelectItem value="VIDEO">Video</SelectItem>
                                      <SelectItem value="INTERACTIVE">Interactive</SelectItem>
                                      <SelectItem value="QUIZ">Quiz</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="space-y-1 md:col-span-3">
                                  <Label htmlFor={`lesson-content-${moduleIndex}-${lessonIndex}`} className="text-xs">
                                    Content
                                  </Label>
                                  <Textarea
                                    id={`lesson-content-${moduleIndex}-${lessonIndex}`}
                                    value={lesson.content}
                                    onChange={(e) =>
                                      handleLessonChange(moduleIndex, lessonIndex, "content", e.target.value)
                                    }
                                    placeholder="Enter lesson content or URL"
                                    className="text-sm"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addLesson(moduleIndex)}
                          className="w-full"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addModule} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Module
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                Back to Course Details
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/teacher/content")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Create Course
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  )
}
