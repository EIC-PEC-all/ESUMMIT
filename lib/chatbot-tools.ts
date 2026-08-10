// lib/chatbot-tools.ts
// Function definitions and implementations for the chatbot

import { CAMPUS_VENUES, CAMPUS_GRAPH, findShortestPath, getVenueCoordinates, SCHEDULE, DAY_EVENT_VENUES, SPEAKERS } from '@/lib/data'
import type { CampusVenue } from '@/lib/data'

// Tool function implementations
export async function scrollToSection(section: string): Promise<string> {
  if (typeof window !== 'undefined') {
    // Map common section names to actual DOM IDs
    const sectionMap: Record<string, string> = {
      'hero': 'esummit-hero',
      'about': 'esummit-about',
      'tracks': 'esummit-tracks',
      'speakers': 'speakers',
      'schedule': 'schedule',
      'sponsors': 'sponsors',
      'faq': 'faq',
      'register': 'register',
      'events-navigation': 'events-navigation',
    }
    
    const targetId = sectionMap[section.toLowerCase()] || section
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return `Scrolled to the ${section} section.`
    }
  }
  return `Couldn't find section: ${section}.`
}

export async function buildItinerary(
  day: 'day1' | 'day2' | 'all',
  topic?: string
): Promise<{ title: string; sessions: Array<{ id: string; day: string; time: string; title: string; type: string; track: string | null; venue: string }> }> {
  const topicLabel = topic ? topic.charAt(0).toUpperCase() + topic.slice(1) : 'Recommended'
  const dayLabel = day === 'day1' ? 'Day 1' : day === 'day2' ? 'Day 2' : '2-Day'
  
  // Get events for the requested day(s)
  let events: typeof SCHEDULE.day1.events = []
  if (day === 'day1') {
    events = SCHEDULE.day1.events
  } else if (day === 'day2') {
    events = SCHEDULE.day2.events
  } else {
    events = [...SCHEDULE.day1.events, ...SCHEDULE.day2.events]
  }
  
  // Filter by topic if provided
  if (topic) {
    const topicLower = topic.toLowerCase()
    events = events.filter(event => 
      event.title.toLowerCase().includes(topicLower) ||
      event.type.toLowerCase().includes(topicLower) ||
      (event.track && event.track.toLowerCase().includes(topicLower))
    )
  }
  
  // Map events to session format with venue info
  // Use appropriate venue mapping based on day
  const day1Events = DAY_EVENT_VENUES.day1
  const day2Events = DAY_EVENT_VENUES.day2
  const allVenueEvents = [...day1Events, ...day2Events]
  
  const sessions = events.map(event => {
    const venueInfo = allVenueEvents.find(de => de.eventId === event.id)
    return {
      id: event.id,
      day: event.id.startsWith('d1') ? 'Day 1' : 'Day 2',
      time: event.time,
      title: event.title,
      type: event.type,
      track: event.track ?? null,
      venue: venueInfo?.venueName || 'TBA',
    }
  })
  
  return {
    title: `Custom ${dayLabel} ${topicLabel} Itinerary`,
    sessions
  }
}

export async function getActivityDetails(activityId: string): Promise<string> {
  const activities: Record<string, { title: string; description: string; venue: string; status: string }> = {
    'corporate-workshops': {
      title: 'Corporate Workshops',
      description: 'Practical sessions on entrepreneurship, technology, innovation, and employability with partners like Google and Wadhwani Foundation. Theme, facilitator, duration, and eligibility finalized with each confirmed partner.',
      venue: 'Workshop Hall (CCA Building - Upper Floor)',
      status: 'Subject to partner confirmation'
    },
    'job-fair': {
      title: 'Internship & Job Fair',
      description: 'Structured recruitment platform for startups and organizations to engage students for internships, projects, and full-time roles. Includes company showcases, resume screening, interviews, and networking.',
      venue: 'Job Fair Zone (Expo Hall - Hall B)',
      status: 'To be finalized after recruiter confirmation'
    },
    'rd-conclave': {
      title: 'R&D Conclave',
      description: 'Interface between researchers and industry. Research presentations, poster/prototype demos, expert review panels, and one-on-one industry interactions for technical validation and commercialization pathways.',
      venue: 'R&D Conclave Hall (NAB Building - Conference Room)',
      status: 'To be finalized after call for participation'
    },
    'ipl-auction': {
      title: 'IPL Auction',
      description: 'Simulation-based team strategy and bidding competition inspired by cricket auctions. Teams operate within a virtual budget, assess player profiles, and bid to assemble balanced squads. Strengthens analytical thinking, negotiation, and financial planning.',
      venue: 'IPL Auction Room (CCA Building - Seminar Room)',
      status: 'To be finalized after format approval'
    },
    'ignite': {
      title: 'Ignite',
      description: 'High-energy platform for showcasing innovative ideas and entrepreneurial thinking. May include rapid pitches, thematic challenges, demonstrations, or curated presentations. Encourages initiative, creativity, and clarity of thought.',
      venue: 'Main Auditorium (CCA)',
      status: 'To be finalized'
    },
    'treasure-hunt': {
      title: 'Treasure Hunt',
      description: 'Interactive team-based activity promoting observation, logical reasoning, collaboration, and time management through clues and problem-solving tasks across authorized campus areas.',
      venue: 'Starts at Student Center (PEC Market)',
      status: 'To be finalized after route and venue approval'
    },
    'baazar': {
      title: 'Baazar',
      description: 'Campus marketplace for student-led ventures, products, services, food, and creative work. Practical exposure to sales, pricing, marketing, and business operations. Stall allocation and commercial conditions governed by event guidelines.',
      venue: 'Baazar Marketplace (PEC Market / Open Grounds)',
      status: 'Stall capacity and footfall to be finalized'
    },
    'bizquiz': {
      title: 'BizQuiz (with SAASC)',
      description: 'Business and entrepreneurship quiz assessing knowledge of markets, economics, brands, and corporate developments. Includes preliminary screening and moderated final rounds. Jointly organized with SAASC.',
      venue: 'Quiz Hall (NAB Building)',
      status: 'To be finalized jointly with SAASC'
    },
    'additional-quiz': {
      title: 'Additional Quiz (with SAASC)',
      description: 'Second quiz on a mutually approved theme to broaden engagement. Subject area, format, rounds, and evaluation decided jointly with SAASC.',
      venue: 'Quiz Hall (NAB Building)',
      status: 'To be finalized jointly with SAASC'
    },
    'campus-ambassador': {
      title: 'Campus Ambassador Programme',
      description: 'Student representatives from selected institutions for outreach, promotion, participant mobilization, and coordination. Selection criteria, responsibilities, reporting, and performance indicators defined before launch.',
      venue: 'N/A (Remote coordination)',
      status: 'Ambassador intake to be finalized'
    },
    'expert-sessions': {
      title: 'Expert Speaker Sessions',
      description: 'Keynotes, moderated conversations, fireside chats, and Q&A with entrepreneurs, professionals, investors, academicians, and industry leaders on entrepreneurship, technology, innovation, careers, and leadership.',
      venue: 'Various (Main Auditorium, Seminar Hall)',
      status: 'Subject to venue capacity'
    },
    'funding-conclave': {
      title: 'Funding Conclave (TTM)',
      description: 'Connects selected startups with investors, mentors, and ecosystem stakeholders. Includes curated pitches, evaluation panels, investor interactions, office hours, and networking. Focus on investment readiness and follow-up opportunities.',
      venue: 'Funding Conclave Room (Admin Block - Meeting Room)',
      status: 'To be finalized after stakeholder confirmation'
    },
    'case-competition': {
      title: 'Case Competition',
      description: 'Teams analyze a real or simulated business problem and present structured, evidence-based solutions. Evaluated on analytical quality, feasibility, originality, strategic reasoning, and presentation clarity.',
      venue: 'Case Competition Room (CSE & ECE Block - Seminar Room)',
      status: 'Team capacity to be finalized'
    }
  }

  const activity = activities[activityId]
  if (!activity) {
    return `Activity "${activityId}" not found. Available activities: ${Object.keys(activities).join(', ')}`
  }

  return `**${activity.title}**
${activity.description}

**Venue:** ${activity.venue}
**Status:** ${activity.status}

*Note: All additional activities are subject to confirmation — venue, partner, format, and safety approvals pending. Registration opens after event-specific rules are published.*`
}

export async function getSpeakers(track?: string): Promise<string> {
  let speakers = SPEAKERS
  if (track) {
    const trackLower = track.toLowerCase()
    speakers = speakers.filter(s =>
      s.track.toLowerCase().includes(trackLower) ||
      s.title.toLowerCase().includes(trackLower)
    )
  }
  if (speakers.length === 0) {
    return `No speakers found${track ? ` for track "${track}"` : ''}. Available tracks: pitch, panels, expo, hackathon, networking.`
  }
  return speakers.map(s =>
    `**${s.name}** — ${s.title}\n${s.bio.slice(0, 120)}…`
  ).join('\n\n')
}

export async function subscribeEmail(email: string): Promise<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return `That doesn't look like a valid email address. Please try again.`
  }
  if (typeof window !== 'undefined') {
    const existing: string[] = JSON.parse(localStorage.getItem('pec_summit_subscribers') || '[]')
    if (existing.includes(email)) {
      return `${email} is already on the E-Summit PEC updates list!`
    }
    existing.push(email)
    localStorage.setItem('pec_summit_subscribers', JSON.stringify(existing))
  }
  return `Done! **${email}** has been subscribed to E-Summit PEC 2026 updates.`
}

export async function getTreasureHuntStatus(teamId: string): Promise<string> {
  // Placeholder - would connect to real-time game state
  return `Treasure Hunt tracking for team "${teamId}" would show: current checkpoint, clues solved, time elapsed, and team position. This requires real-time game server integration.`
}

export async function getBaazarStalls(category?: string): Promise<string> {
  const categories = ['food', 'products', 'services', 'creative']
  if (category && !categories.includes(category)) {
    return `Invalid category. Available: ${categories.join(', ')}`
  }
  return `Baazar stall listings${category ? ` for "${category}"` : ''} will be available after stall allocation is finalized. Categories: Food, Products, Services, Creative.`
}

export async function registerForActivity(activityId: string, userEmail: string): Promise<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userEmail)) {
    return 'Invalid email address. Please provide a valid email.'
  }
  
  const activityNames: Record<string, string> = {
    'corporate-workshops': 'Corporate Workshops',
    'job-fair': 'Internship & Job Fair',
    'rd-conclave': 'R&D Conclave',
    'ipl-auction': 'IPL Auction',
    'ignite': 'Ignite',
    'treasure-hunt': 'Treasure Hunt',
    'baazar': 'Baazar (stall application)',
    'bizquiz': 'BizQuiz',
    'additional-quiz': 'Additional Quiz',
    'campus-ambassador': 'Campus Ambassador Programme',
    'expert-sessions': 'Expert Speaker Sessions',
    'funding-conclave': 'Funding Conclave',
    'case-competition': 'Case Competition'
  }
  
  const name = activityNames[activityId] || activityId
  return `Registration interest recorded for **${name}** (${userEmail}). You'll be notified when registrations open. Note: Most activities are still subject to confirmation.`
}

export async function highlightActivityVenue(activityId: string): Promise<string> {
  const venueMap: Record<string, string> = {
    'corporate-workshops': 'workshop-hall',
    'job-fair': 'job-fair-zone',
    'rd-conclave': 'rd-conclave-hall',
    'ipl-auction': 'ipl-auction-room',
    'ignite': 'ignite-stage',
    'treasure-hunt': 'treasure-hunt-start',
    'baazar': 'baazar-zone',
    'bizquiz': 'quiz-hall',
    'additional-quiz': 'quiz-hall',
    'expert-sessions': 'main-auditorium',
    'funding-conclave': 'funding-conclave-room',
    'case-competition': 'case-competition-room'
  }
  
  const venueId = venueMap[activityId]
  if (!venueId) {
    return `No venue mapping for activity: ${activityId}`
  }
  
  // Emit event for map to highlight
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('highlightActivityVenue', { detail: { venueId } })
    window.dispatchEvent(event)
  }
  
  const venue = CAMPUS_VENUES[venueId as keyof typeof CAMPUS_VENUES]
  return venue ? `Highlighted **${venue.name}** on the campus map.` : `Venue not found: ${venueId}`
}

export async function getCampusRoute(venueId: string, origin: string = 'main-gate'): Promise<string> {
  const destination = getVenueCoordinates(venueId)
  const originCoords = getVenueCoordinates(origin)
  
  if (!destination || !originCoords) {
    return `Could not find coordinates for ${origin} or ${venueId}`
  }
  
  const route = findShortestPath(originCoords, destination)
  if (!route) {
    return `No valid route found between locations`
  }
  
  // Emit event for map to draw route
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('drawCampusRoute', { detail: { coordinates: route.coordinates } })
    window.dispatchEvent(event)
  }
  
  const distance = route.distance < 1000 
    ? `${Math.round(route.distance)} m` 
    : `${(route.distance / 1000).toFixed(1)} km`
  const duration = Math.round(route.duration / 60)
  
  return `Route from **${origin}** to **${CAMPUS_VENUES[venueId as keyof typeof CAMPUS_VENUES]?.name || venueId}**:
- Distance: ${distance}
- Walk time: ~${duration} min
- Route drawn on campus map`
}

// Tool definitions for Gemini function calling
export const TOOL_DEFINITIONS = [
  {
    name: 'scroll_to_section',
    description: 'Scroll user to a page section',
    parameters: {
      type: 'object',
      properties: {
        section: { 
          type: 'string', 
          enum: ['hero', 'about', 'tracks', 'speakers', 'schedule', 'sponsors', 'faq', 'register', 'events-navigation']
        }
      },
      required: ['section']
    }
  },
  {
    name: 'build_itinerary',
    description: 'Generate personalized day itinerary',
    parameters: {
      type: 'object',
      properties: {
        day: { type: 'string', enum: ['day1', 'day2', 'all'] },
        topic: { type: 'string', description: 'e.g., AI, fintech, pitch, hackathon, networking' }
      },
      required: ['day']
    }
  },
  {
    name: 'get_activity_details',
    description: 'Get details about any of the 13 summit activities',
    parameters: {
      type: 'object',
      properties: {
        activityId: { 
          type: 'string', 
          enum: ['corporate-workshops', 'job-fair', 'rd-conclave', 'ipl-auction', 
                 'ignite', 'treasure-hunt', 'baazar', 'bizquiz', 'additional-quiz',
                 'campus-ambassador', 'expert-sessions', 'funding-conclave', 'case-competition']
        }
      },
      required: ['activityId']
    }
  },
  {
    name: 'get_treasure_hunt_status',
    description: 'Get live treasure hunt progress for a team',
    parameters: {
      type: 'object',
      properties: { teamId: { type: 'string' }},
      required: ['teamId']
    }
  },
  {
    name: 'get_baazar_stalls',
    description: 'Get Baazar stall listings by category',
    parameters: {
      type: 'object',
      properties: { category: { type: 'string', enum: ['food', 'products', 'services', 'creative'] }}
    }
  },
  {
    name: 'register_for_activity',
    description: 'Register user interest for an activity',
    parameters: {
      type: 'object',
      properties: {
        activityId: { type: 'string' },
        userEmail: { type: 'string', format: 'email' }
      },
      required: ['activityId', 'userEmail']
    }
  },
  {
    name: 'highlight_activity_venue',
    description: 'Highlight venue on campus map for an activity',
    parameters: {
      type: 'object',
      properties: { activityId: { type: 'string' }},
      required: ['activityId']
    }
  },
  {
    name: 'get_campus_route',
    description: 'Get walking route from user location to venue',
    parameters: {
      type: 'object',
      properties: { 
        venueId: { type: 'string' },
        origin: { type: 'string', description: 'current location or "main-gate"', default: 'main-gate' }
      },
      required: ['venueId']
    }
  },
  {
    name: 'get_speakers',
    description: 'Get speaker information, optionally filtered by track',
    parameters: {
      type: 'object',
      properties: { track: { type: 'string' }}
    }
  },
  {
    name: 'subscribe_email',
    description: 'Subscribe email to updates',
    parameters: {
      type: 'object',
      properties: { email: { type: 'string', format: 'email' }},
      required: ['email']
    }
  }
]

// Execute function by name
export async function executeFunction(name: string, args: Record<string, any>): Promise<string> {
  switch (name) {
    case 'scroll_to_section':
      return scrollToSection(args.section)
    case 'build_itinerary':
      return JSON.stringify(await buildItinerary(args.day, args.topic))
    case 'get_activity_details':
      return getActivityDetails(args.activityId)
    case 'get_treasure_hunt_status':
      return getTreasureHuntStatus(args.teamId)
    case 'get_baazar_stalls':
      return getBaazarStalls(args.category)
    case 'register_for_activity':
      return registerForActivity(args.activityId, args.userEmail)
    case 'highlight_activity_venue':
      return highlightActivityVenue(args.activityId)
    case 'get_campus_route':
      return getCampusRoute(args.venueId, args.origin)
    case 'get_speakers':
      return getSpeakers(args.track)
    case 'subscribe_email':
      return subscribeEmail(args.email)
    default:
      return `Unknown function: ${name}`
  }
}