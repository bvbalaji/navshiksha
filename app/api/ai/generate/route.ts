import { generateUI } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    // Extract the prompt and optional parameters from the request
    const { prompt, subject, maxTokens = 500 } = await req.json()

    // Create system message based on subject
    const systemMessage = subject
      ? `You are an expert tutor specializing in ${subject}. Provide clear, educational responses that help students understand concepts deeply.`
      : "You are an AI tutor for Navshiksha, an educational platform. Help students learn effectively by providing clear explanations and examples."

    // Generate a response using the AI SDK
    const { text } = await generateUI({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: prompt }],
      system: systemMessage,
      maxTokens: maxTokens,
    })

    // Return the response as JSON
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("AI generation error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
