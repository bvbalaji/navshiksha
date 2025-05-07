"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/ai-tutor/chat-interface"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface LessonContentProps {
  lesson: {
    id: string
    title: string
    content: string
  }
}

export function LessonContent({ lesson }: LessonContentProps) {
  const [showAiTutor, setShowAiTutor] = useState(false)

  return (
    <Card className="p-6">
      <Tabs defaultValue="content">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="content">Lesson Content</TabsTrigger>
            {showAiTutor && <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>}
          </TabsList>
          {!showAiTutor && (
            <Button onClick={() => setShowAiTutor(true)} variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI Tutor
            </Button>
          )}
        </div>
        <TabsContent value="content">
          <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          </div>
        </TabsContent>
        {showAiTutor && (
          <TabsContent value="ai-tutor">
            <ChatInterface lessonId={lesson.id} />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  )
}
