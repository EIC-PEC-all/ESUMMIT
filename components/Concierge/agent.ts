// components/Concierge/agent.ts
// Agentic Summit Agent — multi-turn intent matcher + itinerary generator + tool dispatcher
// ─────────────────────────────────────────────────────────────────────────
// SWAP POINT: Replace getAgentResponse() body with a real LLM call when ready.
// ─────────────────────────────────────────────────────────────────────────

import { emitAgentEvent } from '@/lib/events'
import type { FestContext } from '@/lib/data'

export interface ItinerarySession {
  id: string
  day: 'Day 1' | 'Day 2'
  time: string
  title: string
  type: string
  track: string | null
}

export interface AgentResponse {
  text: string
  toast?: string
  suggestedReplies?: string[]
  itinerary?: {
    title: string
    sessions: ItinerarySession[]
  }
}

// ── Tool Definitions ──────────────────────────────────────────────────────

function scrollToSection(id: string): string {
  emitAgentEvent({ type: 'scrollToSection', payload: { id } })
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return `Scrolled to the ${id} section.`
  }
  return `Couldn't find section: ${id}.`
}

function highlightEvent(id: string): string {
  emitAgentEvent({ type: 'highlightEvent', payload: { id } })
  return `Highlighted the event and scrolled it into view.`
}

function highlightScheduleRow(eventId: string, title: string): string {
  emitAgentEvent({ type: 'highlightScheduleRow', payload: { id: eventId } })
  return `Found "${title}" in the schedule — highlighted it for you.`
}

function openTrackCard(id: string, name: string): string {
  emitAgentEvent({ type: 'openTrackCard', payload: { id } })
  scrollToSection('tracks')
  return `Opening the ${name} card for you.`
}

function subscribeEmail(email: string): { message: string; toast: string } {
  if (typeof window === 'undefined') return { message: 'Could not save — browser required.', toast: '' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { message: `That doesn't look like a valid email address. Try again?`, toast: '' }
  }
  const existing: string[] = JSON.parse(localStorage.getItem('pec_summit_subscribers') || '[]')
  if (existing.includes(email)) {
    return {
      message: `${email} is already on the list! You'll be among the first to hear any updates.`,
      toast: '',
    }
  }
  existing.push(email)
  localStorage.setItem('pec_summit_subscribers', JSON.stringify(existing))
  return {
    message: `Done! ${email} has been added to the PEC Summit updates list.`,
    toast: `✓ ${email} subscribed to PEC Summit updates`,
  }
}

/**
 * Tool: buildItinerary
 * Generates a structured personalized itinerary based on constraints (day, interest/topic)
 */
export function buildItinerary(
  ctx: FestContext,
  constraints: { day?: 'day1' | 'day2' | 'all'; topic?: string }
): { title: string; sessions: ItinerarySession[] } {
  const d1 = ctx.schedule.day1.events.map((e) => ({ ...e, day: 'Day 1' as const }))
  const d2 = ctx.schedule.day2.events.map((e) => ({ ...e, day: 'Day 2' as const }))
  let pool = [...d1, ...d2]

  if (constraints.day === 'day1') pool = d1
  if (constraints.day === 'day2') pool = d2

  if (constraints.topic) {
    const t = constraints.topic.toLowerCase()
    pool = pool.filter(
      (e) =>
        e.title.toLowerCase().includes(t) ||
        e.type.toLowerCase().includes(t) ||
        (e.track && e.track.toLowerCase().includes(t))
    )
  }

  // Fallback to top keynotes & panels if pool is too small
  if (pool.length < 2) {
    const defaultPool = (constraints.day === 'day2' ? d2 : d1).filter(
      (e) => e.type === 'keynote' || e.type === 'panel' || e.type === 'competition' || e.type === 'hackathon'
    )
    pool = defaultPool.slice(0, 4)
  }

  const topicLabel = constraints.topic
    ? constraints.topic.charAt(0).toUpperCase() + constraints.topic.slice(1)
    : 'Recommended'
  const dayLabel = constraints.day === 'day1' ? 'Day 1' : constraints.day === 'day2' ? 'Day 2' : '2-Day'

  return {
    title: `Custom ${dayLabel} ${topicLabel} Itinerary`,
    sessions: pool.slice(0, 5),
  }
}

// ── Intent Matching ───────────────────────────────────────────────────────

type Intent =
  | { type: 'itinerary'; day?: 'day1' | 'day2' | 'all'; topic?: string }
  | { type: 'scroll_to'; section: string }
  | { type: 'highlight_track'; id: string; name: string }
  | { type: 'open_track'; id: string; name: string }
  | { type: 'schedule_query'; track?: string }
  | { type: 'subscribe'; email?: string }
  | { type: 'speaker_query' }
  | { type: 'sponsor_query' }
  | { type: 'faq_query'; topic?: string }
  | { type: 'general_info' }
  | { type: 'unknown' }

function matchIntent(msg: string, ctx: FestContext): Intent {
  const m = msg.toLowerCase().trim()

  // Itinerary generation intent
  if (/(itinerary|plan|schedule for me|recommend|suggest|what should i attend|day 1 plan|day 2 plan)/i.test(m)) {
    let day: 'day1' | 'day2' | 'all' = 'all'
    if (/day 1|first day/i.test(m)) day = 'day1'
    if (/day 2|second day/i.test(m)) day = 'day2'

    let topic: string | undefined = undefined
    if (/fintech|payment/i.test(m)) topic = 'fintech'
    if (/ai|machine learning|ml/i.test(m)) topic = 'ai'
    if (/pitch|pitching|vc|investor/i.test(m)) topic = 'pitch'
    if (/hackathon|code|developer/i.test(m)) topic = 'hackathon'
    if (/deep-tech|hardware/i.test(m)) topic = 'deep-tech'

    return { type: 'itinerary', day, topic }
  }

  // Email capture
  const emailMatch = m.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/)
  if (emailMatch) return { type: 'subscribe', email: emailMatch[0] }
  if (/(subscribe|notify|updates?|mailing list|sign.?up)/i.test(m)) return { type: 'subscribe' }

  // Section navigation
  if (/(scroll|go|take me|show).*(hero|home|top)/i.test(m)) return { type: 'scroll_to', section: 'hero' }
  if (/(scroll|go|take me|show).*(about|what is|info)/i.test(m)) return { type: 'scroll_to', section: 'about' }
  if (/(scroll|go|take me|show).*(track|event|compet|hackathon|pitch|panel|expo|network)/i.test(m)) return { type: 'scroll_to', section: 'tracks' }
  if (/(scroll|go|take me|show).*(speak)/i.test(m)) return { type: 'scroll_to', section: 'speakers' }
  if (/(scroll|go|take me|show).*(schedule|lineup|agenda|timetable)/i.test(m)) return { type: 'scroll_to', section: 'schedule' }
  if (/(scroll|go|take me|show).*(sponsor|partner)/i.test(m)) return { type: 'scroll_to', section: 'sponsors' }
  if (/(scroll|go|take me|show).*(faq|question|answer)/i.test(m)) return { type: 'scroll_to', section: 'faq' }

  // Specific track open / highlight
  for (const track of ctx.tracks) {
    if (new RegExp(track.title, 'i').test(m) || new RegExp(track.id, 'i').test(m)) {
      if (/(details?|tell me|show|expand|open|more about)/i.test(m)) {
        return { type: 'open_track', id: track.id, name: track.title }
      }
      return { type: 'highlight_track', id: track.id, name: track.title }
    }
  }

  // Schedule / timeline queries
  if (/(schedule|when|time|agenda|lineup|starts?|ends?)/i.test(m)) {
    for (const track of ctx.tracks) {
      if (new RegExp(track.id, 'i').test(m) || new RegExp(track.title, 'i').test(m)) {
        return { type: 'schedule_query', track: track.id }
      }
    }
    return { type: 'schedule_query' }
  }

  // Speaker queries
  if (/(speak|keynote|panelist|who is|guest)/i.test(m)) return { type: 'speaker_query' }

  // Sponsor queries
  if (/(sponsor|partner|support|fund|brand)/i.test(m)) return { type: 'sponsor_query' }

  // FAQ
  if (/(free|cost|price|ticket|fee|where|location|venue|hostel|accommodation)/i.test(m)) {
    return { type: 'faq_query', topic: 'logistics' }
  }
  if (/(faq|question|how do i|can i|eligible|who can)/i.test(m)) return { type: 'faq_query' }

  // General info
  if (/(what is|about|overview|tell me about|pec summit|ecell)/i.test(m)) return { type: 'general_info' }

  return { type: 'unknown' }
}

// ── Response Generator ─────────────────────────────────────────────────────

export async function getAgentResponse(
  userMessage: string,
  ctx: FestContext
): Promise<AgentResponse> {
  await new Promise((r) => setTimeout(r, 500 + Math.random() * 300))

  const intent = matchIntent(userMessage, ctx)

  switch (intent.type) {
    case 'itinerary': {
      const it = buildItinerary(ctx, { day: intent.day, topic: intent.topic })
      return {
        text: `Here is a **${it.title}** curated for your preferences. You can click "Add to My Plan" on any session to save it to your persistent itinerary drawer!`,
        itinerary: it,
        suggestedReplies: ['Build Day 1 plan', 'Show AI track', 'How do I register?'],
      }
    }

    case 'scroll_to': {
      const label = intent.section.charAt(0).toUpperCase() + intent.section.slice(1)
      scrollToSection(intent.section)
      return {
        text: `Taking you to the ${label} section now.`,
        suggestedReplies: ['Build my itinerary', 'Who are the speakers?', 'When does it start?'],
      }
    }

    case 'highlight_track': {
      highlightEvent(intent.id)
      scrollToSection('tracks')
      return {
        text: `That's the **${intent.name}** — I've highlighted it for you. Want me to open the full details?`,
        suggestedReplies: [`Tell me more about ${intent.name}`, 'Build my itinerary', 'What time does it start?'],
      }
    }

    case 'open_track': {
      openTrackCard(intent.id, intent.name)
      const track = ctx.tracks.find((t) => t.id === intent.id)
      return {
        text: `Opening **${intent.name}**. ${track?.shortDesc ?? ''}`,
        suggestedReplies: ['Build my itinerary', 'Who are the judges?', 'Get passes'],
      }
    }

    case 'schedule_query': {
      scrollToSection('schedule')
      if (intent.track) {
        const allEvents = [
          ...ctx.schedule.day1.events.map((e) => ({ ...e, day: 'Day 1' })),
          ...ctx.schedule.day2.events.map((e) => ({ ...e, day: 'Day 2' })),
        ].filter((e) => e.track === intent.track)
        if (allEvents.length > 0) {
          const first = allEvents[0]
          highlightScheduleRow(first.id, first.title)
          const list = allEvents.map((e) => `• [${e.day}] ${e.time} — ${e.title}`).join('\n')
          return {
            text: `Here are the **${intent.track}** sessions:\n${list}\n\nI've highlighted the first one in the schedule.`,
            suggestedReplies: ['Build Day 1 plan', 'Build Day 2 plan', 'Show speakers'],
          }
        }
      }
      return {
        text: `**Day 1** kicks off at 09:00 with Registration & Ceremony. **Day 2** features hackathon final presentations & pitch finals. I've scrolled to the schedule section for you.`,
        suggestedReplies: ['Build my itinerary', 'When is the pitch competition?', 'Show speakers'],
      }
    }

    case 'speaker_query': {
      scrollToSection('speakers')
      const names = ctx.speakers.slice(0, 3).map((s) => `**${s.name}** (${s.title})`).join(', ')
      return {
        text: `We have ${ctx.speakers.length} confirmed speakers so far, including ${names}. Hover any card to view their full bio!`,
        suggestedReplies: ['Build my itinerary', 'Show schedule', 'Get passes'],
      }
    }

    case 'sponsor_query': {
      scrollToSection('sponsors')
      return {
        text: `PEC Summit is supported by premier partners across Title, Gold, and Silver tiers. Interested in sponsoring? Contact partnerships@ecellpec.in`,
        suggestedReplies: ['Tell me about the fest', 'Build my itinerary', 'When does it start?'],
      }
    }

    case 'subscribe': {
      const email = intent.email
      if (!email) {
        return {
          text: `Sure! Share your email address and I'll add you to the PEC Summit updates list.`,
          suggestedReplies: [],
        }
      }
      const result = subscribeEmail(email)
      return { text: result.message, toast: result.toast || undefined }
    }

    case 'faq_query': {
      scrollToSection('faq')
      return {
        text: `I've scrolled to the FAQ section. Venue: **PEC Campus, Sector 12, Chandigarh**. You can also ask me specific questions directly!`,
        suggestedReplies: ['Build my itinerary', 'Is it free to attend?', 'Get passes'],
      }
    }

    case 'general_info': {
      return {
        text: `**PEC Summit** is E-Cell PEC's flagship entrepreneurship summit featuring 3,000+ attendees, 40+ speakers, ₹15L+ prize pool, and 2 days of pitches & hackathons. Dates: ${ctx.meta.dates}.`,
        suggestedReplies: ['Build my itinerary', 'What tracks are there?', 'Get passes'],
      }
    }

    default: {
      return {
        text: `I'm the Summit Agent! I can answer questions, take you to sections, or **build a personalized itinerary** (try asking: "Build a Day 2 itinerary for AI"). What would you like to do?`,
        suggestedReplies: ['Build my itinerary', 'When does it start?', 'Show speakers'],
      }
    }
  }
}

export const SUGGESTED_STARTERS = [
  'Build my itinerary',
  'What tracks are there?',
  'When does it start?',
  'Show me speakers',
  'Tell me about the pitch competition',
]
