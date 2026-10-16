import { MASTER_EVENTS, EventItem, TimelineEvent } from '@/data/summitData'

/** Fallback event descriptions for non-competition plenary & keynote sessions */
const SUPPLEMENTAL_EVENTS: Record<string, EventItem> = {
  'time-d1-1': {
    id: 'ev-inaugural',
    number: '00',
    title: 'Inaugural Ceremony & Keynote Address',
    category: 'Keynote',
    eyebrow: 'HONORING THE PAST · INNOVATING THE FUTURE',
    image: '/gallery/pec_keynote_speaker.png',
    purpose: 'Formal grand inauguration of E-Summit 2026, institute leadership address, and keynote speech by pioneering industry titans.',
    delivery: 'Main Auditorium ceremonial address, lamp lighting, and keynote fireside discussion.',
    expectedParticipation: '1,200+ Delegates & Attendees',
    tags: ['Inaugural', 'Keynote', 'Leadership', 'Founders'],
    partner: 'PEC Leadership & Industry Advisory Council',
    registrationUrl: null,
  },
  'time-d1-5': {
    id: 'ev-expert-sessions',
    number: 'EX',
    title: 'Expert Sessions: Founder Journeys & Scaling',
    category: 'Workshop',
    eyebrow: 'INSIGHT THAT MOVES INTO ACTION',
    image: '/gallery/pec_senate_roundtable.png',
    purpose: 'Candid discussions on venture building, market shifts, leadership decisions, and lessons rarely shared in textbooks.',
    delivery: 'Senate Hall closed-door roundtables and founder fireside sessions with live Q&A.',
    expectedParticipation: '350+ Attendees',
    tags: ['Founder Stories', 'Scale', 'Zero to One', 'Venture Building'],
    partner: 'E-Cell PEC Mentorship Board',
    registrationUrl: null,
  },
  'time-d1-6': {
    id: 'ev-workshops',
    number: 'WS',
    title: 'Hands-on Workshops: Product, Growth & AI',
    category: 'Workshop',
    eyebrow: 'PRACTICAL SKILL SESSIONS',
    image: '/gallery/pec_innovation_stage.png',
    purpose: 'Actionable masterclasses covering market validation, tech architecture, unit economics, and AI-driven growth tactics.',
    delivery: 'Hands-on product teardowns, live code labs, and growth frameworks across Seminar Halls 1 & 2.',
    expectedParticipation: '400+ Engineers & Builders',
    tags: ['Validation', 'Unit Economics', 'Growth Tools', 'AI Architecture'],
    partner: 'TechCorp India & Ecosystem Partners',
    registrationUrl: null,
  },
}

/**
 * Resolves a Timeline session to its corresponding Event card.
 * Prioritizes direct eventId, then keyword title matching, then supplemental sessions.
 */
export function getLinkedEvent(
  timelineEvent: TimelineEvent,
  eventsList: EventItem[] = MASTER_EVENTS
): EventItem | null {
  // 1. Direct eventId link
  if (timelineEvent.eventId) {
    const directMatch = eventsList.find((e) => e.id === timelineEvent.eventId)
    if (directMatch) return directMatch
  }

  // 2. Keyword matching across official summit properties
  const title = timelineEvent.title.toLowerCase()

  if (title.includes('hackathon')) {
    return eventsList.find((e) => e.id === 'ev-1') ?? null
  }
  if (title.includes('talent') || title.includes('job fair') || title.includes('internship')) {
    return eventsList.find((e) => e.id === 'ev-2') ?? null
  }
  if (title.includes('funding') || title.includes('pitching') || title.includes('conclave')) {
    return eventsList.find((e) => e.id === 'ev-3') ?? null
  }
  if (title.includes('ipl') || title.includes('auction')) {
    return eventsList.find((e) => e.id === 'ev-4') ?? null
  }
  if (title.includes('build & pitch') || title.includes('pitch grand')) {
    return eventsList.find((e) => e.id === 'ev-5') ?? null
  }
  if (title.includes('bazaar') || title.includes('flea market') || title.includes('trading')) {
    return eventsList.find((e) => e.id === 'ev-6') ?? null
  }
  if (title.includes('brands') || title.includes('quiz')) {
    return eventsList.find((e) => e.id === 'ev-7') ?? null
  }
  if (title.includes('expo') || title.includes('science fair')) {
    return eventsList.find((e) => e.id === 'ev-8') ?? null
  }
  if (title.includes('networking')) {
    return eventsList.find((e) => e.id === 'ev-9') ?? null
  }
  if (title.includes('women founders') || title.includes('alumni connect')) {
    return eventsList.find((e) => e.id === 'ev-10') ?? null
  }
  if (title.includes('treasure hunt')) {
    return eventsList.find((e) => e.id === 'ev-11') ?? null
  }
  if (title.includes('comedy') || title.includes('e-sports') || title.includes('valedictory')) {
    return eventsList.find((e) => e.id === 'ev-12') ?? null
  }

  // 3. Fallback to supplemental agenda entries
  return SUPPLEMENTAL_EVENTS[timelineEvent.id] ?? null
}

export const TRACK_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  keynote: {
    pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    dot: 'bg-emerald-400',
    label: 'Keynote',
  },
  hackathon: {
    pill: 'bg-purple-500/20 text-purple-400 dark:text-purple-300 border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    dot: 'bg-purple-400',
    label: 'Hackathon',
  },
  competition: {
    pill: 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    dot: 'bg-amber-400',
    label: 'Competition',
  },
  expo: {
    pill: 'bg-mint/20 text-mint border-mint/40 shadow-[0_0_12px_var(--border-glow)]',
    dot: 'bg-mint',
    label: 'Expo',
  },
  workshop: {
    pill: 'bg-blue-500/20 text-blue-300 border-blue-400/40 shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    dot: 'bg-blue-400',
    label: 'Workshop',
  },
  networking: {
    pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
    dot: 'bg-indigo-400',
    label: 'Networking',
  },
  culture: {
    pill: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/40 shadow-[0_0_12px_rgba(217,70,239,0.2)]',
    dot: 'bg-fuchsia-400',
    label: 'Culture',
  },
}
