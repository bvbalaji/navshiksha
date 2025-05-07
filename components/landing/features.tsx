import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, BookOpen, BarChart, Clock, Users, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      title: "AI-Powered Learning",
      description:
        "Our advanced AI adapts to your learning style and pace, providing personalized guidance every step of the way.",
    },
    {
      icon: <BookOpen className="h-10 w-10 text-indigo-500" />,
      title: "Comprehensive Curriculum",
      description: "Access a wide range of subjects with structured courses designed by educational experts.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-blue-500" />,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics and insights on your strengths and areas for improvement.",
    },
    {
      icon: <Clock className="h-10 w-10 text-cyan-500" />,
      title: "Learn at Your Pace",
      description: "Study whenever and wherever you want with 24/7 access to all learning materials and AI assistance.",
    },
    {
      icon: <Users className="h-10 w-10 text-teal-500" />,
      title: "Interactive Community",
      description: "Connect with fellow learners, share insights, and participate in group learning sessions.",
    },
    {
      icon: <Zap className="h-10 w-10 text-green-500" />,
      title: "Instant Feedback",
      description: "Receive immediate responses to your questions and get real-time assessment of your understanding.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-500 dark:bg-purple-900 dark:text-purple-300">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Everything you need to excel in your studies
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              NavShiksha combines cutting-edge AI technology with proven educational methods to deliver an unparalleled
              learning experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
