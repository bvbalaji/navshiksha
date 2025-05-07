"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { PromptMetricsDisplay } from "./prompt-metrics"
import { analyzePrompt, type PromptRefinementResult } from "@/lib/ai/prompt-refinement-service"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface PromptRefinementDialogProps {
  isOpen: boolean
  onClose: () => void
  initialPrompt: string
  subjectArea: string
  onSubmit: (refinedPrompt: string) => void
}

export function PromptRefinementDialog({
  isOpen,
  onClose,
  initialPrompt,
  subjectArea,
  onSubmit,
}: PromptRefinementDialogProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PromptRefinementResult | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<"original" | "refined">("original")

  const handleAnalyze = async () => {
    if (!prompt.trim()) return

    setIsAnalyzing(true)
    try {
      const result = await analyzePrompt(prompt, subjectArea)
      setResult(result)
      // Default to refined if it's significantly better
      if (result.metrics.overallScore > 7) {
        setSelectedPrompt("refined")
      }
    } catch (error) {
      console.error("Error analyzing prompt:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = () => {
    if (selectedPrompt === "refined" && result) {
      onSubmit(result.refinedPrompt)
    } else {
      onSubmit(prompt)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Refine Your Question</DialogTitle>
          <DialogDescription>
            Let's analyze your question to make it more effective and get better answers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your question here..."
            className="min-h-[100px]"
          />

          <Button onClick={handleAnalyze} disabled={isAnalyzing || !prompt.trim()} className="w-full">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Question"
            )}
          </Button>
        </div>

        {result && (
          <div className="space-y-6 border rounded-lg p-4">
            <PromptMetricsDisplay metrics={result.metrics} />

            {result.suggestions.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Suggestions for Improvement</h3>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm flex">
                      <AlertCircle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Choose a Version</h3>
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    selectedPrompt === "original" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPrompt("original")}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Original</span>
                    {selectedPrompt === "original" && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm text-gray-600">{result.originalPrompt}</p>
                </div>

                <div
                  className={`border rounded-md p-3 cursor-pointer ${
                    selectedPrompt === "refined" ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedPrompt("refined")}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Refined</span>
                    {selectedPrompt === "refined" && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-sm text-gray-600">{result.refinedPrompt}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit Question</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
