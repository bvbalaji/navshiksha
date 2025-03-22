import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateLearningContent(topic: string, level: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Create a learning module about ${topic}`,
    system: `You are an expert educational content creator. Generate a comprehensive learning module about ${topic} for ${level} level students. Include an introduction, key concepts, examples, and practice questions.`,
  })

  return text
}

export async function generatePersonalizedFeedback(submission: string, topic: string, level: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: submission,
    system: `You are an expert teacher providing feedback on a student's work about ${topic} at the ${level} level. Be encouraging but thorough in your assessment. Highlight strengths and suggest specific improvements.`,
  })

  return text
}

export async function generateAdaptiveQuestions(topic: string, level: string, previousResponses: string[]) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Generate adaptive questions about ${topic} based on previous responses: ${previousResponses.join(", ")}`,
    system: `You are an expert in adaptive learning. Create questions about ${topic} for a ${level} level student that adapt based on their previous responses. If they've been answering correctly, make questions more challenging. If they've been struggling, make questions more accessible while still being educational.`,
  })

  return text
}

