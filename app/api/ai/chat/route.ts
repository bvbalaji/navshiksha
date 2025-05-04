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
    // Extract the `messages` from the body of the request
    const { messages, subject } = await req.json()

    // Create system message based on subject
    const systemMessage = subject
      ? `You are an expert tutor specializing in ${subject}. Provide clear, educational responses that help students understand concepts deeply.`
      : "You are an AI tutor for Navshiksha, an educational platform. Help students learn effectively by providing clear explanations and examples."

    // Add system message to the beginning of the messages array
    const messagesWithSystem = [
      { role: "system", content: systemMessage },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Generate a streaming response using the OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesWithSystem,
      stream: true,
    })

    // Convert the response to a readable stream and return it
    return new StreamingTextResponse(response)
  } catch (error) {
    console.error("AI chat error:", error)
    return new Response(JSON.stringify({ error: "Failed to generate AI response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
