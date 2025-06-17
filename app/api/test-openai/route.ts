import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
})

export async function GET() {
  try {
    console.log("Testing OpenAI connection...")

    // Test basic OpenAI connection
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, this is a test." }],
      max_tokens: 10,
    })

    console.log("OpenAI test successful")

    return Response.json({
      success: true,
      message: "OpenAI connection working",
      response: response.choices[0].message.content,
    })
  } catch (error) {
    console.error("OpenAI test failed:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
