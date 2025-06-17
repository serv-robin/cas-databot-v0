import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// This is where you would configure the system prompt with knowledge of your data dictionaries
const SYSTEM_PROMPT = `
You are a helpful business assistant with extensive knowledge of the company's data dictionaries.
You help business users understand data definitions, relationships, and answer questions about business metrics.
Provide clear, concise answers based on the company's data structure.
`

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: SYSTEM_PROMPT,
  })

  return result.toDataStreamResponse()
}
