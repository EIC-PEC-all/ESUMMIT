// lib/data.ts
// TODO: Replace all placeholder content with real PEC Summit content

export const FEST_META = {
  name: 'PEC Summit',
  edition: '2025',
  org: 'E-Cell PEC',
  tagline: "Chandigarh's launchpad for the next generation of founders.",
  taglineOptions: [
    "Chandigarh's launchpad for the next generation of founders.",
    'Where the tricity\'s boldest ideas meet their moment.',
    'The north\'s premier stage for student builders and venture thinkers.',
  ],
  // TODO: confirm dates + venue
  dates: 'March 15–16, 2026',
  venue: 'PEC Campus, Sector 12, Chandigarh',
  // Countdown target — TODO: update to real date
  countdownTarget: new Date('2026-03-15T09:00:00+05:30').toISOString(),
  registrationUrl: '#register',
  social: {
    instagram: 'https://instagram.com/ecellpec', // TODO: confirm handle
    twitter: 'https://twitter.com/ecellpec',       // TODO: confirm handle
    linkedin: 'https://linkedin.com/company/ecellpec', // TODO: confirm handle
  },
}

export const STATS = [
  { label: 'Attendees', value: 3000, suffix: '+', id: 'attendees' },
  { label: 'Speakers', value: 40, suffix: '+', id: 'speakers' },
  { label: 'Prize Pool', value: 15, suffix: 'L+', prefix: '₹', id: 'prize' },
  { label: 'Past Editions', value: 7, suffix: '', id: 'editions' },
]

export const TRACKS = [
  {
    id: 'pitch',
    title: 'Pitch Competition',
    eyebrow: 'FOUNDERS STAGE',
    icon: 'Zap',
    shortDesc: 'Present your startup idea to a panel of seasoned VCs and angel investors. Walk in with a deck, walk out with a deal.',
    fullDesc: `The centrepiece of PEC Summit. Teams of 2–4 pitch their MVP or idea to a jury of active investors and founders. Categories: Pre-revenue, Revenue-stage, and Social Impact. Top 3 teams share the prize pool and get fast-tracked to mentorship sessions.\n\nFormat: 5-min pitch + 5-min Q&A. Submissions due 10 days before summit.`,
    color: '#FF4D3D',
    accentColor: 'rgba(255,77,61,0.12)',
  },
  {
    id: 'panels',
    title: 'Panel Discussions',
    eyebrow: 'THOUGHT LEADERSHIP',
    icon: 'Users',
    shortDesc: 'Hard-hitting conversations with founders, CXOs, and policymakers on what actually builds companies.',
    fullDesc: `Curated panel topics: Fundraising in a Tough Climate, AI for Startups, Deep-Tech in India, and the Student-to-Founder playbook. Each session is 60 min with structured Q&A from the floor.\n\nSpeakers confirmed from the startup ecosystem — fintech, deep-tech, consumer internet, and climate tech.`,
    color: '#3DD9FF',
    accentColor: 'rgba(61,217,255,0.12)',
  },
  {
    id: 'expo',
    title: 'Startup Expo',
    eyebrow: 'SHOW + TELL',
    icon: 'Store',
    shortDesc: 'A live floor of 30+ student and early-stage startups showing their products to attendees and potential investors.',
    fullDesc: `The Startup Expo is open to all attendees across both days. Exhibiting startups get a booth, 2 passes, and access to investor matchmaking. Apply separately. Sectors: EdTech, AgriTech, HealthTech, SaaS, Hardware/IoT, and Sustainability.\n\nLast edition had 28 exhibiting startups with 6 on-spot LOIs.`,
    color: '#FF8C42',
    accentColor: 'rgba(255,140,66,0.12)',
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    eyebrow: '24-HOUR BUILD',
    icon: 'Code2',
    shortDesc: '24 hours. One problem statement. Build something real — or build something ridiculous. Both have won before.',
    fullDesc: `Theme announced 48 hours before the event. Teams of 2–4. Judged on innovation, tech execution, and go-to-market viability. Mentors from industry rotate through the floor every 3 hours.\n\nTracks: AI/ML, Web3, Climate Tech, Open Innovation. Prizes for overall winner and per-track winners.`,
    color: '#9B5CFF',
    accentColor: 'rgba(155,92,255,0.12)',
  },
  {
    id: 'networking',
    title: 'Networking Mixer',
    eyebrow: 'CONNECT',
    icon: 'Network',
    shortDesc: 'Structured networking sessions designed so you actually meet the right people — not just collect business cards.',
    fullDesc: `Three formats: Speed Networking (5-min rotations), Investor Open Hours (one-on-one 15-min slots, apply in advance), and the closing Mixer evening with music and food.\n\nAll registered participants get a digital profile in the PEC Summit app for pre-event connection. Investor Open Hours have limited slots — apply when registering.`,
    color: '#3DD9FF',
    accentColor: 'rgba(61,217,255,0.12)',
  },
]

export const SPEAKERS = [
  // TODO: replace with real speakers when confirmed
  {
    id: 'spk1',
    name: 'Priya Nair',
    title: 'Partner, Surge Ventures',
    bio: 'Early-stage investor with 12 years backing consumer and B2B SaaS startups across South and North India. Former founder (exited 2019).',
    track: 'panels',
    avatar: null, // TODO: replace with real image path
    initials: 'PN',
    color: '#FF4D3D',
  },
  {
    id: 'spk2',
    name: 'Arjun Mehta',
    title: 'Co-founder & CTO, Kira.ai',
    bio: 'Built and scaled an AI infrastructure company from a PEC dorm room to 200+ enterprise clients. IIT + PEC alum.',
    track: 'hackathon',
    avatar: null,
    initials: 'AM',
    color: '#3DD9FF',
  },
  {
    id: 'spk3',
    name: 'Deepika Rangi',
    title: 'Head of Startup Ecosystem, Nasscom',
    bio: 'Leads programmes supporting 3,000+ early-stage startups annually. Expert in policy, regulatory sandbox, and deep-tech GTM.',
    track: 'panels',
    avatar: null,
    initials: 'DR',
    color: '#FF8C42',
  },
  {
    id: 'spk4',
    name: 'Sameer Khanna',
    title: 'Angel Investor & ex-Sequoia EIR',
    bio: '25 angel investments, 4 exits. Focuses on Tier-2 city founders and climate-adjacent startups. Mentor at YC alumni network.',
    track: 'pitch',
    avatar: null,
    initials: 'SK',
    color: '#9B5CFF',
  },
  {
    id: 'spk5',
    name: 'Ritu Sharma',
    title: 'Founder, GreenMile Logistics',
    bio: 'Built an EV last-mile logistics company serving 14 cities. Forbes 30 Under 30, 2024. PEC alumna (ECE, 2019).',
    track: 'pitch',
    avatar: null,
    initials: 'RS',
    color: '#FF4D3D',
  },
  {
    id: 'spk6',
    name: 'Vikram Bose',
    title: 'VP Product, Razorpay',
    bio: 'Drove 10x payment volume growth as a product leader. Previously at Stripe London. Mentor to 40+ fintech startups.',
    track: 'panels',
    avatar: null,
    initials: 'VB',
    color: '#3DD9FF',
  },
  {
    id: 'spk7',
    name: 'Ananya Joshi',
    title: 'Founder, MindBloom EdTech',
    bio: 'Scaling personalised learning to 500K+ students across Tier-2/3 India. TEDx speaker, Social Impact Award 2023.',
    track: 'expo',
    avatar: null,
    initials: 'AJ',
    color: '#FF8C42',
  },
  {
    id: 'spk8',
    name: 'Kabir Singh',
    title: 'CTO, Stealth Agri-Startup',
    bio: 'Ex-Microsoft Research, now building precision farming tools for smallholder farmers. IIT Delhi + Stanford MS.',
    track: 'hackathon',
    avatar: null,
    initials: 'KS',
    color: '#9B5CFF',
  },
]

export const SCHEDULE = {
  day1: {
    label: 'Day 1',
    date: 'March 15, 2026', // TODO: confirm
    events: [
      { id: 'd1-1', time: '09:00', title: 'Registration & Welcome Kit', type: 'logistics', track: null },
      { id: 'd1-2', time: '10:00', title: 'Inaugural Ceremony & Keynote', type: 'keynote', track: null },
      { id: 'd1-3', time: '11:00', title: 'Panel: Fundraising in a Tough Climate', type: 'panel', track: 'panels' },
      { id: 'd1-4', time: '12:30', title: 'Startup Expo Opens', type: 'expo', track: 'expo' },
      { id: 'd1-5', time: '13:30', title: 'Lunch Break & Networking', type: 'break', track: null },
      { id: 'd1-6', time: '14:30', title: 'Pitch Competition — Round 1', type: 'competition', track: 'pitch' },
      { id: 'd1-7', time: '16:00', title: 'Panel: AI for Startups', type: 'panel', track: 'panels' },
      { id: 'd1-8', time: '17:30', title: 'Hackathon Kickoff + Problem Statement Reveal', type: 'hackathon', track: 'hackathon' },
      { id: 'd1-9', time: '19:00', title: 'Speed Networking Session', type: 'networking', track: 'networking' },
      { id: 'd1-10', time: '20:00', title: 'Dinner & Evening Mixer', type: 'social', track: null },
    ],
  },
  day2: {
    label: 'Day 2',
    date: 'March 16, 2026', // TODO: confirm
    events: [
      { id: 'd2-1', time: '09:00', title: 'Hackathon Mid-Check & Mentor Rotations', type: 'hackathon', track: 'hackathon' },
      { id: 'd2-2', time: '10:00', title: 'Panel: The Student-to-Founder Playbook', type: 'panel', track: 'panels' },
      { id: 'd2-3', time: '11:30', title: 'Investor Open Hours (by application)', type: 'networking', track: 'networking' },
      { id: 'd2-4', time: '12:30', title: 'Lunch Break', type: 'break', track: null },
      { id: 'd2-5', time: '13:30', title: 'Hackathon Final Presentations', type: 'hackathon', track: 'hackathon' },
      { id: 'd2-6', time: '15:00', title: 'Pitch Competition — Finals', type: 'competition', track: 'pitch' },
      { id: 'd2-7', time: '16:30', title: 'Panel: Deep-Tech in India', type: 'panel', track: 'panels' },
      { id: 'd2-8', time: '17:30', title: 'Awards Ceremony & Prize Distribution', type: 'keynote', track: null },
      { id: 'd2-9', time: '18:30', title: 'Closing Keynote', type: 'keynote', track: null },
      { id: 'd2-10', time: '19:30', title: 'Closing Mixer & Farewells', type: 'social', track: null },
    ],
  },
}

export const SPONSORS = {
  title: [
    { id: 'ts1', name: 'NorthStar Ventures', logo: null, url: '#' }, // TODO: replace with real sponsor
  ],
  gold: [
    { id: 'gs1', name: 'TechCorp India', logo: null, url: '#' },
    { id: 'gs2', name: 'Finova Capital', logo: null, url: '#' },
    { id: 'gs3', name: 'CloudBase SaaS', logo: null, url: '#' },
  ],
  silver: [
    { id: 'ss1', name: 'DevStack', logo: null, url: '#' },
    { id: 'ss2', name: 'InnoHub', logo: null, url: '#' },
    { id: 'ss3', name: 'Launchpad AI', logo: null, url: '#' },
    { id: 'ss4', name: 'Seed & Grow', logo: null, url: '#' },
    { id: 'ss5', name: 'PitchDeck Pro', logo: null, url: '#' },
    { id: 'ss6', name: 'MentorBridge', logo: null, url: '#' },
  ],
  media: [
    { id: 'mp1', name: 'StartupStory', logo: null, url: '#' },
    { id: 'mp2', name: 'YourStory', logo: null, url: '#' },
    { id: 'mp3', name: 'INC42', logo: null, url: '#' },
    { id: 'mp4', name: 'Entrepreneur India', logo: null, url: '#' },
    { id: 'mp5', name: 'TechCircle', logo: null, url: '#' },
    { id: 'mp6', name: 'The Economic Times', logo: null, url: '#' },
  ],
}

export const FAQS = [
  {
    id: 'faq1',
    question: 'Who can attend PEC Summit?',
    answer:
      'PEC Summit is open to all college students, recent graduates, early-stage founders, and professionals interested in the startup ecosystem. There is no restriction on college or city — attendees come from across North India.',
  },
  {
    id: 'faq2',
    question: 'How do I register for the Pitch Competition?',
    answer:
      'Register your team through the main registration portal and select "Pitch Competition" as your event. You\'ll need to submit a 1-page executive summary by the deadline (10 days before the summit). Shortlisted teams are notified within 5 days.',
  },
  {
    id: 'faq3',
    question: 'Is the event free to attend?',
    answer:
      'General attendance passes are available at an early-bird price for students. Passes include access to all panels, the startup expo, and networking sessions. The hackathon and pitch competition have separate (free) registration. Check the registration section for current pricing.',
  },
  {
    id: 'faq4',
    question: 'What is the Hackathon theme?',
    answer:
      'The theme is revealed 48 hours before the Hackathon kickoff. Past themes have included: "AI for Bharat", "Climate-First Products", and "Next Billion Users". Register early and keep an eye on our socials!',
  },
  {
    id: 'faq5',
    question: 'Can I apply for Investor Open Hours?',
    answer:
      'Yes! Investor Open Hours are limited to 15-minute one-on-one slots with select investors. Preference is given to registered pitch competition teams and startup expo exhibitors. Apply during registration — slots fill fast.',
  },
  {
    id: 'faq6',
    question: 'Where is PEC Summit held?',
    answer:
      'PEC Summit takes place on the campus of Punjab Engineering College (PEC), Sector 12, Chandigarh. Detailed venue maps and shuttle information will be shared with registered attendees.',
  },
  {
    id: 'faq7',
    question: 'How do I become a sponsor or exhibitor?',
    answer:
      'Reach out to our partnerships team at partnerships@ecellpec.in (// TODO: confirm email). We offer Title, Gold, Silver, and Media Partner tiers with different benefits. Startup Expo booths are applied for separately.',
  },
  {
    id: 'faq8',
    question: 'Will there be accommodation for outstation attendees?',
    answer:
      'We partner with a few hotels near campus and provide a list of recommended stays. E-Cell also facilitates hostel access on a limited basis for outstation participants registered for 2+ day events. Details shared post-registration.',
  },
]

// Type exports for use by the Concierge agent
export type Track = typeof TRACKS[0]
export type Speaker = typeof SPEAKERS[0]
export type FestContext = {
  tracks: typeof TRACKS
  speakers: typeof SPEAKERS
  schedule: typeof SCHEDULE
  sponsors: typeof SPONSORS
  faqs: typeof FAQS
  meta: typeof FEST_META
  stats: typeof STATS
}

export const FEST_CONTEXT: FestContext = {
  tracks: TRACKS,
  speakers: SPEAKERS,
  schedule: SCHEDULE,
  sponsors: SPONSORS,
  faqs: FAQS,
  meta: FEST_META,
  stats: STATS,
}

// ─── Campus Navigation Data ───

export interface CampusVenue {
  id: string
  name: string
  building: string
  coordinates: [number, number]
  type: 'auditorium' | 'expo' | 'seminar' | 'admin' | 'lab' | 'social' | 'entrance'
}

export const CAMPUS_VENUES: Record<string, CampusVenue> = {
  'main-auditorium': {
    id: 'main-auditorium',
    name: 'Main Auditorium (CCA)',
    building: 'CCA Building',
    coordinates: [76.78426071541261, 30.76551511053145],
    type: 'auditorium',
  },
  'expo-hall': {
    id: 'expo-hall',
    name: 'Expo Hall (SPIC Centre)',
    building: 'SPIC Centre',
    coordinates: [76.78585010939216, 30.765833700196882],
    type: 'expo',
  },
  'seminar-hall': {
    id: 'seminar-hall',
    name: 'Seminar Hall (NAB)',
    building: 'NAB Building',
    coordinates: [76.7861161958663, 30.768068775179547],
    type: 'seminar',
  },
  'admin-block': {
    id: 'admin-block',
    name: 'Admin Block (Electrical Dept)',
    building: 'Electrical Engineering Department',
    coordinates: [76.78647612578088, 30.767251839321425],
    type: 'admin',
  },
  'cse-block': {
    id: 'cse-block',
    name: 'CSE & ECE Block (Hackathon Lab)',
    building: 'CSE & ECE Department',
    coordinates: [76.78532031055364, 30.76782763758229],
    type: 'lab',
  },
  'student-center': {
    id: 'student-center',
    name: 'Student Center (PEC Market)',
    building: 'PEC Market Area',
    coordinates: [76.78348530072951, 30.766326667038925],
    type: 'social',
  },
  'main-gate': {
    id: 'main-gate',
    name: 'Main Gate (Gate 1)',
    building: 'Campus Entrance - Gate 1',
    coordinates: [76.78367500421939, 30.763153888145272],
    type: 'entrance',
  },
  // ─── New Summit Activity Venues ───
  'workshop-hall': {
    id: 'workshop-hall',
    name: 'Workshop Hall',
    building: 'CCA Building (Upper Floor)',
    coordinates: [76.7845, 30.7657],
    type: 'seminar',
  },
  'job-fair-zone': {
    id: 'job-fair-zone',
    name: 'Job Fair Zone',
    building: 'Expo Hall (SPIC Centre) - Hall B',
    coordinates: [76.7856, 30.7656],
    type: 'expo',
  },
  'rd-conclave-hall': {
    id: 'rd-conclave-hall',
    name: 'R&D Conclave Hall',
    building: 'NAB Building - Conference Room',
    coordinates: [76.7860, 30.7678],
    type: 'seminar',
  },
  'ipl-auction-room': {
    id: 'ipl-auction-room',
    name: 'IPL Auction Room',
    building: 'CCA Building - Seminar Room',
    coordinates: [76.7843, 30.7653],
    type: 'seminar',
  },
  'ignite-stage': {
    id: 'ignite-stage',
    name: 'Ignite Stage',
    building: 'Main Auditorium (CCA)',
    coordinates: [76.78426071541261, 30.76551511053145],
    type: 'auditorium',
  },
  'treasure-hunt-start': {
    id: 'treasure-hunt-start',
    name: 'Treasure Hunt Start',
    building: 'Student Center (PEC Market)',
    coordinates: [76.78348530072951, 30.766326667038925],
    type: 'social',
  },
  'baazar-zone': {
    id: 'baazar-zone',
    name: 'Baazar Marketplace',
    building: 'PEC Market / Open Grounds',
    coordinates: [76.7837, 30.7661],
    type: 'social',
  },
  'quiz-hall': {
    id: 'quiz-hall',
    name: 'Quiz Hall',
    building: 'Seminar Hall (NAB)',
    coordinates: [76.7861161958663, 30.768068775179547],
    type: 'seminar',
  },
  'funding-conclave-room': {
    id: 'funding-conclave-room',
    name: 'Funding Conclave Room',
    building: 'Admin Block - Meeting Room',
    coordinates: [76.7863, 30.7670],
    type: 'admin',
  },
  'case-competition-room': {
    id: 'case-competition-room',
    name: 'Case Competition Room',
    building: 'CSE & ECE Block - Seminar Room',
    coordinates: [76.7852, 30.7676],
    type: 'lab',
  },
} as const

export interface CampusGraphNode {
  coords: [number, number]
  connections: string[]
}

export const CAMPUS_GRAPH = {
  nodes: {
    'main-gate': { coords: [76.78367500421939, 30.763153888145272], connections: ['main-auditorium', 'student-center', 'cse-block'] },
    'main-auditorium': { coords: [76.78426071541261, 30.76551511053145], connections: ['main-gate', 'expo-hall', 'cse-block', 'admin-block', 'workshop-hall', 'ipl-auction-room'] },
    'expo-hall': { coords: [76.78585010939216, 30.765833700196882], connections: ['main-auditorium', 'cse-block', 'seminar-hall', 'job-fair-zone'] },
    'seminar-hall': { coords: [76.7861161958663, 30.768068775179547], connections: ['expo-hall', 'admin-block', 'cse-block', 'rd-conclave-hall', 'quiz-hall'] },
    'cse-block': { coords: [76.78532031055364, 30.76782763758229], connections: ['main-gate', 'main-auditorium', 'expo-hall', 'seminar-hall', 'admin-block', 'case-competition-room'] },
    'admin-block': { coords: [76.78647612578088, 30.767251839321425], connections: ['main-auditorium', 'cse-block', 'seminar-hall', 'funding-conclave-room'] },
    'student-center': { coords: [76.78348530072951, 30.766326667038925], connections: ['main-gate', 'main-auditorium', 'treasure-hunt-start', 'baazar-zone'] },
    // New venue connections
    'workshop-hall': { coords: [76.7845, 30.7657], connections: ['main-auditorium', 'ipl-auction-room'] },
    'job-fair-zone': { coords: [76.7856, 30.7656], connections: ['expo-hall'] },
    'rd-conclave-hall': { coords: [76.7860, 30.7678], connections: ['seminar-hall', 'admin-block'] },
    'ipl-auction-room': { coords: [76.7843, 30.7653], connections: ['main-auditorium', 'workshop-hall'] },
    'ignite-stage': { coords: [76.78426071541261, 30.76551511053145], connections: ['main-auditorium'] },
    'treasure-hunt-start': { coords: [76.78348530072951, 30.766326667038925], connections: ['student-center', 'baazar-zone'] },
    'baazar-zone': { coords: [76.7837, 30.7661], connections: ['student-center', 'treasure-hunt-start'] },
    'quiz-hall': { coords: [76.7861161958663, 30.768068775179547], connections: ['seminar-hall'] },
    'funding-conclave-room': { coords: [76.7863, 30.7670], connections: ['admin-block'] },
    'case-competition-room': { coords: [76.7852, 30.7676], connections: ['cse-block'] },
  },
  walkingSpeedMps: 1.4,
} as const

export interface DayEventVenue {
  eventId: string
  title: string
  time: string
  venue: keyof typeof CAMPUS_VENUES
  venueName: string
}

export const DAY_EVENT_VENUES = {
  day1: [
    { eventId: 'd1-1', title: 'Registration & Welcome Kit', time: '09:00', venue: 'main-gate', venueName: 'Main Gate' },
    { eventId: 'd1-2', title: 'Inaugural Ceremony & Keynote', time: '10:00', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd1-3', title: 'Panel: Fundraising in a Tough Climate', time: '11:00', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd1-4', title: 'Startup Expo Opens', time: '12:30', venue: 'expo-hall', venueName: 'Expo Hall' },
    { eventId: 'd1-5', title: 'Lunch Break & Networking', time: '13:30', venue: 'student-center', venueName: 'Student Center' },
    { eventId: 'd1-6', title: 'Pitch Competition — Round 1', time: '14:30', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd1-7', title: 'Panel: AI for Startups', time: '16:00', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd1-8', title: 'Hackathon Kickoff + Problem Statement', time: '17:30', venue: 'cse-block', venueName: 'CSE Block' },
    { eventId: 'd1-9', title: 'Speed Networking Session', time: '19:00', venue: 'admin-block', venueName: 'Admin Block' },
    { eventId: 'd1-10', title: 'Dinner & Evening Mixer', time: '20:00', venue: 'student-center', venueName: 'Student Center' },
  ],
  day2: [
    { eventId: 'd2-1', title: 'Hackathon Mid-Check & Mentor Rotations', time: '09:00', venue: 'cse-block', venueName: 'CSE Block' },
    { eventId: 'd2-2', title: 'Panel: Student-to-Founder Playbook', time: '10:00', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd2-3', title: 'Investor Open Hours', time: '11:30', venue: 'admin-block', venueName: 'Admin Block' },
    { eventId: 'd2-4', title: 'Lunch Break', time: '12:30', venue: 'student-center', venueName: 'Student Center' },
    { eventId: 'd2-5', title: 'Hackathon Final Presentations', time: '13:30', venue: 'cse-block', venueName: 'CSE Block' },
    { eventId: 'd2-6', title: 'Pitch Competition — Finals', time: '15:00', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd2-7', title: 'Panel: Deep-Tech in India', time: '16:30', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd2-8', title: 'Awards Ceremony & Prize Distribution', time: '17:30', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd2-9', title: 'Closing Keynote', time: '18:30', venue: 'main-auditorium', venueName: 'Main Auditorium' },
    { eventId: 'd2-10', title: 'Closing Mixer & Farewells', time: '19:30', venue: 'student-center', venueName: 'Student Center' },
  ],
} as const

import type { Feature, Polygon } from 'geojson'

// ... existing code ...

export const CAMPUS_BOUNDARY: Feature<Polygon, { name: string }> = {
  type: 'Feature',
  properties: { name: 'PEC Campus' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [76.78367500421939, 30.763153888145272],  // Gate 1
      [76.78681662724883, 30.764815123201814],  // Gate 2
      [76.7892356773224, 30.76606869191917],    // Gate 3
      [76.78162384683229, 30.765836954550252],  // Vindhya Hostel (south-west)
      [76.78289222147284, 30.76420886285879],   // Kurukshetra Hostel (west)
      [76.78367500421939, 30.763153888145272]   // Back to Gate 1
    ]],
  },
}

export type DayKey = 'day1' | 'day2'
export type VenueId = keyof typeof CAMPUS_VENUES
export type DayEventVenues = typeof DAY_EVENT_VENUES[DayKey]

// Re-export campus graph functions
export { findShortestPath, getVenueCoordinates, getAllVenueCoordinates } from '@/components/EventsNavigation/campusGraph'
