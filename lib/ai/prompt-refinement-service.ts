export interface PromptMetrics {
  clarity: number // 1-10
  context: number // 1-10
  specificity: number // 1-10
  complexity: number // 1-10 (higher means more complex)
  structure: number // 1-10
  overallScore: number // 1-10
}

export interface PromptRefinementResult {
  originalPrompt: string
  metrics: PromptMetrics
  suggestions: string[]
  refinedPrompt: string
  subjectArea: string
}

// Define sets for various evaluation criteria
const CLARITY_INDICATORS = new Set([
  "what",
  "how",
  "why",
  "when",
  "where",
  "who",
  "define",
  "explain",
  "describe",
  "elaborate",
  "clarify",
  "illustrate",
  "demonstrate",
])

const CONTEXT_INDICATORS = new Set([
  "because",
  "since",
  "as",
  "due to",
  "given that",
  "considering",
  "taking into account",
  "based on",
  "referring to",
  "regarding",
  "concerning",
  "about",
  "in relation to",
  "in the context of",
  "with respect to",
])

const SPECIFICITY_INDICATORS = new Set([
  "specifically",
  "precisely",
  "exactly",
  "particularly",
  "in particular",
  "especially",
  "notably",
  "namely",
  "for instance",
  "for example",
  "e.g.",
  "such as",
  "including",
  "excluding",
  "except",
])

const VAGUE_TERMS = new Set([
  "thing",
  "stuff",
  "something",
  "anything",
  "everything",
  "nothing",
  "somewhere",
  "anywhere",
  "nowhere",
  "somehow",
  "anyhow",
  "anyway",
  "good",
  "bad",
  "nice",
  "many",
  "few",
  "several",
  "some",
  "most",
  "various",
  "a lot",
  "very",
])

const STRUCTURAL_INDICATORS = new Set([
  "first",
  "second",
  "third",
  "next",
  "then",
  "finally",
  "lastly",
  "also",
  "additionally",
  "furthermore",
  "moreover",
  "in addition",
  "consequently",
  "therefore",
  "thus",
  "hence",
  "as a result",
  "in conclusion",
  "to summarize",
  "in summary",
])

const SUBJECT_SPECIFIC_TERMS = new Map([
  [
    "mathematics",
    new Set([
      "equation",
      "formula",
      "theorem",
      "proof",
      "calculation",
      "integral",
      "derivative",
      "function",
      "variable",
      "algebra",
      "geometry",
      "calculus",
      "trigonometry",
      "statistics",
    ]),
  ],
  [
    "science",
    new Set([
      "experiment",
      "hypothesis",
      "theory",
      "observation",
      "data",
      "evidence",
      "research",
      "laboratory",
      "chemical",
      "reaction",
      "physics",
      "biology",
      "chemistry",
      "genetics",
      "molecule",
    ]),
  ],
  [
    "history",
    new Set([
      "event",
      "date",
      "period",
      "era",
      "century",
      "decade",
      "war",
      "revolution",
      "civilization",
      "empire",
      "dynasty",
      "monarchy",
      "democracy",
      "republic",
      "treaty",
      "reformation",
    ]),
  ],
  [
    "literature",
    new Set([
      "novel",
      "poem",
      "poetry",
      "character",
      "plot",
      "theme",
      "setting",
      "narrator",
      "author",
      "genre",
      "metaphor",
      "simile",
      "allegory",
      "symbolism",
      "prose",
      "stanza",
    ]),
  ],
  [
    "computer-science",
    new Set([
      "algorithm",
      "data structure",
      "function",
      "method",
      "class",
      "object",
      "variable",
      "loop",
      "conditional",
      "recursion",
      "database",
      "query",
      "api",
      "interface",
      "compiler",
      "runtime",
    ]),
  ],
])

// Helper function to count word occurrences
function countWordOccurrences(text: string, wordSet: Set<string>): number {
  const words = text.toLowerCase().split(/\s+/)
  let count = 0

  words.forEach((word) => {
    if (wordSet.has(word)) count++
  })

  // Also check for phrases (up to 4 words)
  const phrases = []
  for (let i = 0; i < words.length; i++) {
    if (i + 1 < words.length) phrases.push(`${words[i]} ${words[i + 1]}`)
    if (i + 2 < words.length) phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
    if (i + 3 < words.length) phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]} ${words[i + 3]}`)
  }

  phrases.forEach((phrase) => {
    if (wordSet.has(phrase)) count++
  })

  return count
}

// Function to calculate sentence complexity
function calculateSentenceComplexity(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim() !== "")

  if (sentences.length === 0) return 5 // Default value

  let totalComplexity = 0

  sentences.forEach((sentence) => {
    const words = sentence
      .trim()
      .split(/\s+/)
      .filter((w) => w !== "")
    const wordCount = words.length

    // Factors affecting complexity:
    // 1. Sentence length
    const lengthScore = Math.min(10, wordCount / 3)

    // 2. Presence of conjunctions
    const conjunctions = new Set(["and", "or", "but", "because", "since", "although", "though", "while", "whereas"])
    const conjunctionCount = countWordOccurrences(sentence, conjunctions)
    const conjunctionScore = Math.min(10, conjunctionCount * 2)

    // 3. Comma count (often indicates clause complexity)
    const commaCount = (sentence.match(/,/g) || []).length
    const commaScore = Math.min(10, commaCount * 2)

    // Calculate weighted average for this sentence
    const sentenceComplexity = lengthScore * 0.4 + conjunctionScore * 0.3 + commaScore * 0.3
    totalComplexity += sentenceComplexity
  })

  return Math.round(totalComplexity / sentences.length)
}

// Function to analyze the structure of the prompt
function analyzeStructure(text: string): number {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim() !== "")
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim() !== "")

  if (sentences.length === 0) return 5 // Default value

  // 1. Multiple paragraphs are better for structure
  const paragraphScore = Math.min(10, paragraphs.length * 2.5)

  // 2. Presence of structural indicators
  const structuralTermCount = countWordOccurrences(text, STRUCTURAL_INDICATORS)
  const structuralTermScore = Math.min(10, structuralTermCount * 2)

  // 3. Balanced sentence lengths
  let sentenceLengthVariance = 0
  const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).length)
  const avgLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentences.length

  sentenceLengths.forEach((length) => {
    sentenceLengthVariance += Math.abs(length - avgLength)
  })

  const balanceScore = 10 - Math.min(10, sentenceLengthVariance / sentences.length)

  // Calculate weighted score
  return Math.round(paragraphScore * 0.3 + structuralTermScore * 0.4 + balanceScore * 0.3)
}

// Generate suggestions based on metrics
function generateSuggestions(metrics: PromptMetrics, text: string, subjectArea: string): string[] {
  const suggestions: string[] = []

  // Clarity suggestions
  if (metrics.clarity < 6) {
    suggestions.push("Be more explicit about what you're asking. Consider starting with 'What', 'How', 'Why', etc.")
    suggestions.push("Clearly state the specific concept or problem you need help with.")
  }

  // Context suggestions
  if (metrics.context < 6) {
    suggestions.push("Provide more background information related to your question.")
    suggestions.push("Mention what you already know about the topic to help frame your question.")
  }

  // Specificity suggestions
  if (metrics.specificity < 6) {
    suggestions.push("Use more specific terms instead of vague words like 'thing', 'stuff', etc.")
    if (subjectArea !== "general" && SUBJECT_SPECIFIC_TERMS.has(subjectArea)) {
      suggestions.push(`Include relevant ${subjectArea} terminology to make your question more precise.`)
    }
  }

  // Complexity suggestions
  if (metrics.complexity > 8) {
    suggestions.push("Consider breaking down your question into smaller, more manageable parts.")
    suggestions.push("Use shorter, clearer sentences to express your question.")
  } else if (metrics.complexity < 4) {
    suggestions.push("Expand your question to include more details and nuance.")
  }

  // Structure suggestions
  if (metrics.structure < 6) {
    suggestions.push("Organize your question with a clear beginning, middle, and end.")
    suggestions.push("Use connectors like 'first', 'next', 'finally' to improve the flow of your question.")
  }

  // Limit to top 3 most important suggestions
  return suggestions.slice(0, 3)
}

// Function to refine the prompt based on analysis
function refinePrompt(originalPrompt: string, metrics: PromptMetrics, subjectArea: string): string {
  // This is a simplified prompt refinement logic
  // A more sophisticated implementation would use NLP techniques

  let refinedPrompt = originalPrompt

  // Add clear question indicator if missing
  if (metrics.clarity < 6 && !CLARITY_INDICATORS.has(refinedPrompt.split(" ")[0].toLowerCase())) {
    const questions = ["Can you explain", "Please help me understand", "I'd like to know"]
    refinedPrompt = `${questions[Math.floor(Math.random() * questions.length)]} ${refinedPrompt}`
  }

  // Add context indicator if missing
  if (metrics.context < 6 && !refinedPrompt.toLowerCase().includes("context")) {
    refinedPrompt = `${refinedPrompt} For context, I'm trying to understand this topic at a ${subjectArea === "general" ? "basic" : subjectArea} level.`
  }

  // Replace vague terms with more specific alternatives
  if (metrics.specificity < 6) {
    VAGUE_TERMS.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi")
      if (refinedPrompt.match(regex)) {
        switch (term) {
          case "thing":
            refinedPrompt = refinedPrompt.replace(regex, "concept")
            break
          case "stuff":
            refinedPrompt = refinedPrompt.replace(regex, "material")
            break
          case "good":
            refinedPrompt = refinedPrompt.replace(regex, "effective")
            break
          case "bad":
            refinedPrompt = refinedPrompt.replace(regex, "problematic")
            break
          // Add more replacements as needed
        }
      }
    })
  }

  // Improve structure if needed
  if (metrics.structure < 6 && !refinedPrompt.includes(".") && refinedPrompt.length > 50) {
    // Break into multiple sentences for very long prompts without periods
    refinedPrompt = refinedPrompt.replace(/\s+(?=\w+\s+\w+\s+\w+\s+and)/g, ". ")
  }

  // Add a specific request at the end if the prompt doesn't end with a question mark
  if (!refinedPrompt.trim().endsWith("?") && !refinedPrompt.trim().endsWith(".")) {
    refinedPrompt = `${refinedPrompt}?`
  }

  return refinedPrompt
}

// Main analysis function
export async function analyzePrompt(prompt: string, subjectArea: string): Promise<PromptRefinementResult> {
  try {
    // If prompt is empty or too short, return default values
    if (!prompt || prompt.trim().length < 5) {
      return {
        originalPrompt: prompt,
        metrics: {
          clarity: 3,
          context: 3,
          specificity: 3,
          complexity: 5,
          structure: 3,
          overallScore: 3,
        },
        suggestions: ["Your question is too short. Please provide more details."],
        refinedPrompt: prompt,
        subjectArea,
      }
    }

    // Check for minimum word count (4 words)
    const wordCount = prompt.trim().split(/\s+/).length
    if (wordCount < 4) {
      return {
        originalPrompt: prompt,
        metrics: {
          clarity: 3,
          context: 2,
          specificity: 2,
          complexity: 1,
          structure: 2,
          overallScore: 2,
        },
        suggestions: [
          "Your question is too brief. Please use at least 4 words.",
          "Add more details about what you're trying to understand.",
          "Consider explaining what specific aspect you need help with.",
        ],
        refinedPrompt: `Could you please elaborate more on ${prompt}? I need more details to provide a helpful answer.`,
        subjectArea,
      }
    }

    // 1. Calculate clarity score
    const clarityScore = Math.min(10, Math.round(countWordOccurrences(prompt, CLARITY_INDICATORS) * 2 + 2))

    // 2. Calculate context score
    const contextScore = Math.min(10, Math.round(countWordOccurrences(prompt, CONTEXT_INDICATORS) * 2.5 + 2))

    // 3. Calculate specificity score
    let specificityScore = Math.min(10, Math.round(countWordOccurrences(prompt, SPECIFICITY_INDICATORS) * 2 + 2))

    // Reduce specificity score based on vague terms
    const vagueTermCount = countWordOccurrences(prompt, VAGUE_TERMS)
    specificityScore = Math.max(1, specificityScore - vagueTermCount)

    // Add subject-specific term bonus
    if (subjectArea !== "general" && SUBJECT_SPECIFIC_TERMS.has(subjectArea)) {
      const subjectTerms = SUBJECT_SPECIFIC_TERMS.get(subjectArea)!
      const subjectTermCount = countWordOccurrences(prompt, subjectTerms)
      specificityScore = Math.min(10, specificityScore + subjectTermCount)
    }

    // 4. Calculate complexity score
    const complexityScore = calculateSentenceComplexity(prompt)

    // 5. Calculate structure score
    const structureScore = analyzeStructure(prompt)

    // 6. Calculate overall score (weighted average)
    const overallScore = Math.round(
      clarityScore * 0.25 +
        contextScore * 0.2 +
        specificityScore * 0.25 +
        Math.min(8, complexityScore) * 0.1 + // penalize excessive complexity
        structureScore * 0.2,
    )

    // Compile metrics
    const metrics: PromptMetrics = {
      clarity: clarityScore,
      context: contextScore,
      specificity: specificityScore,
      complexity: complexityScore,
      structure: structureScore,
      overallScore,
    }

    // Generate suggestions based on metrics
    const suggestions = generateSuggestions(metrics, prompt, subjectArea)

    // Refine the prompt based on analysis
    const refinedPrompt = refinePrompt(prompt, metrics, subjectArea)

    return {
      originalPrompt: prompt,
      metrics,
      suggestions,
      refinedPrompt,
      subjectArea,
    }
  } catch (error) {
    console.error("Error analyzing prompt:", error)
    // Return a default response if analysis fails
    return {
      originalPrompt: prompt,
      metrics: {
        clarity: 5,
        context: 5,
        specificity: 5,
        complexity: 5,
        structure: 5,
        overallScore: 5,
      },
      suggestions: ["Could not analyze prompt. Try to be more specific and clear."],
      refinedPrompt: prompt,
      subjectArea,
    }
  }
}
