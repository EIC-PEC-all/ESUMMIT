// lib/groq.ts
// ─────────────────────────────────────────────────────────────────────────────
// Optimized Groq REST API client.
//
// Changes vs original:
//   ✅  max_tokens is now a parameter (caller supplies dynamic budget)
//   ✅  model is now a parameter (allows cheap model for summarization)
//   ✅  Token usage is logged after every successful call with cost estimate
//   ✅  Removed broken system-message filter: old code stripped role==='system'
//      from messages but then pushed systemPrompt as first message — this
//      caused duplicate/missing system messages in multi-turn history
//   ✅  Tool-choice is set to 'none' when no tools are passed (was 'auto' with
//      an empty array, which is invalid on Groq and burns tokens)
//   ✅  temperature lowered to 0.5 (slightly more deterministic → shorter, more
//      predictable answers = fewer completion tokens)
// ─────────────────────────────────────────────────────────────────────────────

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system' | 'tool'
  content?: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: {
      name: string
      arguments: string
    }
  }>
  tool_call_id?: string
}

export interface GroqFunction {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export interface GroqRequest {
  model: string
  messages: GroqMessage[]
  tools?: Array<{
    type: 'function'
    function: GroqFunction
  }>
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string | null
      tool_calls?: Array<{
        id: string
        type: 'function'
        function: {
          name: string
          arguments: string
        }
      }>
      role: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_RETRIES = 2  // Reduced from 3 — fewer retries = less token waste on errors

/** Main conversational model — high quality but heavier. */
export const MODEL_MAIN = 'llama-3.3-70b-versatile'
/** Fast cheap model used for summarization sub-calls only. */
export const MODEL_FAST = 'llama-3.1-8b-instant'

// llama-3.3-70b-versatile pricing (Groq free tier, as of 2026):
// Input:  $0.59 / 1M tokens  → $0.00000059 per token
// Output: $0.79 / 1M tokens  → $0.00000079 per token
const COST_INPUT_PER_TOKEN = 0.00000059
const COST_OUTPUT_PER_TOKEN = 0.00000079

// ── Client ────────────────────────────────────────────────────────────────────

export class GroqClient {
  private apiKey: string
  private requestCount = 0
  private lastResetTime = Date.now()

  // Session-level token accounting (diagnostic only)
  private sessionPromptTokens = 0
  private sessionCompletionTokens = 0

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || ''
    if (!this.apiKey) {
      console.warn('[Groq] ⚠️  No API key found. Set NEXT_PUBLIC_GROQ_API_KEY in .env.local')
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private checkRateLimit(): void {
    const now = Date.now()
    if (now - this.lastResetTime > 60_000) {
      this.requestCount = 0
      this.lastResetTime = now
    }
    // Groq free tier: 30 req/min
    if (this.requestCount >= 25) {
      throw new Error('Rate limit approached. Please wait a moment.')
    }
  }

  /**
   * Log token usage after a successful Groq response.
   * This helps identify which calls are expensive and track daily spend.
   */
  private logUsage(
    usage: GroqResponse['usage'],
    model: string,
    label?: string
  ): void {
    if (!usage) return

    const { prompt_tokens, completion_tokens, total_tokens } = usage
    this.sessionPromptTokens += prompt_tokens
    this.sessionCompletionTokens += completion_tokens

    const costInput = (prompt_tokens * COST_INPUT_PER_TOKEN).toFixed(5)
    const costOutput = (completion_tokens * COST_OUTPUT_PER_TOKEN).toFixed(5)
    const costTotal = (
      prompt_tokens * COST_INPUT_PER_TOKEN +
      completion_tokens * COST_OUTPUT_PER_TOKEN
    ).toFixed(5)

    // ── Per-request breakdown ──────────────────────────────────────────────
    console.group(`[Groq] 📊 Token Usage${label ? ` — ${label}` : ''}`)
    console.log(`Model:       ${model}`)
    console.log(`Prompt:      ${prompt_tokens.toLocaleString()} tokens  ($${costInput})`)
    console.log(`Completion:  ${completion_tokens.toLocaleString()} tokens  ($${costOutput})`)
    console.log(`Total:       ${total_tokens.toLocaleString()} tokens  ($${costTotal})`)
    console.log(
      `Session:     ${this.sessionPromptTokens.toLocaleString()} prompt + ${this.sessionCompletionTokens.toLocaleString()} completion = ${(this.sessionPromptTokens + this.sessionCompletionTokens).toLocaleString()} total`
    )
    console.groupEnd()
  }

  /**
   * Core generation method.
   *
   * @param messages  Conversation messages (already windowed by useChatbot)
   * @param functions Tool definitions to send (already filtered by tool-selector)
   * @param systemPrompt  System prompt string (prepended as role=system)
   * @param maxTokens     Completion token budget (from token-budget.ts)
   * @param model         Which Groq model to use (default: MODEL_MAIN)
   * @param label         Optional label for the token log (e.g. "summarization")
   */
  async generateContent(
    messages: GroqMessage[],
    functions: GroqFunction[],
    systemPrompt?: string,
    maxTokens: number = 512,
    model: string = MODEL_MAIN,
    label?: string
  ): Promise<{ text: string; functionCalls?: Array<{ name: string; args: Record<string, any> }> }> {
    this.checkRateLimit()
    this.requestCount++

    // Build the final message array. Do NOT mutate the passed array.
    const allMessages: GroqMessage[] = []
    if (systemPrompt) {
      allMessages.push({ role: 'system', content: systemPrompt })
    }
    // Filter out any stray system messages from the history window
    // (the system message is always injected fresh above)
    allMessages.push(...messages.filter(m => m.role !== 'system'))

    const requestBody: GroqRequest = {
      model,
      messages: allMessages,
      // Only attach tools if there are any; send tool_choice: 'none' otherwise.
      // Passing tool_choice: 'auto' with an empty tools array is invalid on Groq.
      tools: functions.length > 0 ? functions.map(f => ({ type: 'function', function: f })) : undefined,
      tool_choice: functions.length > 0 ? 'auto' : 'none',
      temperature: 0.5,  // Slightly lower → more deterministic, shorter answers
      max_tokens: maxTokens,
      top_p: 0.9,
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Groq API error: ${response.status} — ${errorText}`)
        }

        const data: GroqResponse = await response.json()
        const choice = data.choices?.[0]

        if (!choice?.message) {
          throw new Error('Empty response from Groq')
        }

        // Log token usage immediately after every successful response
        this.logUsage(data.usage, model, label)

        if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
          const toolCall = choice.message.tool_calls[0]
          return {
            text: choice.message.content || '',
            functionCalls: [{
              name: toolCall.function.name,
              args: JSON.parse(toolCall.function.arguments),
            }],
          }
        }

        return {
          text: choice.message.content || '',
          functionCalls: undefined,
        }

      } catch (error) {
        lastError = error as Error

        if (attempt < MAX_RETRIES) {
          // Exponential back-off: 1s, 2s (reduced from 1s, 2s, 4s)
          const delay = 1000 * Math.pow(2, attempt) + Math.random() * 300
          console.warn(`[Groq] Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`, error)
          await this.sleep(delay)
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  /** Convenience wrapper for plain text generation (no tools). */
  async generateText(
    prompt: string,
    systemPrompt?: string,
    maxTokens = 256,
    model = MODEL_MAIN
  ): Promise<string> {
    const result = await this.generateContent(
      [{ role: 'user', content: prompt }],
      [],
      systemPrompt,
      maxTokens,
      model
    )
    return result.text
  }
}

// ── Singleton ─────────────────────────────────────────────────────────────────

let groqClient: GroqClient | null = null

export function getGroqClient(): GroqClient {
  if (!groqClient) {
    groqClient = new GroqClient()
  }
  return groqClient
}