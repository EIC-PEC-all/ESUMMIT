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

const SCHEDULE_TEXT = `**Day 1 — September 26, 2026**
• 09:00 Registration & Welcome Kit (Main Gate Plaza)
• 10:00 Inaugural Ceremony & Keynote (Main Auditorium)
• 11:00 Startup Expo & Founder Alley Launch (Exhibition Grounds)
• 12:30 Expert Sessions & Workshops (Senate Hall)
• 13:30 Lunch & Networking (Student Center)
• 14:30 VC Pitch Arena: Qualifying Round (Incubator Hall)
• 16:00 Panel: Scaling Tech Platforms (Main Auditorium)
• 17:30 24-Hour National Hackathon Kickoff (Computer Center)
• 19:00 Speed Networking & E-Bazaar (Central Quadrangle)
• 20:00 VIP Investor & Founder Networking Dinner (PEC Club Lounge)

**Day 2 — September 27, 2026**
• 09:00 Hackathon Mid-Check & Mentor Rotations (Computer Center)
• 10:00 DeepTech & GenAI Masterclass (Main Auditorium)
• 11:30 Talent Fair & Dealroom Pitches (Admin Block)
• 12:30 Lunch Break (Student Center)
• 13:30 Hackathon Live Project Demos & Judging (Computer Center)
• 15:00 Grand Pitch Finals (Main Auditorium)
• 16:30 Women Founders + Alumni Connect (Senate Hall)
• 17:30 Valedictory Keynote & Award Ceremony (Main Auditorium)
• 19:30 Stand-up Comedy & Closing Celebration (Main Auditorium)`

const SPEAKERS_TEXT = `**E-Summit 2026 Speakers**
1. **Sandeep Jain** — Founder, GeeksforGeeks
2. **Saurabh Munjal** — Co-Founder & CEO, Lahori Zeera
3. **Aditi Bhutia Madan** — Founder, Momo Mami (Shark Tank India)
4. **Sourabh Goyal** — Founder, SuccessBrew
5. **Mandeep Kaur Tangra** — Founder, SimbaQuartz
6. **Aahan Khurma** — Co-Founder & CEO, Wellversed
7. **Drishti Kharbanda** — Founder, Bake Cosmetics
8. **Aseem Ghavri** — Co-Founder, Third Unicorn
9. **Varun Singla** — Founder, Gate Smashers
10. **Sarvjeet Singh** — Founder, Finvasia & Shoonya
11. **Paresh Gupta** — Founder, CUETPro / GSEC
12. **Sharad Sagar** — Founder & CEO, Dexterity Global
13. **Paritosh Anand** — Founder, WeSmile / Believe Clothing
14. **Aditya Arora** — Android Lead, SAP & Angel Investor
15. **Nandu Nandkishore** — Former Global CEO, Nestlé Nutrition
16. **Daksh Sethi** — Founder & CEO, Guby Rogers
17. **Hardik Banga** — Co-Founder, Adsworm
18. **Rupinder Singh** — Founder, Bio House`

const FAQ_BANK: Array<{ patterns: string[]; answer: string }> = [
  {
    patterns: ['ticket', 'cost', 'price', 'fee', 'free', 'paid', 'registration fee', 'how much'],
    answer: `**Tickets & Registration**
Ticket pricing and registration details will be announced when the portal opens. Keep an eye on our social channels for updates!

*Tip: Ask me to subscribe your email so you get notified the moment registrations open.*`,
  },
  {
    patterns: ['where', 'venue', 'location', 'address', 'campus', 'pec', 'chandigarh', 'sector 12'],
    answer: `**Venue — PEC Campus**
Punjab Engineering College, Sector 12, Chandigarh

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
E-Summit 2026 is open to:
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
    answer: `**Networking at E-Summit**
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
• Instagram: [@ecellpec](https://instagram.com/ecellpec)
• Twitter/X: [@ecellpec](https://twitter.com/ecellpec)
• LinkedIn: [E-Cell PEC](https://linkedin.com/company/ecellpec)

For specific queries, you can also ask me directly — I'm connected to live event data!`,
  },
  {
    patterns: ['hi', 'hello', 'hey', 'hii', 'helo', 'good morning', 'good evening', 'sup', 'wassup'],
    answer: `Hello! I am the **E-Summit 2026 Official Assistant**. I can help you with:

• **Schedule** — Day-by-day agenda for September 26–27
• **Speakers** — Our confirmed speakers
• **Campus Navigation** — Walking routes to any venue
• **Activities** — Hackathon, Pitch Competition, Job Fair, and more
• **FAQs** — Tickets, venue, eligibility, accommodation

What would you like to know?`,
  },
  {
    patterns: ['track', 'panel', 'discussion', 'what tracks', 'what events'],
    answer: `**E-Summit 2026 — Main Tracks**

1. **Pitch Competition** — Founders Stage (Main Auditorium)
2. **Panel Discussions** — Thought Leadership: Fundraising, AI, Deep-Tech, Student-to-Founder
3. **Startup Expo** — Show + Tell (Expo Hall)
4. **Hackathon** — 24-Hour Build: AI/ML, Web3, Climate Tech (CSE Block)
5. **Networking Mixer** — Speed networking + Investor office hours

Plus **13 additional activities** including Job Fair, R&D Conclave, IPL Auction, BizQuiz, Treasure Hunt, Baazar and more!`,
  },
  {
    patterns: ['alumni', 'notable alumni', 'kalpana', 'chawla', 'padmasree', 'warrior', 'satish dhawan', 'gajendra', 'cars24'],
    answer: `**Notable PEC Alumni**
• **Kalpana Chawla** — NASA Astronaut, first Indian-origin woman in space (PEC '82)
• **Padmasree Warrior** — Former CTO Cisco & Motorola, now CEO Fable (PEC '82)
• **Satish Dhawan** — Former Chairman, ISRO (PEC '38)
• **Steve Sanghi** — Executive Chairman, Microchip Technology (PEC '75)
• **Gajendra Jangid** — Co-Founder & CMO, CARS24 ($3.3B unicorn, PEC '05)
• **Jaspal Bhatti** — Iconic satirist, Padma Bhushan Awardee (PEC '78)

Ask me about any specific alumni!`,
  },
  {
    patterns: ['sponsor', 'partner', 'finvasia', 'google cloud', 'github', 'supported by'],
    answer: `**Summit Partners & Sponsors**
• **Event Partner**: Google Cloud & GitHub (Hackathon)
• **Finance Partner**: Finvasia & Shoonya
• **Investor Network**: Chandigarh Angels Network
• **Career Partner**: PEC Training & Placement Cell
• **Community Partner**: CII & Young Indians

Interested in sponsorship? Reach out at ecellpec@gmail.com`,
  },
  {
    patterns: ['events', 'what can i do', 'activities', 'all events', 'list'],
    answer: `**All Events at E-Summit 2026**
1. E-Summit Hackathon (24-Hour)
2. Talent Fair — Internship & Job Fair
3. Funding Conclave
4. IPL Auction Strategy Challenge
5. Build & Pitch Competition
6. E-Bazaar (Startup Flea Market)
7. Game of Brands & Biz Quiz
8. Startup Expo + Science Fair

Plus: Women Founders Connect, Campus Treasure Hunt, Stand-up Comedy & E-Sports, and more!`,
  },
  {
    patterns: ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'that\'s all', 'awesome', 'great', 'perfect'],
    answer: `You're welcome! Feel free to ask anything else about E-Summit 2026. See you at PEC on **September 26–27**! 🚀`,
  },
  {
    patterns: ['register', 'sign up', 'how to register', 'how to join', 'apply'],
    answer: `**How to Register**

1. Click **"Register Now"** on this website (top navigation)
2. Sign in with your Google account
3. Select your pass type (Student / Professional)
4. Choose the events you want to attend
5. Complete payment (if applicable)

Registration for competitions (Hackathon, Pitch) has separate eligibility — check the event details page!`,
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
 */
export function localAnswer(userMessage: string): string | null {
  const normalized = normalize(userMessage)

  // Reject very short or obviously ambiguous inputs — let Groq handle them
  if (normalized.length < 3) return null

  for (const entry of FAQ_BANK) {
    for (const pattern of entry.patterns) {
      if (normalized.includes(pattern)) {
        console.info(`[LocalAnswer] Matched "${pattern}" — skipping Groq call`)
        return entry.answer
      }
    }
  }

  console.info('[LocalAnswer] No local match — will call Groq')
  return null
}

