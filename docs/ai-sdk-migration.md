# AI SDK Migration Guide

This document explains the migration from the old AI SDK functions to the new OpenAI SDK approach.

## Changes Made

We've updated our AI implementation to use the OpenAI SDK directly instead of the previous approach. This change was necessary because some functions like `generateUI` and `streamUI` were causing import errors.

### Before:

\`\`\`typescript
import { generateUI, streamUI } from "ai"
import { openai } from "@ai-sdk/openai"

// Non-streaming response
const { text } = await generateUI({
  model: openai("gpt-4o"),
  prompt: "What is love?",
  system: "You are a helpful assistant."
})

// Streaming response
const result = streamUI({
  model: openai("gpt-4o"),
  messages: messages,
  system: "You are a helpful assistant."
})
return result.toDataStreamResponse()
\`\`\`

### After:

\`\`\`typescript
import { OpenAI } from "openai"
import { StreamingTextResponse } from "ai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Non-streaming response
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "What is love?" }
  ],
  max_tokens: 500
})
const text = completion.choices[0]?.message?.content || ""

// Streaming response
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    ...messages
  ],
  stream: true
})
return new StreamingTextResponse(response)
\`\`\`

## Required Environment Variables

Make sure you have the following environment variable set:

\`\`\`
OPENAI_API_KEY=your-api-key-here
\`\`\`

## Dependencies

This approach requires the following packages:

- `openai`: For direct API access
- `ai`: For the StreamingTextResponse utility (for streaming responses)

## Benefits

1. More direct control over the OpenAI API
2. Better error handling
3. More consistent with OpenAI documentation
4. Fewer dependencies
5. More reliable builds
