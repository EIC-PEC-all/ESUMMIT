// lib/groq-server.ts
// Server-only Groq client — API key never exposed to the browser.

import type { GroqFunction, GroqMessage, GroqRequest, GroqResponse } from './groq'

export const MODEL_MAIN = 'llama-3.3-70b-versatile'
export const MODEL_FAST = 'llama-3.1-8b-instant'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_RETRIES = 2

export class GroqServerClient {
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY is not configured on the server')
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async generateContent(
    messages: GroqMessage[],
    functions: GroqFunction[],
    systemPrompt?: string,
    maxTokens: number = 512,
    model: string = MODEL_MAIN,
  ): Promise<{ text: string; functionCalls?: Array<{ name: string; args: Record<string, unknown> }> }> {
    const allMessages: GroqMessage[] = []
    if (systemPrompt) {
      allMessages.push({ role: 'system', content: systemPrompt })
    }
    allMessages.push(...messages.filter(m => m.role !== 'system'))

    const requestBody: GroqRequest = {
      model,
      messages: allMessages,
      tools: functions.length > 0 ? functions.map(f => ({ type: 'function', function: f })) : undefined,
      tool_choice: functions.length > 0 ? 'auto' : 'none',
      temperature: 0.5,
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

        if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
          const toolCall = choice.message.tool_calls[0]
          return {
            text: choice.message.content || '',
            functionCalls: [{
              name: toolCall.function.name,
              args: JSON.parse(toolCall.function.arguments) as Record<string, unknown>,
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
          const delay = 1000 * Math.pow(2, attempt) + Math.random() * 300
          await this.sleep(delay)
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  async generateText(
    prompt: string,
    systemPrompt?: string,
    maxTokens = 256,
    model = MODEL_MAIN,
  ): Promise<string> {
    const result = await this.generateContent(
      [{ role: 'user', content: prompt }],
      [],
      systemPrompt,
      maxTokens,
      model,
    )
    return result.text
  }
}

let groqServerClient: GroqServerClient | null = null

export function getGroqServerClient(): GroqServerClient {
  if (!groqServerClient) {
    groqServerClient = new GroqServerClient()
  }
  return groqServerClient
}
