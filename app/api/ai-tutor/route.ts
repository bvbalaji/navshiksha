import { type NextRequest, NextResponse } from "next/server"
import { generateUI } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { prompt, subject, level, previousMessages } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Construct context from previous messages
    const messageHistory = previousMessages
      ? previousMessages.map((msg: any) => `${msg.role}: ${msg.content}`).join("\n")
      : ""

    // Generate response using AI SDK
    const { text } = await generateUI({
      model: openai("gpt-4o"),
      messages: `You are an AI tutor specializing in ${subject || "general education"} 
              for ${level || "all"} level students.
              
              Previous conversation:
              ${messageHistory}
              
              Student: ${prompt}
              
              Provide a helpful, educational response that explains concepts clearly 
              and encourages critical thinking. If appropriate, include examples, 
              analogies, or practice problems to reinforce learning.`,
      maxTokens: 1000,
    })

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in AI tutor API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
