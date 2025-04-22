import { OpenAIStream, StreamingTextResponse } from "ai"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// Set the runtime to edge for best performance
export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages, subject } = await req.json()

    // Create system message based on subject
    const systemMessage = subject
      ? `You are an expert tutor specializing in ${subject}. Provide clear, educational responses that help students understand concepts deeply.`
      : "You are an AI tutor for Navshiksha, an educational platform. Help students learn effectively by providing clear explanations and examples."

    // Generate a response using the AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: messages[messages.length - 1].content,
      system: systemMessage,
    })

    // Return the response as a streaming text response
    return new StreamingTextResponse(OpenAIStream(text))
  } catch (error) {
    console.error("AI chat error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
