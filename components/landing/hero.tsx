import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function LandingHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Learn Smarter with AI-Powered Personalized Tutoring
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                NavShiksha adapts to your learning style, provides instant feedback, and helps you master any subject at
                your own pace.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-6">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  Explore Courses
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="inline-block h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                  ))}
                </div>
                <div className="ml-2 text-gray-500 dark:text-gray-400">Join 10,000+ students</div>
              </div>
              <div className="flex items-center">
                <div className="mr-1 text-yellow-500">★★★★★</div>
                <div className="text-gray-500 dark:text-gray-400">4.9/5 rating</div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-90"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <div className="font-medium">NavShiksha AI Tutor</div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm">How do I solve this quadratic equation: x² + 5x + 6 = 0?</p>
                    </div>
                    <div className="bg-indigo-600/50 rounded-lg p-3">
                      <p className="text-sm">
                        To solve x² + 5x + 6 = 0, we'll use factoring:
                        <br />
                        1. Find two numbers that multiply to 6 and add to 5
                        <br />
                        2. These numbers are 2 and 3
                        <br />
                        3. So x² + 5x + 6 = (x + 2)(x + 3) = 0
                        <br />
                        4. Therefore, x = -2 or x = -3
                      </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm">Can you explain how you got those factors?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
