// app/api/chat/route.ts
// Server-side LLM proxy — keeps Groq API key private and injects E-Summit context.

import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, buildEventContext } from '@/lib/chatbot-context'
import { getGroqServerClient, MODEL_FAST, MODEL_MAIN } from '@/lib/groq-server'
import type { GroqFunction, GroqMessage } from '@/lib/groq'
import { localAnswer } from '@/lib/local-answers'

export const runtime = 'nodejs'

// Simple IP-based sliding window rate limiter: max 30 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 30
const ipRequestHistory = new Map<string, number[]>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = ipRequestHistory.get(ip) || []
  const windowStart = now - RATE_LIMIT_WINDOW_MS
  const recent = timestamps.filter((t) => t > windowStart)
  
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  recent.push(now)
  ipRequestHistory.set(ip, recent)
  
  // Clean up stale entries periodically
  if (ipRequestHistory.size > 2000) {
    ipRequestHistory.forEach((list: number[], key: string) => {
      if (list.every((t: number) => t <= windowStart)) {
        ipRequestHistory.delete(key)
      }
    })
  }
  return true
}

interface ChatRequestBody {
  messages: GroqMessage[]
  tools?: GroqFunction[]
  maxTokens?: number
  model?: string
  mode?: 'chat' | 'summarize'
}

function isValidMessage(msg: unknown): msg is GroqMessage {
  if (!msg || typeof msg !== 'object') return false
  const m = msg as GroqMessage
  return ['user', 'assistant', 'system', 'tool'].includes(m.role)
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before chatting again.' },
      { status: 429 }
    )
  }

  let body: ChatRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { messages, tools = [], maxTokens = 512, model, mode = 'chat' } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'messages array is required' }, { status: 400 })
  }

  if (!messages.every(isValidMessage)) {
    return NextResponse.json({ error: 'Invalid message format' }, { status: 400 })
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

  // Cap history size to prevent abuse
  const windowedMessages = messages.slice(-12)

  // 1. If GROQ_API_KEY is configured on the server, use Groq Llama 3.3 / 3.1
  const groqApiKey = process.env.GROQ_API_KEY

  if (groqApiKey && groqApiKey !== 'your_groq_api_key_here' && groqApiKey.startsWith('gsk_')) {
    try {
      const groq = getGroqServerClient()
      const eventContext = buildEventContext()
      const systemPrompt = buildSystemPrompt(eventContext)

      const resolvedModel =
        model ||
        (mode === 'summarize' ? MODEL_FAST : MODEL_MAIN)

      const result = await groq.generateContent(
        windowedMessages,
        tools,
        systemPrompt,
        maxTokens,
        resolvedModel,
      )

      return NextResponse.json(result)
    } catch (error) {
      console.warn('[api/chat] Groq upstream failed, falling back to local assistant:', error)
    }
  }

  // 2. Intelligent Festival Intelligence Fallback (handles all summit queries without failure)
  const local = localAnswer(lastUserMessage)
  if (local) {
    return NextResponse.json({ text: local })
  }

  // General fallback response
  return NextResponse.json({
    text: `I'm the official **PEC E-Summit 2026 Assistant**! Ask me anything about our keynote speakers, Day 1 & Day 2 schedule, the ₹15L+ prize pool Pitch Competition & Hackathon, or campus navigation directions at Punjab Engineering College!`,
  })
}
