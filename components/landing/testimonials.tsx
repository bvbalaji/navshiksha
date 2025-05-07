import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "NavShiksha has completely transformed how I approach my studies. The AI tutor feels like having a personal teacher available 24/7.",
      author: "Priya Sharma",
      role: "Engineering Student",
      avatar: "PS",
    },
    {
      quote:
        "As a working professional, finding time to study was always challenging. NavShiksha's flexible learning approach has made it possible for me to upskill at my own pace.",
      author: "Rahul Mehta",
      role: "Software Developer",
      avatar: "RM",
    },
    {
      quote:
        "My daughter's grades have improved significantly since she started using NavShiksha. The personalized approach addresses her specific learning needs.",
      author: "Anita Patel",
      role: "Parent",
      avatar: "AP",
    },
    {
      quote:
        "The instant feedback and adaptive learning path have helped me master complex topics that I previously struggled with. Highly recommended!",
      author: "Vikram Singh",
      role: "College Student",
      avatar: "VS",
    },
    {
      quote:
        "As an educator, I'm impressed by the pedagogical approach NavShiksha takes. It's not just about answers, but building true understanding.",
      author: "Dr. Meenakshi Iyer",
      role: "University Professor",
      avatar: "MI",
    },
    {
      quote:
        "The progress tracking features help me identify exactly where I need to focus my efforts. It's like having a study coach guiding me all the way.",
      author: "Arjun Nair",
      role: "High School Student",
      avatar: "AN",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-sm text-indigo-500 dark:bg-indigo-900 dark:text-indigo-300">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Trusted by students and educators alike
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear what our users have to say about their experience with NavShiksha.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-indigo-200 mb-2" />
                <p className="text-gray-700 dark:text-gray-300">{testimonial.quote}</p>
              </CardContent>
              <CardFooter>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.author}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
