"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { saveTutorSession } from "@/lib/student/tutor-service"
import { AlertCircle } from "lucide-react"
import { ChatMessage } from "./chat-message"

export default function TutorAIChat() {
  const [subjectArea, setSubjectArea] = useState("general")
  const [studentId, setStudentId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get student ID from localStorage or generate a new one
  useEffect(() => {
    const storedId = localStorage.getItem("studentId")
    if (storedId) {
      setStudentId(storedId)
    } else {
      const newId = `student_${Date.now()}`
      localStorage.setItem("studentId", newId)
      setStudentId(newId)
    }
  }, [])

  // Setup chat with the new useChat hook from @ai-sdk/react
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/student/tutor/chat",
    body: {
      studentId,
      subjectArea,
    },
    onResponse: () => {
      // Save the chat session when a response is received
      if (messages.length > 0) {
        saveTutorSession(studentId, messages)
      }
    },
  })

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col space-y-4">
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Subject Area:</label>
            <Select value={subjectArea} onValueChange={setSubjectArea}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="literature">Literature</SelectItem>
                <SelectItem value="computer-science">Computer Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="p-4">
          <div className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                <p>Ask your question to get started with the AI tutor!</p>
              </div>
            ) : (
              messages.map((message) => <ChatMessage key={message.id} message={message} />)
            )}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 mb-4 p-3 bg-red-50 rounded-md">
              <AlertCircle size={18} />
              <div>
                <p className="font-semibold">Error communicating with AI tutor</p>
                <p className="text-sm">{error.message || "Please try again"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
              >
                Retry
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask your question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? "Thinking..." : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
