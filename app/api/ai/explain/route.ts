import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract parameters from the request
    const { concept, subject, difficulty = "intermediate" } = await req.json()

    if (!concept) {
      return new Response(JSON.stringify({ error: "Concept is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Create a prompt for explaining the concept
    const prompt = `Explain the concept of "${concept}" in a clear and educational way.`

    // Create system message based on subject and difficulty
    const systemMessage = `You are an expert tutor specializing in ${
      subject || "various subjects"
    }. Provide a ${difficulty}-level explanation of the concept. Include examples, analogies, and key points to remember. Structure your response with clear headings and bullet points where appropriate.`

    // Generate a streaming response using the AI SDK
    const result = streamText({
      model: openai("gpt-4o"),
      prompt: prompt,
      system: systemMessage,
    })

    // Return the response as a streaming text response
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("AI explanation error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate explanation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
