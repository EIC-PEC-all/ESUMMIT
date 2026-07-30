// components/Concierge/agent.ts
// Agentic Fest Concierge — frontend-only intent matcher + tool dispatcher
// ─────────────────────────────────────────────────────────────────────────
// SWAP POINT: Replace getAgentResponse() body with a real LLM call when ready.
// The TOOLS object and FestContext structure remain the same.
// ─────────────────────────────────────────────────────────────────────────

import { emitAgentEvent } from '@/lib/events'
import type { FestContext } from '@/lib/data'

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
  // Validate email (basic)
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
    message: `Done! ${email} has been added to the PEC Summit updates list. We'll reach out with early-bird registration details.`,
    toast: `✓ ${email} subscribed to PEC Summit updates`,
  }
}

// ── Intent Matching ───────────────────────────────────────────────────────

type Intent =
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
  if (/(scroll|go|take me|show).*(register|signup|register)/i.test(m)) return { type: 'scroll_to', section: 'register' }

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
  if (/(schedule|when|time|agenda|lineup|day 1|day 2|starts?|ends?)/i.test(m)) {
    // Check if querying a specific track
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
  if (/(free|cost|price|ticket|fee|where|location|venue|hostel|accommodation|accommodation)/i.test(m)) {
    return { type: 'faq_query', topic: 'logistics' }
  }
  if (/(faq|question|how do i|can i|eligible|who can)/i.test(m)) return { type: 'faq_query' }

  // General info
  if (/(what is|about|overview|tell me about|pec summit|ecell)/i.test(m)) return { type: 'general_info' }

  return { type: 'unknown' }
}

// ── Response Generator ─────────────────────────────────────────────────────

export interface AgentResponse {
  text: string
  toast?: string
  suggestedReplies?: string[]
}

/**
 * getAgentResponse — THE SWAP POINT for a real LLM
 *
 * To connect a real LLM (e.g., Gemini, GPT-4, Claude):
 *   1. Replace the function body below with an API call
 *   2. Pass `ctx` as a system prompt / context block
 *   3. Map LLM tool calls back to the TOOLS object above
 *   4. Return { text, toast?, suggestedReplies? }
 */
export async function getAgentResponse(
  userMessage: string,
  ctx: FestContext
): Promise<AgentResponse> {
  // Simulate a small network delay for realism
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))

  const intent = matchIntent(userMessage, ctx)

  switch (intent.type) {
    case 'scroll_to': {
      const label = intent.section.charAt(0).toUpperCase() + intent.section.slice(1)
      scrollToSection(intent.section)
      return {
        text: `Taking you to the ${label} section now.`,
        suggestedReplies: ['What tracks are there?', 'Who are the speakers?', 'When does it start?'],
      }
    }

    case 'highlight_track': {
      highlightEvent(intent.id)
      scrollToSection('tracks')
      return {
        text: `That's the **${intent.name}** — I've highlighted it for you. Want me to open the full details?`,
        suggestedReplies: [`Tell me more about ${intent.name}`, 'Show me speakers', 'What time does it start?'],
      }
    }

    case 'open_track': {
      openTrackCard(intent.id, intent.name)
      const track = ctx.tracks.find((t) => t.id === intent.id)
      return {
        text: `Opening **${intent.name}**. ${track?.shortDesc ?? ''}`,
        suggestedReplies: ['What other events are there?', 'Who are the judges?', 'How do I register?'],
      }
    }

    case 'schedule_query': {
      scrollToSection('schedule')
      if (intent.track) {
        const allEvents = [
          ...ctx.schedule.day1.events,
          ...ctx.schedule.day2.events,
        ].filter((e) => e.track === intent.track)
        if (allEvents.length > 0) {
          const first = allEvents[0]
          highlightScheduleRow(first.id, first.title)
          const list = allEvents.map((e) => `• ${e.time} — ${e.title}`).join('\n')
          return {
            text: `Here are the **${intent.track}** sessions:\n${list}\n\nI've highlighted the first one in the schedule.`,
            suggestedReplies: ['Show me Day 1', 'Show me Day 2', 'What time does it start?'],
          }
        }
      }
      const d1Start = ctx.schedule.day1.events[0]
      const d2Start = ctx.schedule.day2.events[0]
      return {
        text: `**Day 1** starts at ${d1Start.time} with "${d1Start.title}". **Day 2** kicks off at ${d2Start.time}. I've scrolled to the full schedule — use the tabs to switch days.`,
        suggestedReplies: ['When is the pitch competition?', 'When is the hackathon?', 'Show me speakers'],
      }
    }

    case 'speaker_query': {
      scrollToSection('speakers')
      const names = ctx.speakers.slice(0, 3).map((s) => `**${s.name}** (${s.title})`).join(', ')
      return {
        text: `We have ${ctx.speakers.length} confirmed speakers so far, including ${names}, and more to be announced. I've scrolled to the speakers section — hover any card for their full bio.`,
        suggestedReplies: ['What tracks are there?', 'Show me the schedule', 'How do I register?'],
      }
    }

    case 'sponsor_query': {
      scrollToSection('sponsors')
      return {
        text: `PEC Summit is supported by sponsors across Title, Gold, and Silver tiers, plus media partners. I've scrolled to the sponsors section. Interested in partnering? Contact partnerships@ecellpec.in`,
        suggestedReplies: ['Tell me about the fest', 'How many attendees?', 'When does it start?'],
      }
    }

    case 'subscribe': {
      const email = intent.email
      if (!email) {
        return {
          text: `Sure! Just share your email address and I'll add you to the PEC Summit updates list.`,
          suggestedReplies: [],
        }
      }
      const result = subscribeEmail(email)
      return { text: result.message, toast: result.toast || undefined }
    }

    case 'faq_query': {
      scrollToSection('faq')
      if (intent.topic === 'logistics') {
        return {
          text: `The summit is held at **PEC Campus, Sector 12, Chandigarh**. General attendance passes are available — check the registration section for pricing. The FAQ section has details on accommodation, hostel access, and more.`,
          suggestedReplies: ['How do I register?', 'Is it free?', 'Show me the schedule'],
        }
      }
      return {
        text: `Great question! I've scrolled to the FAQ section. You can also ask me directly — I'm happy to answer specific questions about the fest.`,
        suggestedReplies: ['Is it free to attend?', 'Where is the venue?', 'How do I register?'],
      }
    }

    case 'general_info': {
      const stats = ctx.stats
      return {
        text: `**PEC Summit** is ${ctx.meta.org}'s flagship entrepreneurship summit. It's a two-day event featuring ${stats.find((s) => s.id === 'attendees')?.value}+ attendees, ${stats.find((s) => s.id === 'speakers')?.value}+ speakers, and a ₹${stats.find((s) => s.id === 'prize')?.value}L+ prize pool. This is edition #${stats.find((s) => s.id === 'editions')?.value}. Venue: ${ctx.meta.venue}. Dates: ${ctx.meta.dates}.`,
        suggestedReplies: ['What tracks are there?', 'Show me the speakers', 'How do I register?'],
      }
    }

    default: {
      return {
        text: `I can help you navigate PEC Summit! You can ask me about tracks, speakers, the schedule, sponsors, registration — or just say "show me speakers" and I'll scroll right there.`,
        suggestedReplies: ['What tracks are there?', 'When does it start?', 'Show me speakers'],
      }
    }
  }
}

export const SUGGESTED_STARTERS = [
  'What tracks are there?',
  'When does it start?',
  'Show me speakers',
  'Tell me about the pitch competition',
  'Is it free to attend?',
]
