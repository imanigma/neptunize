'use client'

import { useState } from 'react'
import { Send, User } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

interface Message {
  id: string
  text: string
  isUser: boolean
  options?: string[]
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I'm your AI podcast assistant. Tell me what topic you'd like to create a podcast about, and I'll help you generate engaging content.",
    isUser: false,
    timestamp: new Date()
  }
]

const formatOptions = [
  { icon: '🎤', text: 'Interview-style podcast' },
  { icon: '📚', text: 'Educational/Tutorial format' },
  { icon: '💬', text: 'Conversational discussion' },
  { icon: '📖', text: 'Storytelling approach' },
]

export default function GeneratePage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [showFormatOptions, setShowFormatOptions] = useState(false)

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Interesting topic! "${inputText}" could make for a compelling podcast. Let me help you develop this idea further. What format are you thinking:`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setShowFormatOptions(true)
    }, 1000)
  }

  const handleFormatSelect = (format: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: format,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setShowFormatOptions(false)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "That's a great choice! I'll help you create an engaging podcast script. Please provide more details about your topic, target audience, and any specific points you'd like to cover.",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">PodcastAI</h1>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">U</span>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start space-x-2 max-w-[80%]">
              {!message.isUser && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-gray-600" />
                </div>
              )}
              
              <div
                className={`px-4 py-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
              </div>

              {message.isUser && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Format Options */}
        {showFormatOptions && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-gray-600" />
              </div>
              
              <div className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl">
                <div className="space-y-2">
                  {formatOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleFormatSelect(option.text)}
                      className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="mr-2">{option.icon}</span>
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
