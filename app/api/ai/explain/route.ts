import { OpenAI } from "openai"
import { StreamingTextResponse } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

    // Generate a streaming response using the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      stream: true,
    })

    // Convert the response to a readable stream and return it
    return new StreamingTextResponse(response)
  } catch (error) {
    console.error("AI explanation error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate explanation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
