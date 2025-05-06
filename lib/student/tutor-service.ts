import type { Message } from "ai"

export interface TutorChatRequest {
  messages: Message[]
  studentId: string
  subjectArea?: string
}

export async function submitTutorPrompt(request: TutorChatRequest): Promise<Response> {
  try {
    const response = await fetch("/api/student/tutor/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Error: ${response.status}`)
    }

    return response
  } catch (error) {
    console.error("Error submitting tutor prompt:", error)
    throw error
  }
}

export function saveTutorSession(studentId: string, messages: Message[]): void {
  try {
    // This function would save the chat session to a database
    // For now, we'll just save to localStorage as an example
    const sessions = JSON.parse(localStorage.getItem("tutorSessions") || "{}")

    if (!sessions[studentId]) {
      sessions[studentId] = []
    }

    sessions[studentId].push({
      timestamp: new Date().toISOString(),
      messages,
    })

    localStorage.setItem("tutorSessions", JSON.stringify(sessions))
  } catch (error) {
    console.error("Error saving tutor session:", error)
  }
}
