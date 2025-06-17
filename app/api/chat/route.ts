import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    console.log("API route called")

    const { messages } = await req.json()
    console.log("Messages received:", messages)

    // Check if environment variables are set
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set")
      return new Response("OpenAI API key not configured", { status: 500 })
    }

    // For now, let's use regular OpenAI chat completions with a system prompt
    // that includes instructions about your data dictionaries
    const systemPrompt = `You are a helpful business assistant with extensive knowledge of the company's data dictionaries and business information. 

You help business users understand:
- Data definitions and field meanings
- Data relationships and dependencies  
- Business metrics and KPIs
- Data quality rules and validation
- Reporting and analytics questions

Provide clear, concise answers based on the company's data structure. If you need more specific information about a particular data element, ask clarifying questions.

Assistant ID being used: ${process.env.OPENAI_ASSISTANT_ID}`

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      system: systemPrompt,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}
