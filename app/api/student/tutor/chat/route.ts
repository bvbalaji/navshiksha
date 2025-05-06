import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { NextRequest } from "next/server"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages, studentId, subjectArea } = await req.json()

    // Add system message to guide the AI tutor
    const systemMessage = {
      role: "system",
      content: `You are an expert tutor specializing in ${subjectArea || "all subjects"}. 
      Your goal is to help students understand concepts, solve problems, and learn effectively. 
      Provide clear explanations, ask guiding questions, and offer step-by-step solutions when appropriate. 
      Be encouraging and supportive.`,
    }

    // Combine system message with user messages
    const allMessages = [systemMessage, ...messages]

    // Log the interaction for analytics (optional)
    console.log(`Student ${studentId} asked about ${subjectArea}`)

    // Use streamText from the AI SDK
    const result = streamText({
      model: openai("gpt-4o"),
      messages: allMessages,
    })

    // Return a streaming response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("OpenAI API error:", error)
    return Response.json(
      { error: "Failed to generate response", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
