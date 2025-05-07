import type { PromptMetrics } from "@/lib/ai/prompt-refinement-service"
import { Progress } from "@/components/ui/progress"

interface PromptMetricsProps {
  metrics: PromptMetrics
}

export function PromptMetricsDisplay({ metrics }: PromptMetricsProps) {
  const metricItems = [
    { name: "Clarity", value: metrics.clarity, description: "How clear and understandable your question is" },
    {
      name: "Context",
      value: metrics.context,
      description: "How much relevant background information you've provided",
    },
    { name: "Specificity", value: metrics.specificity, description: "How precise and focused your question is" },
    {
      name: "Complexity",
      value: metrics.complexity,
      description: "How complex your question is (not necessarily better or worse)",
    },
    { name: "Structure", value: metrics.structure, description: "How well-organized your question is" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Overall Score</h3>
        <div className="flex items-center">
          <span className="text-2xl font-bold">{metrics.overallScore}</span>
          <span className="text-sm text-gray-500 ml-1">/10</span>
        </div>
      </div>

      <Progress value={metrics.overallScore * 10} className="h-2" />

      <div className="space-y-3 mt-4">
        {metricItems.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm font-medium">{metric.name}</span>
                <span className="ml-2 text-xs text-gray-500">({metric.value}/10)</span>
              </div>
            </div>
            <Progress value={metric.value * 10} className="h-1.5" />
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
