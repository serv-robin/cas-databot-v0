import { AssistantResponse } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function POST(req: Request) {
  try {
    console.log("API route called")

    const input: {
      threadId: string | null
      message: string
    } = await req.json()

    console.log("Input received:", input)

    // Check if environment variables are set
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not set")
      return new Response("OpenAI API key not configured", { status: 500 })
    }

    if (!process.env.OPENAI_ASSISTANT_ID) {
      console.error("OPENAI_ASSISTANT_ID is not set")
      return new Response("OpenAI Assistant ID not configured", { status: 500 })
    }

    console.log("Environment variables are set")

    // Create a new thread if one doesn't exist
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id
    console.log("Thread ID:", threadId)

    // Add the user's message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: input.message,
    })
    console.log("Message created:", createdMessage.id)

    return AssistantResponse({ threadId, messageId: createdMessage.id }, async ({ forwardStream }) => {
      console.log("Starting assistant run...")

      // Run the assistant
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.OPENAI_ASSISTANT_ID!,
      })

      console.log("Forwarding stream...")
      // Forward the stream to the client
      await forwardStream(runStream)
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, {
      status: 500,
    })
  }
}
