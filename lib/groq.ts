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
  text: string
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

    const data: ProxyResponse = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `Chat proxy error: ${response.status}`)
    }

    return {
      text: data.text,
      functionCalls: data.functionCalls,
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
