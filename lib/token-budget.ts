// lib/token-budget.ts
// ─────────────────────────────────────────────────────────────────────────────
// Dynamic max_tokens calculator.
//
// The previous implementation hard-coded max_tokens: 2048 on every request.
// That means Groq always *reserves* 2,048 completion tokens even when the
// answer is two sentences. This wastes capacity and pushes TPD limits faster.
//
// This module assigns a tight, intentional budget per query type:
//
//   Simple FAQ / greeting        →  300 tokens
//   Speaker / schedule lookups   →  400 tokens
//   Itinerary / activity detail  →  600 tokens
//   Complex / multi-part query   →  800 tokens  (safe upper bound)
//   Internal summarization call  →  150 tokens
//
// Note: Groq does NOT charge you for unused tokens within max_tokens — but the
// token *counter* (TPD) at the model level CAN include reserved capacity in some
// configurations, so keeping budgets tight helps regardless.
// ─────────────────────────────────────────────────────────────────────────────

const BUDGET_RULES: Array<{ keywords: string[]; maxTokens: number }> = [
  // Itinerary needs a structured list — allow more room
  { keywords: ['itinerary', 'day plan', 'schedule for me', 'plan for'], maxTokens: 600 },
  // Activity details can be verbose
  { keywords: ['activity', 'workshop', 'job fair', 'rd conclave', 'conclave', 'treasure hunt', 'baazar', 'case competition', 'bizquiz'], maxTokens: 500 },
  // Multi-part / comparison queries
  { keywords: ['compare', 'difference', 'vs ', 'versus', 'explain', 'elaborate', 'tell me more', 'in detail'], maxTokens: 700 },
  // Route / map answers are short
  { keywords: ['route', 'direction', 'how do i get', 'walk', 'campus map'], maxTokens: 300 },
  // Simple greetings / yes-no questions
  { keywords: ['hi', 'hello', 'hey', 'thanks', 'thank you', 'bye', 'what is your name', 'who are you'], maxTokens: 250 },
]

/** Used for the internal summarization sub-call (cheap small model). */
export const SUMMARY_MAX_TOKENS = 150

/**
 * Return an appropriate max_tokens value for the given user message.
 * Falls back to 512 for unclassified queries — a safe, lean default.
 */
export function getTokenBudget(userMessage: string): number {
  const normalized = userMessage.toLowerCase()

  for (const rule of BUDGET_RULES) {
    for (const kw of rule.keywords) {
      if (normalized.includes(kw)) {
        console.info(`[TokenBudget] max_tokens = ${rule.maxTokens} (matched: "${kw}")`)
        return rule.maxTokens
      }
    }
  }

  console.info('[TokenBudget] max_tokens = 512 (default)')
  return 512
}
