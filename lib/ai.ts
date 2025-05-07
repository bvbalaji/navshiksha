import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { getLessonById } from "@/lib/lessons"
import { getCourseById } from "@/lib/courses"

interface TutorRequestParams {
  userId: string
  message: string
  context?: Array<{ role: string; content: string }>
  lessonId?: string
}

export async function generateTutorResponse({ userId, message, context = [], lessonId }: TutorRequestParams) {
  let lessonContext = ""

  // If a lesson ID is provided, get the lesson content for context
  if (lessonId) {
    const lesson = await getLessonById(lessonId)
    if (lesson) {
      const course = await getCourseById(lesson.courseId)
      lessonContext = `
        The student is currently studying the lesson "${lesson.title}" 
        which is part of the course "${course?.title}".
        
        Lesson content: ${lesson.content}
      `
    }
  }

  const contextMessages = context.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }))

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `
      You are NavShiksha, an AI tutor designed to help students learn effectively.
      ${lessonContext}
      
      Guidelines:
      - Provide clear, concise explanations
      - Break down complex concepts into simpler parts
      - Use examples to illustrate points
      - Ask questions to check understanding
      - Be encouraging and supportive
      - If you don't know something, admit it and suggest resources
    `,
    messages: contextMessages,
    prompt: message,
  })

  return text
}
