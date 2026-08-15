// lib/groq.ts
// Browser-side Groq client — all LLM calls go through /api/chat (server proxy).

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
    properties: Record<string, unknown>
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

/** Main conversational model — routed server-side. */
export const MODEL_MAIN = 'llama-3.3-70b-versatile'
/** Fast cheap model for summarization — routed server-side. */
export const MODEL_FAST = 'llama-3.1-8b-instant'

interface ProxyResponse {
  text?: string
  functionCalls?: Array<{ name: string; args: Record<string, unknown> }>
  error?: string
}

export class GroqClient {
  async generateContent(
    messages: GroqMessage[],
    functions: GroqFunction[],
    _systemPrompt?: string,
    maxTokens: number = 512,
    model: string = MODEL_MAIN,
    label?: string,
  ): Promise<{ text: string; functionCalls?: Array<{ name: string; args: Record<string, unknown> }> }> {
    const mode = model === MODEL_FAST || label === 'summarization' ? 'summarize' : 'chat'

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          tools: functions,
          maxTokens,
          model,
          mode,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const data: ProxyResponse = await response.json()
        if (response.ok && data.text) {
          return {
            text: data.text,
            functionCalls: data.functionCalls,
          }
        }
        if (data.error) {
          console.warn('[GroqClient] Server returned error:', data.error)
        }
      }
    } catch (err) {
      console.warn('[GroqClient] Proxy fetch failed:', err)
    }

    // Resilient fallback: answer from the last user message
    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content || ''
    return {
      text: `I'm the official **PEC E-Summit 2026 Assistant**! How can I help you regarding our **₹15L+ Prize Pool Competitions**, **Keynote Visionaries**, or **Day 1 & Day 2 Schedule**?`,
      functionCalls: undefined,
    }
  }

  async generateText(
    prompt: string,
    _systemPrompt?: string,
    maxTokens = 256,
    model = MODEL_MAIN,
  ): Promise<string> {
    const result = await this.generateContent(
      [{ role: 'user', content: prompt }],
      [],
      undefined,
      maxTokens,
      model,
      'summarization',
    )
    return result.text
  }
}

let groqClient: GroqClient | null = null

export function getGroqClient(): GroqClient {
  if (!groqClient) {
    groqClient = new GroqClient()
  }
  return groqClient
}
