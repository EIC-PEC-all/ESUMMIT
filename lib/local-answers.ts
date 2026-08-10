// lib/local-answers.ts
// ─────────────────────────────────────────────────────────────────────────────
// Local answer engine: handles common queries from static data WITHOUT calling
// Groq at all. This is the single biggest token-saving optimization — roughly
// 60% of chatbot traffic (schedule, speakers, FAQ, venue) can be answered here.
//
// Returns a string answer if the query can be resolved locally, or null to
// signal that the query must be forwarded to Groq.
// ─────────────────────────────────────────────────────────────────────────────

// ── Static knowledge base ────────────────────────────────────────────────────

const SCHEDULE_TEXT = `**Day 1 — March 15, 2026**
• 09:00 Registration & Welcome Kit (Main Gate)
• 10:00 Inaugural Ceremony & Keynote (Main Auditorium)
• 11:00 Panel: Fundraising in a Tough Climate (Main Auditorium)
• 12:30 Startup Expo Opens (Expo Hall)
• 13:30 Lunch & Networking (Student Center)
• 14:30 Pitch Competition Round 1 (Main Auditorium)
• 16:00 Panel: AI for Startups (Main Auditorium)
• 17:30 Hackathon Kickoff (CSE Block)
• 19:00 Speed Networking (Admin Block)
• 20:00 Dinner & Evening Mixer (Student Center)

**Day 2 — March 16, 2026**
• 09:00 Hackathon Mid-Check & Mentor Rotations (CSE Block)
• 10:00 Panel: Student-to-Founder Playbook (Main Auditorium)
• 11:30 Investor Open Hours (Admin Block)
• 12:30 Lunch (Student Center)
• 13:30 Hackathon Final Presentations (CSE Block)
• 15:00 Pitch Competition Finals (Main Auditorium)
• 16:30 Panel: Deep-Tech in India (Main Auditorium)
• 17:30 Awards Ceremony (Main Auditorium)
• 18:30 Closing Keynote (Main Auditorium)
• 19:30 Closing Mixer (Student Center)`

const SPEAKERS_TEXT = `**PEC Summit 2026 Speakers (8 confirmed)**
1. **Priya Nair** — Partner, Surge Ventures
2. **Arjun Mehta** — Co-founder & CTO, Kira.ai
3. **Deepika Rangi** — Head of Startup Ecosystem, Nasscom
4. **Sameer Khanna** — Angel Investor & ex-Sequoia EIR
5. **Ritu Sharma** — Founder, GreenMile Logistics
6. **Vikram Bose** — VP Product, Razorpay
7. **Ananya Joshi** — Founder, MindBloom EdTech
8. **Kabir Singh** — CTO, Stealth Agri-Startup`

const FAQ_BANK: Array<{ patterns: string[]; answer: string }> = [
  {
    patterns: ['ticket', 'cost', 'price', 'fee', 'free', 'paid', 'registration fee', 'how much'],
    answer: `**Tickets & Registration**
Ticket pricing and registration details will be announced when the portal opens. Keep an eye on our social channels for updates!

💡 *Tip: Ask me to subscribe your email so you get notified the moment registrations open.*`,
  },
  {
    patterns: ['where', 'venue', 'location', 'address', 'campus', 'pec', 'chandigarh', 'sector 12'],
    answer: `**Venue — PEC Campus**
📍 Punjab Engineering College, Sector 12, Chandigarh

Key event venues on campus:
• **Main Auditorium** — Keynotes, Panels, Pitch Finals (CCA Building)
• **CSE Block** — Hackathon
• **Admin Block** — Investor Open Hours, Funding Conclave
• **Expo Hall** — Startup Expo & Job Fair (Hall A & B)
• **Student Center / PEC Market** — Networking, Lunch, Baazar

Ask me to show you a walking route to any venue!`,
  },
  {
    patterns: ['eligibility', 'who can', 'can i attend', 'student', 'college', 'graduate', 'professional'],
    answer: `**Eligibility**
PEC Summit 2026 is open to:
• **Students** — from any college/university across India
• **Startup Founders & Teams** — at any stage
• **Professionals** — developers, investors, ecosystem builders

Specific eligibility for competitive tracks (Pitch Competition, Hackathon, Case Competition) will be published with registration rules.`,
  },
  {
    patterns: ['accommodation', 'hotel', 'hostel', 'stay', 'lodge'],
    answer: `**Accommodation**
Official accommodation details are not yet confirmed. We recommend checking:
• PEC's on-campus hostel facilities (limited, priority to outstation participants)
• Nearby hotels in Sector 8-12, Chandigarh

Details will be published closer to the event. Subscribe to our updates to get notified!`,
  },
  {
    patterns: ['hackathon', 'hack'],
    answer: `**Hackathon — 24-Hour Build**
• **Kickoff**: Day 1 at 17:30 (CSE Block)
• **Mid-check & Mentor Rotations**: Day 2 at 09:00
• **Final Presentations**: Day 2 at 13:30
• **Themes**: AI/ML, Web3, Climate Tech, Open Innovation
• **Team size**: TBA with registration rules
• **Venue**: CSE Block

Want me to build you a hackathon-focused itinerary?`,
  },
  {
    patterns: ['pitch', 'pitch competition', 'startup pitch', 'pitch finals'],
    answer: `**Pitch Competition — Founders Stage**
• **Round 1**: Day 1 at 14:30 (Main Auditorium)
• **Finals**: Day 2 at 15:00 (Main Auditorium)
• **Format**: 5-min pitch + 5-min Q&A
• **Categories**: Pre-revenue, Revenue-stage, Social Impact
• **Prize pool**: ₹15L+
• Submissions due 10 days before summit

Pitch to active VCs and angel investors — top 3 teams get mentorship fast-track!`,
  },
  {
    patterns: ['expo', 'startup expo', 'showcase'],
    answer: `**Startup Expo — Show + Tell**
• **Opens**: Day 1 at 12:30 (Expo Hall - Hall A)
• **30+ student and early-stage startups** showcasing products
• Live investor matchmaking throughout the day
• Open to all attendees

Want to exhibit at the Expo? Check registration details once they open!`,
  },
  {
    patterns: ['networking', 'speed networking', 'meet', 'connect'],
    answer: `**Networking at PEC Summit**
• **Speed Networking Session** — Day 1 at 19:00 (Admin Block)
• **Evening Mixer** — Day 1 at 20:00 (Student Center)
• **Investor Open Hours** — Day 2 at 11:30 (Admin Block)
• **Closing Mixer** — Day 2 at 19:30 (Student Center)
• **Startup Expo** — Day 1 from 12:30 (Expo Hall)

The summit hosts 3,000+ attendees, 40+ speakers — great for building connections!`,
  },
  {
    patterns: ['date', 'when', 'schedule', 'time', 'day 1', 'day 2', 'march', 'agenda', 'timetable', 'program'],
    answer: SCHEDULE_TEXT,
  },
  {
    patterns: ['speaker', 'keynote', 'panelist', 'who is speaking', 'priya', 'arjun', 'deepika', 'sameer', 'ritu', 'vikram', 'ananya', 'kabir'],
    answer: SPEAKERS_TEXT,
  },
  {
    patterns: ['prize', 'reward', 'winning', 'award', 'money', 'cash'],
    answer: `**Prize Pool — ₹15 Lakh+**
Prizes are distributed across:
• Pitch Competition (1st, 2nd, 3rd place across categories)
• Hackathon (winners + special track prizes)
• Case Competition, BizQuiz, and other competitions

Exact prize breakdowns will be published with registration rules.`,
  },
  {
    patterns: ['contact', 'email', 'reach out', 'organizer', 'help', 'support'],
    answer: `**Contact & Support**
• 📸 Instagram: [@ecellpec](https://instagram.com/ecellpec)
• 🐦 Twitter/X: [@ecellpec](https://twitter.com/ecellpec)
• 💼 LinkedIn: [E-Cell PEC](https://linkedin.com/company/ecellpec)

For specific queries, you can also ask me directly — I'm connected to live event data!`,
  },
  {
    patterns: ['hi', 'hello', 'hey', 'hii', 'helo', 'good morning', 'good evening', 'sup', 'wassup'],
    answer: `Hey! 👋 I'm the **PEC Summit 2026 Official Assistant**. I can help you with:

🗓️ **Schedule** — Day-by-day agenda for March 15–16
🎤 **Speakers** — Our 8 confirmed speakers
🗺️ **Campus Navigation** — Walking routes to any venue
🎪 **Activities** — Hackathon, Pitch Competition, Job Fair, and 13 more
❓ **FAQs** — Tickets, venue, eligibility, accommodation

What would you like to know?`,
  },
  {
    patterns: ['track', 'panel', 'discussion', 'what tracks', 'what events'],
    answer: `**PEC Summit 2026 — Main Tracks**

1. 🚀 **Pitch Competition** — Founders Stage (Main Auditorium)
2. 💬 **Panel Discussions** — Thought Leadership: Fundraising, AI, Deep-Tech, Student-to-Founder
3. 🏪 **Startup Expo** — Show + Tell (Expo Hall)
4. 💻 **Hackathon** — 24-Hour Build: AI/ML, Web3, Climate Tech (CSE Block)
5. 🤝 **Networking Mixer** — Speed networking + Investor office hours

Plus **13 additional activities** including Job Fair, R&D Conclave, IPL Auction, BizQuiz, Treasure Hunt, Baazar and more!`,
  },
]

// ── Normalizer ────────────────────────────────────────────────────────────────

/**
 * Normalize a user message for pattern matching:
 * lowercase, strip punctuation, collapse whitespace.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Attempt to answer a user message locally from static knowledge.
 *
 * @returns A string answer if the query can be resolved locally,
 *          or `null` if it must be sent to Groq.
 *
 * Design notes:
 * - Runs in O(n×m) time (n = FAQ entries, m = patterns per entry) — fast enough
 *   for a browser client.
 * - Returns the FIRST matching entry; order FAQ_BANK entries from most-specific
 *   to least-specific.
 * - Logs matched pattern to console so we can see what is being short-circuited.
 */
export function localAnswer(userMessage: string): string | null {
  const normalized = normalize(userMessage)

  // Reject very short or obviously ambiguous inputs — let Groq handle them
  if (normalized.length < 3) return null

  for (const entry of FAQ_BANK) {
    for (const pattern of entry.patterns) {
      if (normalized.includes(pattern)) {
        console.info(`[LocalAnswer] ✅ Matched "${pattern}" — skipping Groq call`)
        return entry.answer
      }
    }
  }

  console.info('[LocalAnswer] ❌ No local match — will call Groq')
  return null
}
