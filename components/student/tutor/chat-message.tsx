import type { Message } from "ai"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "mb-4 p-3 rounded-lg",
        isUser
          ? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
          : "bg-gray-100 dark:bg-gray-800 mr-auto max-w-[80%]",
      )}
    >
      <p className="text-sm font-semibold mb-1">{isUser ? "You" : "AI Tutor"}</p>
      <div className="whitespace-pre-wrap">{message.content}</div>
    </div>
  )
}
