// app/api/chat/route.ts
// Server-side LLM proxy — keeps Groq API key private and injects E-Summit context.

import { NextRequest, NextResponse } from 'next/server'
import { buildSystemPrompt, buildEventContext } from '@/lib/chatbot-context'
import { getGroqServerClient, MODEL_FAST, MODEL_MAIN } from '@/lib/groq-server'
import type { GroqFunction, GroqMessage } from '@/lib/groq'

export const runtime = 'nodejs'

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
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'Chat service is not configured. Set GROQ_API_KEY on the server.' },
      { status: 503 },
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

  // Cap history size to prevent abuse
  const windowedMessages = messages.slice(-12)

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
    const message = error instanceof Error ? error.message : 'Chat request failed'
    console.error('[api/chat]', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
