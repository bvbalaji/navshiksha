"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Send, Sparkles } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export default function AITutorPage() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Welcome to your AI Tutor! I can help you learn any subject. What would you like to study today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState("math")

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: input,
        system: `You are an expert tutor in ${subject}. Provide clear, concise explanations tailored to the student's level. Include examples and ask questions to check understanding.`,
      })

      const aiMessage = {
        role: "assistant",
        content: text,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-muted/40 lg:flex">
          <div className="flex h-14 items-center border-b px-4">
            <span className="font-semibold">AI Tutor</span>
          </div>
          <div className="p-4">
            <h3 className="mb-2 text-sm font-medium">Select Subject</h3>
            <Tabs value={subject} onValueChange={setSubject} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="math">Math</TabsTrigger>
                <TabsTrigger value="science">Science</TabsTrigger>
              </TabsList>
              <TabsList className="mt-2 grid w-full grid-cols-2">
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="english">English</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Learning Level</h3>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 text-sm font-medium">Suggested Topics</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("Explain the Pythagorean theorem")}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  Pythagorean theorem
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("Help me understand quadratic equations")}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  Quadratic equations
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setInput("What are the properties of logarithms?")}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-primary" />
                  Logarithm properties
                </Button>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto p-4">
              <div className="mx-auto max-w-3xl space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <Card
                      className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}
                    >
                      <CardContent className="p-3">
                        {message.role === "assistant" && (
                          <div className="mb-2 flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            <span className="text-xs font-medium">AI Tutor</span>
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <Card>
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span className="text-xs font-medium">AI Tutor</span>
                        </div>
                        <p className="text-sm">Thinking...</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t p-4">
              <div className="mx-auto max-w-3xl">
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Ask anything about your studies..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-24 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Your AI tutor is here to help with personalized learning. Ask questions, request explanations, or get
                  help with problems.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

