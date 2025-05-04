"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Brain,
  FileText,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Upload,
  File,
  X,
  Image,
  FileVideo,
  FileIcon as FilePdf,
  Check,
} from "lucide-react"
import { OpenAI } from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

import { openai } from "@ai-sdk/openai"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Type for uploaded file
type UploadedFile = {
  id: number
  name: string
  size: number
  type: string
  url: string
  uploadDate: string
  progress: number
  status: "uploading" | "complete" | "error"
}

// Type for content item
type ContentItem = {
  id: number
  title: string
  type: string
  subject: string
  date: string
  files?: UploadedFile[]
}

export default function ContentCreatorPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [uploadTab, setUploadTab] = useState("file")
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("mathematics")
  const [gradeLevel, setGradeLevel] = useState("high-school")
  const [contentType, setContentType] = useState("lesson")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadDescription, setUploadDescription] = useState("")
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [savedContent, setSavedContent] = useState<ContentItem[]>([
    {
      id: 1,
      title: "Introduction to Quadratic Equations",
      type: "Lesson",
      subject: "Mathematics",
      date: "Oct 10, 2023",
    },
    {
      id: 2,
      title: "Geometry Fundamentals Quiz",
      type: "Assessment",
      subject: "Mathematics",
      date: "Oct 5, 2023",
    },
    {
      id: 3,
      title: "Statistical Analysis Project",
      type: "Assignment",
      subject: "Mathematics",
      date: "Sep 28, 2023",
      files: [
        {
          id: 101,
          name: "project_guidelines.pdf",
          size: 1024000,
          type: "application/pdf",
          url: "#",
          uploadDate: "Sep 28, 2023",
          progress: 100,
          status: "complete",
        },
      ],
    },
  ])

  const handleGenerateContent = async () => {
    if (!topic) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const { text } = await generateUI({
        model: openai("gpt-4o"),
        messages: `Create educational content about ${topic}`,
        system: `You are an expert educational content creator for ${gradeLevel} students. 
        Create a ${contentType} about ${topic} for the subject ${subject}. 
        If it's a lesson, include an introduction, key concepts, examples, and a summary. 
        If it's an assessment, create 5-10 questions with answers. 
        If it's an assignment, create a project or homework assignment with clear instructions and grading criteria.
        Format the content with clear headings and structure.`,
      })

      setGeneratedContent(text)
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("An error occurred while generating content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveContent = () => {
    if (!generatedContent && uploadedFiles.length === 0) return

    if (activeTab === "create" && !generatedContent) return

    if (activeTab === "upload" && (!uploadTitle || uploadedFiles.length === 0)) return

    const title = activeTab === "create" ? topic : uploadTitle
    const type = activeTab === "create" ? contentType.charAt(0).toUpperCase() + contentType.slice(1) : "Resource"

    const newContent: ContentItem = {
      id: Date.now(),
      title,
      type,
      subject: subject.charAt(0).toUpperCase() + subject.slice(1),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }

    if (activeTab === "upload") {
      newContent.files = [...uploadedFiles]
    }

    setSavedContent([newContent, ...savedContent])

    // Reset form after saving
    if (activeTab === "upload") {
      setUploadTitle("")
      setUploadDescription("")
      setUploadedFiles([])
    }

    // In a real app, you would save this to a database
    alert("Content saved successfully!")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)

    // Process each file
    Array.from(e.target.files).forEach((file) => {
      // Create a file URL (in a real app, you'd upload to a server)
      const fileUrl = URL.createObjectURL(file)

      // Create a new uploaded file object
      const newFile: UploadedFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadDate: new Date().toLocaleDateString(),
        progress: 0,
        status: "uploading",
      }

      setUploadedFiles((prev) => [...prev, newFile])

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5

        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress: 100, status: "complete" } : f)),
          )

          setIsUploading(false)
        } else {
          setUploadedFiles((prev) => prev.map((f) => (f.id === newFile.id ? { ...f, progress } : f)))
        }
      }, 300)
    })

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (id: number) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const openFilePreview = (file: UploadedFile) => {
    setPreviewFile(file)
    setIsPreviewOpen(true)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />
    if (fileType.startsWith("video/")) return <FileVideo className="h-5 w-5 text-purple-500" />
    if (fileType === "application/pdf") return <FilePdf className="h-5 w-5 text-red-500" />
    return <File className="h-5 w-5 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Creator</h1>
          <p className="text-gray-500">Create and manage educational content with AI assistance</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="library">Content Library</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>Configure your content generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Quadratic Equations"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade-level">Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger id="grade-level">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middle-school">Middle School</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger id="content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lesson">Lesson</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleGenerateContent} disabled={!topic || isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">AI Suggestions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setTopic("Pythagorean Theorem")
                        setSubject("mathematics")
                        setGradeLevel("high-school")
                        setContentType("lesson")
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Pythagorean Theorem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setTopic("Cell Structure and Function")
                        setSubject("science")
                        setGradeLevel("high-school")
                        setContentType("lesson")
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Cell Structure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setTopic("Literary Analysis Quiz")
                        setSubject("english")
                        setGradeLevel("high-school")
                        setContentType("assessment")
                      }}
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-primary" />
                      Literary Analysis Quiz
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Content Editor</CardTitle>
                <CardDescription>
                  {generatedContent ? "Edit the generated content as needed" : "Generate content or start from scratch"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Your content will appear here..."
                  className="min-h-[400px] font-mono"
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Preview</Button>
                <Button onClick={handleSaveContent} disabled={!generatedContent}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Content
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>Configure your content upload</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upload-title">Title</Label>
                  <Input
                    id="upload-title"
                    placeholder="e.g., Cell Structure Presentation"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="upload-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-grade-level">Grade Level</Label>
                  <Select value={gradeLevel} onValueChange={setGradeLevel}>
                    <SelectTrigger id="upload-grade-level">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary School</SelectItem>
                      <SelectItem value="middle-school">Middle School</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-description">Description (Optional)</Label>
                  <Textarea
                    id="upload-description"
                    placeholder="Describe the content you're uploading..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>Upload documents, presentations, images, or videos</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={uploadTab} onValueChange={setUploadTab} className="w-full">
                  <TabsList className="mb-4 grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="file">File Upload</TabsTrigger>
                    <TabsTrigger value="url">From URL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="file">
                    <div className="mb-6 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">Drag and drop files here, or click to browse</p>
                      <p className="mb-4 text-xs text-gray-400">
                        Supports PDFs, documents, presentations, images, and videos (max 50MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mov"
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Select Files
                          </>
                        )}
                      </Button>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Uploaded Files</h3>
                        <div className="rounded-lg border">
                          {uploadedFiles.map((file) => (
                            <div key={file.id} className="border-b p-3 last:border-b-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  {getFileIcon(file.type)}
                                  <div>
                                    <p className="text-sm font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {file.status === "complete" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => openFilePreview(file)}
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600"
                                    onClick={() => removeFile(file.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {file.status === "uploading" && (
                                <div className="mt-2">
                                  <Progress value={file.progress} className="h-1" />
                                  <p className="mt-1 text-xs text-gray-500">Uploading... {file.progress}%</p>
                                </div>
                              )}
                              {file.status === "complete" && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-green-600">
                                  <Check className="h-3 w-3" />
                                  <span>Upload complete</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="url">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="resource-url">Resource URL</Label>
                        <Input id="resource-url" placeholder="https://example.com/resource.pdf" type="url" />
                      </div>
                      <Button className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Add URL
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setUploadedFiles([])}>
                  Clear All
                </Button>
                <Button
                  onClick={handleSaveContent}
                  disabled={
                    !uploadTitle || uploadedFiles.length === 0 || uploadedFiles.some((f) => f.status === "uploading")
                  }
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Content
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Content Library</CardTitle>
                  <CardDescription>Browse and manage your saved content</CardDescription>
                </div>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedContent.map((content) => (
                  <div
                    key={content.id}
                    className="flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        {content.type === "Lesson" ? (
                          <BookOpen className="h-4 w-4 text-primary" />
                        ) : content.type === "Assessment" ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : content.type === "Resource" ? (
                          <File className="h-4 w-4 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{content.title}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <Badge variant="outline" className="font-normal">
                            {content.type}
                          </Badge>
                          <span>•</span>
                          <span>{content.subject}</span>
                          <span>•</span>
                          <span>{content.date}</span>
                        </div>

                        {content.files && content.files.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-500">Attached files:</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {content.files.map((file) => (
                                <Badge
                                  key={file.id}
                                  variant="secondary"
                                  className="flex items-center gap-1 font-normal"
                                >
                                  {getFileIcon(file.type)}
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 sm:mt-0">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* File Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{previewFile?.name}</DialogTitle>
            <DialogDescription>
              {formatFileSize(previewFile?.size || 0)} • Uploaded on {previewFile?.uploadDate}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[500px] overflow-auto rounded border p-2">
            {previewFile?.type.startsWith("image/") ? (
              <img
                src={previewFile.url || "/placeholder.svg"}
                alt={previewFile.name}
                className="mx-auto max-h-[450px] object-contain"
              />
            ) : previewFile?.type.startsWith("video/") ? (
              <video src={previewFile.url} controls className="mx-auto max-h-[450px] w-full" />
            ) : previewFile?.type === "application/pdf" ? (
              <iframe src={previewFile.url} title={previewFile.name} className="h-[450px] w-full" />
            ) : (
              <div className="flex h-[300px] items-center justify-center">
                <div className="text-center">
                  <File className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                  <p>Preview not available for this file type</p>
                  <Button className="mt-4" size="sm" asChild>
                    <a href={previewFile?.url} target="_blank" rel="noopener noreferrer">
                      Download to view
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a href={previewFile?.url} download={previewFile?.name}>
                Download
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

