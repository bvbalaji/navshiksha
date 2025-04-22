"use client"

import { useState } from "react"
import { Send, Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function TutorPage() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "Welcome to your AI tutoring session! What would you like to learn today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message to chat
    const userMessage = { role: "user", content: inputValue }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = {
        "What is photosynthesis?":
          "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. During photosynthesis, plants take in carbon dioxide (CO₂) and water (H₂O) from the air and soil. Within the plant cell, the water is oxidized (loses electrons) and the carbon dioxide is reduced (gains electrons) to form glucose (C₆H₁₂O₆) and oxygen (O₂). The chemical equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
        "Can you explain Newton's laws of motion?":
          "Newton's laws of motion are three physical laws that form the foundation for classical mechanics. They describe the relationship between the motion of an object and the forces acting on it.\n\n1. First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced force.\n\n2. Second Law: The acceleration of an object depends on the mass of the object and the amount of force applied. The formula is F = ma (force equals mass times acceleration).\n\n3. Third Law: For every action, there is an equal and opposite reaction.",
        "Help me understand quadratic equations":
          "A quadratic equation is a second-degree polynomial equation in a single variable x: ax² + bx + c = 0, where a ≠ 0.\n\nTo solve quadratic equations, you can use the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a\n\nThe term b² - 4ac is called the discriminant. It tells you how many solutions the equation has:\n- If b² - 4ac > 0, there are two distinct real solutions\n- If b² - 4ac = 0, there is one repeated real solution\n- If b² - 4ac < 0, there are two complex solutions\n\nWould you like to try solving an example together?",
      }

      // Find a matching response or use default
      let aiResponse
      for (const [question, answer] of Object.entries(aiResponses)) {
        if (inputValue.toLowerCase().includes(question.toLowerCase())) {
          aiResponse = answer
          break
        }
      }

      // Default response if no match found
      if (!aiResponse) {
        aiResponse =
          "That's an interesting question! Let me explain this concept step by step. What specific aspect would you like me to elaborate on?"
      }

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <Tabs defaultValue="chat">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="exercises">Exercises</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4">
          <Tabs defaultValue="chat" className="h-[calc(100vh-8rem)]">
            <TabsContent value="chat" className="h-full flex flex-col">
              <div className="flex-1 overflow-auto p-4 rounded-md border mb-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <Card
                        className={`max-w-[80%] ${message.role === "user" ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        <CardContent className="p-3">
                          <p className="whitespace-pre-line">{message.content}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span>Thinking...</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Ask your question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[60px]"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="h-full">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Interactive Simulations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visual learning tools to help understand complex concepts
                    </p>
                    <Button variant="outline" className="w-full">
                      View Resources
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Video Tutorials</h3>
                    <p className="text-sm text-muted-foreground mb-4">Step-by-step video explanations of key topics</p>
                    <Button variant="outline" className="w-full">
                      Access Videos
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Practice Materials</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Additional exercises and worksheets for practice
                    </p>
                    <Button variant="outline" className="w-full">
                      Download Materials
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="exercises" className="h-full">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Current Topic: Algebraic Expressions</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-md">
                        <p className="font-medium mb-2">Question 1:</p>
                        <p className="mb-4">Simplify the expression: 3x² + 2x - 5x² + 7x - 2</p>
                        <Textarea placeholder="Enter your answer here..." className="mb-2" />
                        <Button>Check Answer</Button>
                      </div>
                      <div className="p-4 border rounded-md">
                        <p className="font-medium mb-2">Question 2:</p>
                        <p className="mb-4">Factor the expression: x² - 9</p>
                        <Textarea placeholder="Enter your answer here..." className="mb-2" />
                        <Button>Check Answer</Button>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <Button variant="outline">Previous Set</Button>
                      <Button>Next Set</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
