import { streamUI } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages, subject } = await req.json()

    // Create system message based on subject
    const systemMessage = subject
      ? `You are an expert tutor specializing in ${subject}. Provide clear, educational responses that help students understand concepts deeply.`
      : "You are an AI tutor for Navshiksha, an educational platform. Help students learn effectively by providing clear explanations and examples."

    // Generate a streaming response using the AI SDK
    const result = streamUI({
      model: openai("gpt-4o"),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      system: systemMessage,
    })

    // Return the response as a streaming text response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI chat error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
