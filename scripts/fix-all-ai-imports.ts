import * as fs from "fs"
import * as glob from "glob"

// Function to recursively find all TypeScript files
function findTsFiles(dir: string): string[] {
  return glob.sync(`${dir}/**/*.{ts,tsx}`, {
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/scripts/**"],
  })
}

// Function to check if a file contains problematic imports
function hasProblematicImports(content: string): boolean {
  const problematicPatterns = [
    /import\s+{\s*generateUI\s*}/,
    /import\s+{\s*[^}]*generateUI[^}]*\s*}/,
    /import\s+{\s*streamUI\s*}/,
    /import\s+{\s*[^}]*streamUI[^}]*\s*}/,
    /generateUI\s*\(/,
    /streamUI\s*\(/,
  ]

  return problematicPatterns.some((pattern) => pattern.test(content))
}

// Function to fix the imports and function calls
function fixAiImports(content: string, filePath: string): string {
  console.log(`Processing ${filePath}`)

  // Check if the file is using OpenAI already
  const hasOpenAIImport = /import\s+.*\s+from\s+['"]openai['"]/g.test(content)
  const hasStreamingImport = /import\s+.*\s+from\s+['"]ai['"]/g.test(content)

  // Replace imports
  let updatedContent = content

  // Replace generateUI imports
  if (/import\s+{\s*generateUI\s*}\s+from\s+['"]ai['"]/g.test(updatedContent)) {
    updatedContent = updatedContent.replace(
      /import\s+{\s*generateUI\s*}\s+from\s+['"]ai['"]/g,
      `import { OpenAI } from "openai"`,
    )
  } else if (/import\s+{\s*[^}]*generateUI[^}]*\s*}\s+from\s+['"]ai['"]/g.test(updatedContent)) {
    // Handle mixed imports
    updatedContent = updatedContent.replace(
      /import\s+{([^}]*)generateUI([^}]*)}\s+from\s+['"]ai['"]/g,
      (match, before, after) => {
        const remainingImports = `${before}${after}`.replace(/,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "")
        if (remainingImports.trim()) {
          return `import { OpenAI } from "openai"\nimport { ${remainingImports} } from "ai"`
        } else {
          return `import { OpenAI } from "openai"`
        }
      },
    )
  }

  // Replace streamUI imports
  if (/import\s+{\s*streamUI\s*}\s+from\s+['"]ai['"]/g.test(updatedContent)) {
    updatedContent = updatedContent.replace(
      /import\s+{\s*streamUI\s*}\s+from\s+['"]ai['"]/g,
      `import { OpenAI } from "openai"\nimport { StreamingTextResponse } from "ai"`,
    )
  } else if (/import\s+{\s*[^}]*streamUI[^}]*\s*}\s+from\s+['"]ai['"]/g.test(updatedContent)) {
    // Handle mixed imports
    updatedContent = updatedContent.replace(
      /import\s+{([^}]*)streamUI([^}]*)}\s+from\s+['"]ai['"]/g,
      (match, before, after) => {
        const remainingImports = `${before}${after}`.replace(/,\s*,/g, ",").replace(/^\s*,\s*|\s*,\s*$/g, "")
        if (remainingImports.trim()) {
          return `import { OpenAI } from "openai"\nimport { StreamingTextResponse, ${remainingImports} } from "ai"`
        } else {
          return `import { OpenAI } from "openai"\nimport { StreamingTextResponse } from "ai"`
        }
      },
    )
  }

  // Add OpenAI initialization if needed
  if (
    !hasOpenAIImport &&
    (updatedContent.includes("OpenAI") || /generateUI\s*\(/g.test(content) || /streamUI\s*\(/g.test(content))
  ) {
    const importStatements = updatedContent.match(/import\s+.*\s+from\s+['"]\w+['"]/g) || []
    const lastImportIndex =
      importStatements.length > 0
        ? updatedContent.lastIndexOf(importStatements[importStatements.length - 1]) +
          importStatements[importStatements.length - 1].length
        : 0

    const openaiInitCode = `

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
`

    updatedContent = updatedContent.slice(0, lastImportIndex) + openaiInitCode + updatedContent.slice(lastImportIndex)
  }

  // Replace generateUI function calls
  updatedContent = updatedContent.replace(
    /const\s+{\s*text\s*}\s*=\s*await\s+generateUI\s*$$\s*{([^}]*)}\s*$$/g,
    (match, params) => {
      // Parse parameters
      const modelMatch = params.match(/model\s*:\s*openai\s*$$\s*["']([^"']+)["']\s*$$/)
      const model = modelMatch ? modelMatch[1] : "gpt-4o"

      const promptMatch = params.match(/prompt\s*:\s*["']([^"']+)["']/)
      const prompt = promptMatch ? promptMatch[1] : ""

      const systemMatch = params.match(/system\s*:\s*["']([^"']+)["']/)
      const system = systemMatch ? systemMatch[1] : ""

      const maxTokensMatch = params.match(/maxTokens\s*:\s*(\d+)/)
      const maxTokens = maxTokensMatch ? maxTokensMatch[1] : "500"

      return `// Generate a response using the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "${model}",
      messages: [
        ${system ? `{ role: "system", content: ${system.includes('"') ? system : `"${system}"`} },` : ""}
        { role: "user", content: ${prompt.includes('"') ? prompt : `"${prompt}"`} }
      ],
      max_tokens: ${maxTokens}
    })

    const text = completion.choices[0]?.message?.content || ""`
    },
  )

  // Replace streamUI function calls
  updatedContent = updatedContent.replace(/const\s+result\s*=\s*streamUI\s*$$\s*{([^}]*)}\s*$$/g, (match, params) => {
    // Parse parameters
    const modelMatch = params.match(/model\s*:\s*openai\s*$$\s*["']([^"']+)["']\s*$$/)
    const model = modelMatch ? modelMatch[1] : "gpt-4o"

    const messagesMatch = params.match(/messages\s*:\s*([^,]+)/)
    const messages = messagesMatch ? messagesMatch[1] : "[]"

    const systemMatch = params.match(/system\s*:\s*["']([^"']+)["']/)
    const system = systemMatch ? systemMatch[1] : ""

    return `// Generate a streaming response using the OpenAI API
    const response = await openai.chat.completions.create({
      model: "${model}",
      messages: [
        ${system ? `{ role: "system", content: ${system.includes('"') ? system : `"${system}"`} },` : ""}
        ...${messages}
      ],
      stream: true
    })`
  })

  // Replace result.toDataStreamResponse() with StreamingTextResponse
  updatedContent = updatedContent.replace(
    /return\s+result\.toDataStreamResponse$$$$/g,
    `return new StreamingTextResponse(response)`,
  )

  return updatedContent
}

// Main function
async function main() {
  const rootDir = process.cwd()
  const tsFiles = findTsFiles(rootDir)
  let fixedFilesCount = 0

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, "utf8")

    if (hasProblematicImports(content)) {
      const updatedContent = fixAiImports(content, file)

      if (content !== updatedContent) {
        fs.writeFileSync(file, updatedContent, "utf8")
        console.log(`✅ Fixed AI imports in: ${file}`)
        fixedFilesCount++
      }
    }
  }

  console.log(`\nFixed AI imports in ${fixedFilesCount} files.`)
}

main().catch(console.error)
