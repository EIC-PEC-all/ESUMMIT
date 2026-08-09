// lib/tool-selector.ts
// ─────────────────────────────────────────────────────────────────────────────
// Dynamic tool selector: instead of sending all 10 tool definitions on every
// request (~850 tokens), classify the user's intent and return only the 1–3
// tools that are relevant. On a typical request this saves 500–700 tokens.
//
// Each tool definition is kept here as a const so TOOL_DEFINITIONS in
// chatbot-tools.ts can remain the canonical source — we import from there.
// ─────────────────────────────────────────────────────────────────────────────

import { TOOL_DEFINITIONS } from './chatbot-tools'
import type { GroqFunction } from './groq'

// ── Intent → tool-name mapping ────────────────────────────────────────────────

/** Each intent maps a set of keyword patterns to the tool names it needs. */
const INTENT_RULES: Array<{
  keywords: string[]
  tools: string[]
}> = [
  // Navigation / scrolling
  {
    keywords: ['go to', 'take me to', 'show me', 'navigate', 'scroll', 'open', 'jump to', 'section'],
    tools: ['scroll_to_section'],
  },
  // Itinerary building
  {
    keywords: ['itinerary', 'plan', 'schedule for me', 'day plan', 'what should i', 'recommend', 'suggest'],
    tools: ['build_itinerary', 'scroll_to_section'],
  },
  // Campus navigation / walking routes
  {
    keywords: ['route', 'how do i get', 'walk', 'direction', 'from', 'to venue', 'navigate to', 'campus map', 'find venue'],
    tools: ['get_campus_route', 'highlight_activity_venue'],
  },
  // Map / venue highlighting
  {
    keywords: ['map', 'show on map', 'highlight', 'where is', 'location of', 'venue', 'show venue'],
    tools: ['highlight_activity_venue', 'get_campus_route'],
  },
  // Activity details
  {
    keywords: [
      'activity', 'workshop', 'job fair', 'rd conclave', 'r&d', 'ipl auction', 'ignite',
      'treasure hunt', 'baazar', 'bazar', 'bizquiz', 'quiz', 'case competition', 'funding conclave',
      'ambassador', 'expert session', 'detail', 'tell me about', 'what is',
    ],
    tools: ['get_activity_details'],
  },
  // Registration
  {
    keywords: ['register', 'sign up', 'signup', 'join', 'enroll', 'interested in', 'notify me', 'participate'],
    tools: ['register_for_activity', 'subscribe_email'],
  },
  // Email subscription
  {
    keywords: ['subscribe', 'update', 'notification', 'email', 'notify'],
    tools: ['subscribe_email'],
  },
  // Treasure hunt live status
  {
    keywords: ['treasure hunt status', 'my team', 'checkpoint', 'progress'],
    tools: ['get_treasure_hunt_status'],
  },
  // Baazar stalls
  {
    keywords: ['stall', 'food stall', 'baazar stall', 'bazar stall', 'product stall'],
    tools: ['get_baazar_stalls'],
  },
]

// ── Helper ────────────────────────────────────────────────────────────────────

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Given a user message, return the minimal set of GroqFunction definitions
 * that are likely to be needed. Falls back to all tools if no intent is matched
 * (preserves correctness at the cost of more tokens — only for truly ambiguous
 * queries).
 *
 * Token impact:
 *   All 10 tools ≈ 850 tokens
 *   1 tool        ≈  85 tokens   → saves 765 tokens
 *   2 tools       ≈ 170 tokens   → saves 680 tokens
 *   3 tools       ≈ 255 tokens   → saves 595 tokens
 */
export function selectTools(userMessage: string): GroqFunction[] {
  const normalized = normalize(userMessage)

  // Collect matched tool names (use a Set to deduplicate)
  const matched = new Set<string>()
  for (const rule of INTENT_RULES) {
    for (const keyword of rule.keywords) {
      if (normalized.includes(keyword)) {
        rule.tools.forEach(t => matched.add(t))
        break // only match once per rule
      }
    }
  }

  if (matched.size === 0) {
    // No clear intent — send all tools so Groq can decide.
    // Log so we can find unhandled intents and add rules.
    console.info('[ToolSelector] ⚠️ No intent matched — sending all tools')
    return allGroqFunctions()
  }

  const selected = allGroqFunctions().filter(f => matched.has(f.name))
  console.info(`[ToolSelector] ✅ Selected ${selected.length}/${allGroqFunctions().length} tools:`, Array.from(matched))
  return selected
}

/** Convert TOOL_DEFINITIONS to GroqFunction[] (strips the wrapper object). */
function allGroqFunctions(): GroqFunction[] {
  return TOOL_DEFINITIONS.map(t => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters as GroqFunction['parameters'],
  }))
}
