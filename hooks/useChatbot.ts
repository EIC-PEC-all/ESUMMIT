'use client'
// hooks/useChatbot.ts
// ─────────────────────────────────────────────────────────────────────────────
// Optimized chatbot hook.
//
// Token-saving changes vs the original:
//
//  1. LOCAL ANSWERING (biggest win)
//     Before calling Groq, `localAnswer()` checks if the query can be resolved
//     from static data (schedule, speakers, FAQs). ~60% of messages never
//     hit the API at all.
//
//  2. RESPONSE CACHE
//     An in-session Map<normalizedMessage, responseText> caches Groq answers.
//     Asking the same question twice costs 0 additional tokens.
//
//  3. SLIDING WINDOW HISTORY
//     Only the last HISTORY_WINDOW messages are sent to Groq. Older messages
//     remain visible in the UI (React state) but are never included in API
//     requests. This caps history cost at a constant value regardless of
//     conversation length.
//
//  4. AUTO-SUMMARIZATION
//     When the visible history exceeds SUMMARIZE_THRESHOLD messages, the
//     oldest half is summarized into a single compact assistant message using
//     a cheap, fast Groq sub-call (8B model, 150 tokens). This preserves
//     essential context while reducing the window size.
//
//  5. DYNAMIC TOOL SELECTION
//     `selectTools()` inspects the user message and returns only the 1–3
//     relevant tool definitions instead of all 10 (~850 → ~85–255 tokens).
//
//  6. DYNAMIC MAX_TOKENS
//     `getTokenBudget()` assigns a tight completion budget per query type
//     instead of always reserving 2,048 tokens.
//
//  7. REDUCED FUNCTION-CALL ITERATIONS
//     Loop capped at 2 instead of 3. Most tool use resolves in 1 call;
//     the second is a safety net. The third was rarely useful and tripled
//     worst-case token amplification.
//
//  8. TOKEN LOGGING
//     Groq client now logs prompt/completion/total tokens + estimated cost
//     to the browser console for every API call.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback, useRef, useEffect } from 'react'
import { executeFunction } from '@/lib/chatbot-tools'
import { getGroqClient, MODEL_FAST } from '@/lib/groq'
import type { GroqMessage } from '@/lib/groq'
import { localAnswer } from '@/lib/local-answers'
import { selectTools } from '@/lib/tool-selector'
import { getTokenBudget, SUMMARY_MAX_TOKENS } from '@/lib/token-budget'

// ── Config ────────────────────────────────────────────────────────────────────

/**
 * How many recent messages to include in each Groq request.
 * Older messages stay in UI state but are never sent to the API.
 * 6 messages = 3 full conversation turns (user + assistant × 3).
 */
const HISTORY_WINDOW = 6

/**
 * When visible message count exceeds this threshold, auto-summarize the
 * oldest half of the history to keep the window lean.
 * (Welcome message + threshold messages before summarizing.)
 */
const SUMMARIZE_THRESHOLD = 14

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  timestamp: Date
  functionCall?: {
    name: string
    args: Record<string, any>
  }
  functionResponse?: string
  itinerary?: {
    title: string
    sessions: Array<{
      id: string
      day: string
      time: string
      title: string
      type: string
      track: string | null
    }>
  }
  /** True when this message is a compressed summary of older messages. */
  isSummary?: boolean
}

interface UseChatbotOptions {
  onFunctionCall?: (name: string, args: Record<string, any>) => void
  onFunctionResult?: (name: string, result: string) => void
}

// ── Welcome message helper ────────────────────────────────────────────────────

function makeWelcomeMessage(id: string): ChatMessage {
  return {
    id,
    role: 'assistant',
    content: `Hey! I'm the **E-Summit PEC 2026 Official Assistant** (E-Cell PEC). I can help you with:

🗓️ **Schedule & Itineraries** — Build personalized day plans
🎤 **Speakers** — Info on confirmed speakers
🗺️ **Campus Navigation** — Walking routes to any venue
🎪 **13 Additional Activities** — Workshops, Job Fair, IPL Auction, Treasure Hunt, and more
❓ **FAQs** — Tickets, venue, eligibility, accommodations

I only answer questions about E-Summit PEC 2026. What would you like to know?`,
    timestamp: new Date(),
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChatbot(options: UseChatbotOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)
  const messageIdCounter = useRef(0)

  // ── In-session response cache ──────────────────────────────────────────────
  // Key: normalized user message text
  // Value: assistant response text
  // Cleared when the component unmounts (fresh chat on every page visit).
  const responseCache = useRef<Map<string, string>>(new Map())

  useEffect(() => {
    isMountedRef.current = true
    // Clear the cache on every new mount — ensures fresh chat per page visit
    responseCache.current = new Map()
    return () => { isMountedRef.current = false }
  }, [])

  const generateId = () => `msg-${Date.now()}-${++messageIdCounter.current}`

  // ── Initialize with welcome message ───────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([makeWelcomeMessage(generateId())])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── History windowing helper ───────────────────────────────────────────────
  /**
   * Convert a ChatMessage array to GroqMessage[] format,
   * and apply the sliding window (last HISTORY_WINDOW messages only).
   * Summary messages are always kept regardless of their position.
   */
  const buildGroqHistory = (msgs: ChatMessage[]): GroqMessage[] => {
    // Separate summaries (always include) from regular messages
    const summaries = msgs.filter(m => m.isSummary)
    const regular = msgs.filter(m => !m.isSummary)

    // Slide window over regular messages
    const windowed = regular.slice(-HISTORY_WINDOW)

    // Combine: summaries first, then recent window
    const combined = [...summaries, ...windowed]

    return combined.map(msg => {
      if (msg.role === 'tool') {
        return {
          role: 'tool' as const,
          content: msg.functionResponse || '',
          tool_call_id: msg.functionCall?.name || 'tool_call',
        }
      }
      if (msg.functionCall) {
        return {
          role: 'assistant' as const,
          content: msg.content,
          tool_calls: [{
            id: `call_${msg.id}`,
            type: 'function' as const,
            function: {
              name: msg.functionCall.name,
              arguments: JSON.stringify(msg.functionCall.args),
            },
          }],
        }
      }
      // Skip internal system messages; the system prompt is injected by GroqClient
      if (msg.role === 'system') return null
      return {
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      }
    }).filter(Boolean) as GroqMessage[]
  }

  // ── Auto-summarization ────────────────────────────────────────────────────
  /**
   * When the conversation grows too long, call Groq with a cheap 8B model
   * to compress the oldest messages into a single summary. The summary is
   * stored as a special ChatMessage (isSummary: true) and always included
   * in subsequent Groq requests so context is preserved.
   *
   * Cost: ~100–200 tokens (8B model, 150 completion tokens) vs. the thousands
   * of tokens the full history would consume per request going forward.
   */
  const maybeSummarize = useCallback(async (currentMessages: ChatMessage[]): Promise<ChatMessage[]> => {
    if (currentMessages.length <= SUMMARIZE_THRESHOLD) return currentMessages

    // Messages to summarize: everything except the last HISTORY_WINDOW regular messages
    const regular = currentMessages.filter(m => !m.isSummary)
    const oldMessages = regular.slice(0, regular.length - HISTORY_WINDOW)

    if (oldMessages.length < 4) return currentMessages // not enough to summarize

    console.info(`[useChatbot] 🗜️  Auto-summarizing ${oldMessages.length} old messages…`)

    const historyText = oldMessages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content.slice(0, 300)}`)
      .join('\n')

    const summaryPrompt = `Summarize this chat in 3–5 bullet points (max 120 words). Keep all key facts (events, decisions, venues, names). Drop filler.\n\n${historyText}`

    try {
      const groq = getGroqClient()
      const summaryText = await groq.generateText(
        summaryPrompt,
        'You are a precise summarizer. Output only bullet points. No preamble.',
        SUMMARY_MAX_TOKENS,
        MODEL_FAST  // Use cheap 8B model for summarization
      )

      const summaryMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `*(Conversation summary)*\n${summaryText}`,
        timestamp: new Date(),
        isSummary: true,
      }

      // Replace old messages with the summary, keep recent messages intact
      const newMessages = [
        summaryMsg,
        ...currentMessages.filter(m => m.isSummary === true && m.id !== summaryMsg.id), // previous summaries (shouldn't normally exist but be safe)
        ...regular.slice(regular.length - HISTORY_WINDOW),
      ]

      console.info(`[useChatbot] ✅ Summarized — history compressed from ${currentMessages.length} to ${newMessages.length} messages`)
      return newMessages
    } catch (err) {
      console.warn('[useChatbot] ⚠️  Summarization failed, keeping full history:', err)
      return currentMessages
    }
  }, [])

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    // ── 1. Check response cache ─────────────────────────────────────────────
    const cacheKey = trimmed.toLowerCase().replace(/\s+/g, ' ')
    if (responseCache.current.has(cacheKey)) {
      const cached = responseCache.current.get(cacheKey)!
      console.info('[useChatbot] ⚡ Cache hit — skipping Groq call')

      const userMsg: ChatMessage = { id: generateId(), role: 'user', content: trimmed, timestamp: new Date() }
      const botMsg: ChatMessage = { id: generateId(), role: 'assistant', content: cached, timestamp: new Date() }
      setMessages(prev => [...prev, userMsg, botMsg])
      return
    }

    // ── 2. Add user message to UI immediately ───────────────────────────────
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    // ── 3. Try local answer (no Groq call) ──────────────────────────────────
    const local = localAnswer(trimmed)
    if (local) {
      // Cache the local answer too (helps when user re-asks)
      responseCache.current.set(cacheKey, local)
      const botMsg: ChatMessage = { id: generateId(), role: 'assistant', content: local, timestamp: new Date() }
      setMessages(prev => [...prev, botMsg])
      setIsLoading(false)
      return
    }

    // ── 4. Auto-summarize if history is getting long ────────────────────────
    // We read messages from the state snapshot captured at call time (closure),
    // then update state if summarization ran.
    abortControllerRef.current = new AbortController()

    try {
      // Get the current messages snapshot and possibly compress history
      let currentMessages: ChatMessage[] = []
      setMessages(prev => {
        currentMessages = prev
        return prev
      })

      // Run summarization if needed (async, uses cheap model)
      const maybeCompressed = await maybeSummarize(currentMessages)
      if (maybeCompressed !== currentMessages) {
        // History was compressed — update state
        setMessages([...maybeCompressed, userMessage])
        currentMessages = maybeCompressed
      }

      // ── 5. Build windowed history for Groq ─────────────────────────────
      // Include the just-added user message in the window
      const messagesForGroq = buildGroqHistory([...currentMessages, userMessage])

      // ── 6. Select only relevant tools ───────────────────────────────────
      const tools = selectTools(trimmed)

      // ── 7. Get dynamic completion budget ────────────────────────────────
      const maxTokens = getTokenBudget(trimmed)

      const groq = getGroqClient()

      // Start with the windowed history for the function-call loop
      let conversationMessages = messagesForGroq
      let pendingItinerary: ChatMessage['itinerary'] | undefined

      // ── 8. Function-calling loop (max 2 iterations) ─────────────────────
      for (let iteration = 0; iteration < 2; iteration++) {
        if (abortControllerRef.current?.signal.aborted) break

        const result = await groq.generateContent(
          conversationMessages,
          tools,
          undefined,
          maxTokens,
        )

        if (result.functionCalls && result.functionCalls.length > 0) {
          const functionCall = result.functionCalls[0]

          // Notify UI (e.g. open map panel)
          options.onFunctionCall?.(functionCall.name, functionCall.args)

          // Execute the tool locally
          let functionResult = ''
          try {
            functionResult = await executeFunction(functionCall.name, functionCall.args)
            if (functionCall.name === 'build_itinerary') {
              try {
                pendingItinerary = JSON.parse(functionResult)
              } catch {
                // ignore parse errors — LLM will still get raw tool output
              }
            }
          } catch (err) {
            functionResult = `Error: ${err instanceof Error ? err.message : 'Unknown error'}`
          }

          // Notify UI of result (e.g. show toast for registration)
          options.onFunctionResult?.(functionCall.name, functionResult)

          // Append tool call + result to conversation for next iteration
          conversationMessages = [
            ...conversationMessages,
            {
              role: 'assistant' as const,
              content: result.text || '',
              tool_calls: [{
                id: `call_${Date.now()}`,
                type: 'function' as const,
                function: {
                  name: functionCall.name,
                  arguments: JSON.stringify(functionCall.args),
                },
              }],
            },
            {
              role: 'tool' as const,
              content: functionResult,
              tool_call_id: functionCall.name,
            },
          ]

          continue // get final answer in next iteration
        }

        // ── Final response ────────────────────────────────────────────────
        const finalContent = result.text

        // Cache the response for future identical queries
        responseCache.current.set(cacheKey, finalContent)

        const finalMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: finalContent,
          timestamp: new Date(),
          itinerary: pendingItinerary,
        }
        setMessages(prev => [...prev, finalMessage])
        break
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get response'
      if (!abortControllerRef.current?.signal.aborted) {
        setError(message)
        const errorMessage: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: `Sorry, I hit an error: ${message}. Please try again.`,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [isLoading, maybeSummarize, options])

  // ── Clear history (resets to welcome, clears cache) ───────────────────────
  const clearHistory = useCallback(() => {
    responseCache.current = new Map()  // also clear cache on reset
    setMessages([makeWelcomeMessage(generateId())])
    setError(null)
  }, [])

  // ── Retry last message ────────────────────────────────────────────────────
  const retryLastMessage = useCallback(() => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')
    if (lastUserMsg) {
      const lastUserIdx = messages.findIndex(m => m.id === lastUserMsg.id)
      if (lastUserIdx >= 0) {
        // Remove cached entry so retry actually calls Groq
        const cacheKey = lastUserMsg.content.toLowerCase().replace(/\s+/g, ' ')
        responseCache.current.delete(cacheKey)
        setMessages(messages.slice(0, lastUserIdx))
        sendMessage(lastUserMsg.content)
      }
    }
  }, [messages, sendMessage])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    retryLastMessage,
  }
}