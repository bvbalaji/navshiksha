"use client"

import { useState } from "react"
import type { Course, Module, Lesson } from "@prisma/client"
import { useRouter } from "next/navigation"
import { ModuleForm } from "./module-form"
import { LessonForm } from "./lesson-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast"
import { deleteModule, deleteLesson } from "@/app/actions/content-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { BookOpen, FileText, Plus, Edit, Trash2, GripVertical, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CourseWithModulesAndLessons extends Course {
  modules: (Module & {
    lessons: Lesson[]
  })[]
}

interface CourseEditorProps {
  course: CourseWithModulesAndLessons
}

export function CourseEditor({ course }: CourseEditorProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("structure")
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
  const [isEditModuleOpen, setIsEditModuleOpen] = useState(false)
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false)
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  const handleAddModule = () => {
    setIsAddModuleOpen(true)
  }

  const handleEditModule = (module: Module) => {
    setSelectedModule(module)
    setIsEditModuleOpen(true)
  }

  const handleAddLesson = (module: Module) => {
    setSelectedModule(module)
    setIsAddLessonOpen(true)
  }

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setIsEditLessonOpen(true)
  }

  const handleDeleteModule = async (moduleId: string) => {
    try {
      const result = await deleteModule(moduleId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Module deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete module.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting module:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      const result = await deleteLesson(lessonId)

      if (result.success) {
        toast({
          title: "Success",
          description: "Lesson deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete lesson.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting lesson:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/teacher/content">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <span
            className={`ml-2 rounded-full px-2 py-1 text-xs ${course.is_published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
          >
            {course.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <Button asChild>
          <Link href={`/teacher/content/edit-course-details/${course.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Course Details
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="structure">Course Structure</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Course Modules</CardTitle>
                <CardDescription>Organize your course content into modules and lessons</CardDescription>
              </div>
              <Button onClick={handleAddModule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
            </CardHeader>
            <CardContent>
              {course.modules.length > 0 ? (
                <Accordion type="multiple" className="w-full">
                  {course.modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <div className="flex items-center">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <AccordionTrigger className="flex-1">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span>{module.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                            </span>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent>
                        <div className="pl-6 pr-2 pb-2">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-muted-foreground">{module.description || "No description"}</p>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditModule(module)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the module and all its lessons. This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteModule(module.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">Lessons</h4>
                              <Button size="sm" variant="outline" onClick={() => handleAddLesson(module)}>
                                <Plus className="mr-2 h-3 w-3" />
                                Add Lesson
                              </Button>
                            </div>

                            {module.lessons.length > 0 ? (
                              <div className="space-y-2">
                                {module.lessons.map((lesson) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between rounded-md border p-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">{lesson.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {lesson.content_type} • {lesson.estimated_duration || "?"} min
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="ghost" onClick={() => handleEditLesson(lesson)}>
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button size="sm" variant="ghost" className="text-red-500">
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              This will permanently delete the lesson. This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteLesson(lesson.id)}
                                              className="bg-red-500 hover:bg-red-600"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
                                <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No lessons yet</p>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="mt-2"
                                  onClick={() => handleAddLesson(module)}
                                >
                                  Add Lesson
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 text-lg font-medium">No modules yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">Start by adding a module to your course</p>
                  <Button onClick={handleAddModule}>Add Module</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Preview</CardTitle>
              <CardDescription>Preview how your course will appear to students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">Preview functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Configure additional settings for your course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <p className="text-muted-foreground">Settings functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isAddModuleOpen && (
        <ModuleForm courseId={course.id} isOpen={isAddModuleOpen} onClose={() => setIsAddModuleOpen(false)} />
      )}

      {isEditModuleOpen && selectedModule && (
        <ModuleForm
          courseId={course.id}
          module={selectedModule}
          isOpen={isEditModuleOpen}
          onClose={() => {
            setIsEditModuleOpen(false)
            setSelectedModule(null)
          }}
        />
      )}

      {isAddLessonOpen && selectedModule && (
        <LessonForm
          moduleId={selectedModule.id}
          isOpen={isAddLessonOpen}
          onClose={() => {
            setIsAddLessonOpen(false)
            setSelectedModule(null)
          }}
        />
      )}

      {isEditLessonOpen && selectedLesson && (
        <LessonForm
          moduleId={selectedLesson.module_id}
          lesson={selectedLesson}
          isOpen={isEditLessonOpen}
          onClose={() => {
            setIsEditLessonOpen(false)
            setSelectedLesson(null)
          }}
        />
      )}
    </div>
  )
}
