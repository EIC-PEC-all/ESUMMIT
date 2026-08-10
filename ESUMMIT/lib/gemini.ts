// lib/gemini.ts
// Gemini API client with retry logic and error handling

export interface GeminiMessage {
  role: 'user' | 'model' | 'system' | 'function'
  content?: string
  parts?: Array<{
    text?: string
    functionCall?: {
      name: string
      args: Record<string, any>
    }
    functionResponse?: {
      name: string
      response: string
    }
  }>
  functionCall?: {
    name: string
    args: Record<string, any>
  }
  functionResponse?: {
    name: string
    response: string
  }
}

export interface GeminiFunction {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, any>
    required?: string[]
  }
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  systemInstruction?: {
    parts: { text: string }[]
  }
  tools?: {
    functionDeclarations: GeminiFunction[]
  }[]
  generationConfig?: {
    temperature?: number
    maxOutputTokens?: number
    topP?: number
    topK?: number
  }
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text?: string
        functionCall?: {
          name: string
          args: Record<string, any>
        }
      }>
      role: string
    }
    finishReason: string
  }>
  usageMetadata?: {
    promptTokenCount: number
    candidatesTokenCount: number
    totalTokenCount: number
  }
}

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const MAX_RETRIES = 3
const BASE_DELAY = 1000

export class GeminiClient {
  private apiKey: string
  private requestCount = 0
  private lastResetTime = Date.now()

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('[Gemini] No API key provided. Set NEXT_PUBLIC_GEMINI_API_KEY in .env.local')
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private checkRateLimit(): void {
    const now = Date.now()
    if (now - this.lastResetTime > 60000) {
      this.requestCount = 0
      this.lastResetTime = now
    }
    // Free tier: 1500 req/day, ~60/minute. Stay well under.
    if (this.requestCount >= 50) {
      throw new Error('Rate limit approached. Please wait a moment.')
    }
  }

  async generateContent(
    messages: GeminiMessage[],
    functions: GeminiFunction[],
    systemPrompt?: string
  ): Promise<{ text: string; functionCalls?: Array<{ name: string; args: Record<string, any> }> }> {
    this.checkRateLimit()
    this.requestCount++

    const requestBody: GeminiRequest = {
      contents: messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role === 'function' ? 'model' : m.role,
        parts: m.functionCall
          ? [{ functionCall: m.functionCall }]
          : m.functionResponse
          ? [{ functionResponse: m.functionResponse }]
          : [{ text: m.content }]
      })),
      tools: functions.length > 0 ? [{ functionDeclarations: functions }] : undefined,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        topP: 0.9,
        topK: 40
      }
    }

    if (systemPrompt) {
      requestBody.systemInstruction = { parts: [{ text: systemPrompt }] }
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
        }

        const data: GeminiResponse = await response.json()
        const candidate = data.candidates?.[0]
        
        if (!candidate?.content?.parts?.[0]) {
          throw new Error('Empty response from Gemini')
        }

        const part = candidate.content.parts[0]
        
        if (part.functionCall) {
          return {
            text: '',
            functionCalls: [{
              name: part.functionCall.name,
              args: part.functionCall.args
            }]
          }
        }

        return {
          text: part.text || '',
          functionCalls: undefined
        }

      } catch (error) {
        lastError = error as Error
        
        if (attempt < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, attempt) + Math.random() * 500
          console.warn(`[Gemini] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error)
          await this.sleep(delay)
        }
      }
    }

    throw lastError || new Error('Max retries exceeded')
  }

  // Convenience method for simple text generation
  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const result = await this.generateContent(
      [{ role: 'user', content: prompt }],
      [],
      systemPrompt
    )
    return result.text
  }
}

// Singleton instance
let geminiClient: GeminiClient | null = null

export function getGeminiClient(): GeminiClient {
  if (!geminiClient) {
    geminiClient = new GeminiClient()
  }
  return geminiClient
}