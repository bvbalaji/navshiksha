import { OpenAI } from "openai"

// Allow responses up to 30 seconds
export const maxDuration = 30

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    // Extract the prompt and optional parameters from the request
    const { prompt, subject, maxTokens = 500 } = await req.json()

    // Create system message based on subject
    const systemMessage = subject
      ? `You are an expert tutor specializing in ${subject}. Provide clear, educational responses that help students understand concepts deeply.`
      : "You are an AI tutor for Navshiksha, an educational platform. Help students learn effectively by providing clear explanations and examples."

    // Generate a response using the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      max_tokens: maxTokens,
    })

    const text = completion.choices[0]?.message?.content || ""

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
