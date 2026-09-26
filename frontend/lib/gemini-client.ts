// lib/gemini-client.ts
// Browser-side Gemini client — all LLM calls go through /api/chat (server proxy).

export interface GeminiMessage {
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

export interface GeminiFunction {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export interface GeminiRequest {
  model: string
  messages: GeminiMessage[]
  tools?: Array<{
    type: 'function'
    function: GeminiFunction
  }>
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } }
  temperature?: number
  max_tokens?: number
  top_p?: number
  stream?: boolean
}

export interface GeminiResponse {
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
export const MODEL_MAIN = 'gemini-3.8-flash'
/** Fast cheap model for summarization — routed server-side. */
export const MODEL_FAST = 'gemini-3.8-flash'

interface ProxyResponse {
  text?: string
  functionCalls?: Array<{ name: string; args: Record<string, unknown> }>
  error?: string
}

export class GeminiClient {
  async generateContent(
    messages: GeminiMessage[],
    functions: GeminiFunction[],
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
        if (response.ok && (typeof data.text === 'string' || data.functionCalls)) {
          return {
            text: data.text || '',
            functionCalls: data.functionCalls,
          }
        }
        if (data.error) {
          throw new Error(data.error)
        }
      }
      throw new Error(`Failed to generate content: HTTP ${response.status}`)
    } catch (err) {
      console.warn('[GeminiClient] Proxy fetch failed:', err)
      throw err // Let the caller (useChatbot) catch and use localAnswer
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

let geminiClient: GeminiClient | null = null

export function getGeminiClient(): GeminiClient {
  if (!geminiClient) {
    geminiClient = new GeminiClient()
  }
  return geminiClient
}
