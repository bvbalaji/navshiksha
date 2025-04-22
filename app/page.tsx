import Link from "next/link"
import { BookOpen, Brain, Lightbulb, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { NavButtons } from "@/components/nav-buttons"
import { HeroButtons } from "@/components/hero-buttons"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-2 items-center text-primary">
            <Brain className="h-6 w-6" />
            <span className="text-xl font-bold">Navshiksha</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="#subjects"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Subjects
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                About
              </Link>
              <NavButtons />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                      Personalized AI Tutoring for Every Student
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Learn at your own pace with our AI-powered tutoring platform. Adaptive learning paths tailored to
                      your unique needs.
                    </p>
                  </div>
                  <HeroButtons />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 via-indigo-50 to-blue-100 p-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="space-y-4 p-6 text-center">
                      <Sparkles className="mx-auto h-12 w-12 text-primary" />
                      <h3 className="text-2xl font-bold">AI-Powered Learning</h3>
                      <p className="text-muted-foreground">
                        Our intelligent system adapts to your learning style and pace, providing personalized guidance
                        every step of the way.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Why Choose Navshiksha?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines cutting-edge AI with proven educational methodologies to deliver an unparalleled
                  learning experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Brain className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2">Adaptive Learning</CardTitle>
                  <CardDescription>
                    Our AI analyzes your learning patterns and adjusts content difficulty in real-time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    The system continuously evolves with you, ensuring optimal challenge levels for maximum retention
                    and growth.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lightbulb className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2">Personalized Feedback</CardTitle>
                  <CardDescription>
                    Receive detailed insights on your progress and targeted suggestions for improvement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our AI provides constructive feedback that highlights strengths and identifies areas needing
                    additional focus.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2">Comprehensive Curriculum</CardTitle>
                  <CardDescription>
                    Access a wide range of subjects with content aligned to educational standards.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    From mathematics to literature, our platform covers diverse subjects with depth and academic rigor.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="subjects" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Explore Our Subjects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover a wide range of subjects tailored to different educational levels and learning objectives.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              {subjects.map((subject) => (
                <Card key={subject.name} className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-muted/80 to-muted flex items-center justify-center">
                    {subject.icon}
                  </div>
                  <CardHeader>
                    <CardTitle>{subject.name}</CardTitle>
                    <CardDescription>{subject.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Explore
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <div className="flex items-center gap-2 text-primary">
            <Brain className="h-5 w-5" />
            <span className="text-lg font-bold">Navshiksha</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Navshiksha. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

const subjects = [
  {
    name: "Mathematics",
    description: "From algebra to calculus, master mathematical concepts with interactive lessons.",
    icon: <div className="text-4xl">📊</div>,
  },
  {
    name: "Science",
    description: "Explore physics, chemistry, and biology through engaging experiments and simulations.",
    icon: <div className="text-4xl">🔬</div>,
  },
  {
    name: "Language Arts",
    description: "Develop reading comprehension, writing skills, and literary analysis.",
    icon: <div className="text-4xl">📚</div>,
  },
]
