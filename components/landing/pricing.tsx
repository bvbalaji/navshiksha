import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      description: "Perfect for trying out NavShiksha",
      price: "₹0",
      duration: "forever",
      features: [
        "Access to 5 basic courses",
        "Limited AI tutor interactions",
        "Basic progress tracking",
        "Community forum access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Ideal for dedicated students",
      price: "₹499",
      duration: "per month",
      features: [
        "Unlimited access to all courses",
        "Unlimited AI tutor interactions",
        "Advanced progress analytics",
        "Priority support",
        "Downloadable resources",
        "No ads",
      ],
      cta: "Start Pro Plan",
      popular: true,
    },
    {
      name: "Family",
      description: "Perfect for families",
      price: "₹999",
      duration: "per month",
      features: [
        "Everything in Pro plan",
        "Up to 5 user accounts",
        "Parent dashboard",
        "Family progress reports",
        "Shared learning resources",
        "24/7 premium support",
      ],
      cta: "Start Family Plan",
      popular: false,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-purple-100 px-3 py-1 text-sm text-purple-500 dark:bg-purple-900 dark:text-purple-300">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Simple, transparent pricing</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose the plan that's right for you and start your learning journey today.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col border-2 ${
                plan.popular ? "border-purple-500 dark:border-purple-400" : "border-gray-200 dark:border-gray-800"
              }`}
            >
              {plan.popular && (
                <div className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-b-lg w-fit mx-auto">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400"> / {plan.duration}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/signup" className="w-full">
                  <Button
                    className={`w-full ${plan.popular ? "bg-purple-500 hover:bg-purple-600 text-white" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mx-auto max-w-3xl text-center mt-8">
          <p className="text-gray-500 dark:text-gray-400">
            All plans include a 7-day free trial. No credit card required. Cancel anytime.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Need a custom plan for your school or organization?{" "}
            <Link href="/contact" className="text-purple-500 hover:underline dark:text-purple-400">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
