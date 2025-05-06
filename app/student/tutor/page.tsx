import TutorAIChat from "@/components/student/tutor/tutor-ai-chat"

export const metadata = {
  title: "AI Tutor | NavShiksha",
  description: "Get help from our AI tutor with your studies",
}

export default function TutorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AI Tutor</h1>
      <p className="text-gray-600 mb-8">
        Ask questions and get instant help with your studies. Our AI tutor is here to assist you 24/7.
      </p>
      <TutorAIChat />
    </div>
  )
}
