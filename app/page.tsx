"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import Logo from "@/components/logo"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWelcome, setShowWelcome] = useState(true)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Hide welcome message when user starts typing
  useEffect(() => {
    if (input.length > 0) {
      setShowWelcome(false)
    }
  }, [input])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header with logo */}
      <header className="border-b p-4 bg-white">
        <Logo />
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          {showWelcome && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <h1 className="text-2xl font-bold mb-2">Welcome to Business Assistant</h1>
              <p className="text-gray-600 mb-4">
                I can answer questions about your data dictionaries and business information.
              </p>
              <p className="text-gray-500 text-sm">Ask me anything about your business data!</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-3/4 rounded-lg p-4 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question about your data..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
