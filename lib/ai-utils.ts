import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Function to generate a personalized learning plan
export async function generateLearningPlan(subject: string, level: string, goals: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Create a personalized learning plan for a student studying ${subject} at ${level} level.
              Their learning goals are: ${goals}
              
              Format the learning plan with:
              1. Weekly objectives
              2. Recommended resources
              3. Practice exercises
              4. Assessment criteria
              
              Make the plan comprehensive, structured, and tailored to the specific subject and level.
              Include clear headings and organize the content in a way that's easy to follow.`,
      maxTokens: 1500,
    })

    return { success: true, plan: text }
  } catch (error) {
    console.error("Error generating learning plan:", error)
    return {
      success: false,
      error: "Failed to generate learning plan. Please try again later.",
    }
  }
}

// Function to evaluate student answers
export async function evaluateAnswer(question: string, studentAnswer: string, subject: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert ${subject} tutor.
              
              Question: ${question}
              Student's answer: ${studentAnswer}
              
              Evaluate the student's answer and provide:
              1. Whether the answer is correct or not
              2. A detailed explanation of the correct approach
              3. Specific feedback on what the student did well or needs to improve
              4. A follow-up question to deepen understanding`,
      maxTokens: 800,
    })

    return { success: true, evaluation: text }
  } catch (error) {
    console.error("Error evaluating answer:", error)
    return {
      success: false,
      error: "Failed to evaluate your answer. Please try again later.",
    }
  }
}

// Function to generate practice questions
export async function generatePracticeQuestions(subject: string, topic: string, difficulty: string, count = 5) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate ${count} practice questions about ${topic} in ${subject} at ${difficulty} difficulty level.
              
              For each question:
              1. Provide a clear question
              2. Include the correct answer
              3. Add a brief explanation of the solution
              
              Format each question with a number, then the question, then "Answer:" followed by the answer, then "Explanation:" followed by the explanation.`,
      maxTokens: 1500,
    })

    return { success: true, questions: text }
  } catch (error) {
    console.error("Error generating practice questions:", error)
    return {
      success: false,
      error: "Failed to generate practice questions. Please try again later.",
    }
  }
}
