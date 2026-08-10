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

export interface CampusVenue {
  id: string
  name: string
  shortName: string
  code: string
  lat: number
  lng: number
  x: number
  y: number
  description: string
  color: string
  points: [number, number][]
  turns: string[]
}

export const CAMPUS_VENUES: Record<string, CampusVenue> = {
  entry: {
    id: 'entry',
    name: 'PEC Main Entry Gate 1',
    shortName: 'Main Gate 1',
    code: 'GATE-01',
    lat: 30.7688,
    lng: 76.7865,
    x: 120,
    y: 520,
    description: 'Main Campus Entrance from Sector 12 Main Road',
    color: '#059669',
    points: [[120, 520]],
    turns: ['You are at Main Gate 1.'],
  },
  auditorium: {
    id: 'auditorium',
    name: 'PEC Main Auditorium',
    shortName: 'Main Auditorium',
    code: 'AUD-101',
    lat: 30.7675,
    lng: 76.7878,
    x: 320,
    y: 360,
    description: 'Primary stage for keynotes, inaugurals, and pitch finals',
    color: '#0284C7',
    points: [
      [120, 520],
      [120, 360],
      [320, 360],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Right onto Auditorium Way',
      'Arrive at PEC Main Auditorium',
    ],
  },
  senate: {
    id: 'senate',
    name: 'PEC Senate Hall',
    shortName: 'Senate Hall',
    code: 'SNT-202',
    lat: 30.7670,
    lng: 76.7872,
    x: 520,
    y: 260,
    description: 'Executive conference hall for panels & leader keynotes',
    color: '#D97706',
    points: [
      [120, 520],
      [120, 260],
      [520, 260],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Right onto Senate Boulevard',
      'Arrive at Senate Hall',
    ],
  },
  expo_lawns: {
    id: 'expo_lawns',
    name: 'Central Library Lawns',
    shortName: 'Library Lawns',
    code: 'LIB-EXPO',
    lat: 30.7668,
    lng: 76.7885,
    x: 380,
    y: 160,
    description: 'Open air arena for 30+ startup expo booths & showcases',
    color: '#DC2626',
    points: [
      [120, 520],
      [120, 360],
      [380, 360],
      [380, 160],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Right onto Central Avenue',
      'Turn 2: Turn Left onto Library Walk',
      'Arrive at Startup Expo Booths',
    ],
  },
  student_center: {
    id: 'student_center',
    name: 'PEC Student Center',
    shortName: 'Student Center',
    code: 'STC-MAIN',
    lat: 30.7678,
    lng: 76.7880,
    x: 640,
    y: 440,
    description: 'Central hub for dining, networking lunch & social mixers',
    color: '#059669',
    points: [
      [120, 520],
      [640, 520],
      [640, 440],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Left onto Student Center Road',
      'Arrive at Student Center',
    ],
  },
  siemens_coe: {
    id: 'siemens_coe',
    name: 'Siemens Center of Excellence',
    shortName: 'Siemens CoE',
    code: 'SIEM-304',
    lat: 30.7682,
    lng: 76.7890,
    x: 720,
    y: 160,
    description: '24-hour computing lab & hackathon headquarters',
    color: '#7C3AED',
    points: [
      [120, 520],
      [120, 160],
      [720, 160],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Right onto North Campus Drive',
      'Arrive at Siemens CoE Hackathon Labs',
    ],
  },
  oat: {
    id: 'oat',
    name: 'PEC Open Air Theatre',
    shortName: 'OAT Arena',
    code: 'OAT-STAGE',
    lat: 30.7662,
    lng: 76.7875,
    x: 540,
    y: 480,
    description: 'Amphitheatre for speed networking & community sessions',
    color: '#D97706',
    points: [
      [120, 520],
      [540, 520],
      [540, 480],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Left onto OAT Amphitheatre Way',
      'Arrive at Open Air Theatre',
    ],
  },
  exec_lounge: {
    id: 'exec_lounge',
    name: 'PEC Executive Lounge',
    shortName: 'VIP Lounge',
    code: 'VIP-001',
    lat: 30.7672,
    lng: 76.7868,
    x: 340,
    y: 480,
    description: 'Private slots for investor matchmaking & 1-on-1 hours',
    color: '#0284C7',
    points: [
      [120, 520],
      [120, 480],
      [340, 480],
    ],
    turns: [
      'Start at Main Gate 1',
      'Turn 1: Turn Right into VIP Complex',
      'Arrive at Executive Lounge',
    ],
  },
}

export const SCHEDULE = {
  day1: {
    label: 'Day 1',
    date: 'March 15, 2026',
    events: [
      {
        id: 'd1-1',
        time: '09:00 - 10:00',
        title: 'Registration & Welcome Kit',
        type: 'logistics',
        track: null,
        venueId: 'entry',
        venueName: 'PEC Main Entry Gate Plaza',
        distance: '0m',
        walkTime: '0 min',
      },
      {
        id: 'd1-2',
        time: '10:00 - 11:00',
        title: 'Inaugural Ceremony & Keynote',
        type: 'keynote',
        track: null,
        venueId: 'auditorium',
        venueName: 'PEC Main Auditorium',
        distance: '250m',
        walkTime: '3 min',
      },
      {
        id: 'd1-3',
        time: '11:00 - 12:30',
        title: 'Panel: Fundraising in a Tough Climate',
        type: 'panel',
        track: 'panels',
        venueId: 'senate',
        venueName: 'PEC Senate Hall',
        distance: '380m',
        walkTime: '5 min',
      },
      {
        id: 'd1-4',
        time: '12:30 - 13:30',
        title: 'Startup Expo Opens',
        type: 'expo',
        track: 'expo',
        venueId: 'expo_lawns',
        venueName: 'Central Library Lawns',
        distance: '320m',
        walkTime: '4 min',
      },
      {
        id: 'd1-5',
        time: '13:30 - 14:30',
        title: 'Lunch Break & Networking',
        type: 'break',
        track: null,
        venueId: 'student_center',
        venueName: 'PEC Student Center',
        distance: '450m',
        walkTime: '6 min',
      },
      {
        id: 'd1-6',
        time: '14:30 - 16:00',
        title: 'Pitch Competition — Round 1',
        type: 'competition',
        track: 'pitch',
        venueId: 'auditorium',
        venueName: 'PEC Main Auditorium',
        distance: '250m',
        walkTime: '3 min',
      },
      {
        id: 'd1-7',
        time: '16:00 - 17:30',
        title: 'Panel: AI for Startups',
        type: 'panel',
        track: 'panels',
        venueId: 'senate',
        venueName: 'PEC Senate Hall',
        distance: '380m',
        walkTime: '5 min',
      },
      {
        id: 'd1-8',
        time: '17:30 - 19:00',
        title: 'Hackathon Kickoff + Problem Reveal',
        type: 'hackathon',
        track: 'hackathon',
        venueId: 'siemens_coe',
        venueName: 'Siemens Center of Excellence',
        distance: '520m',
        walkTime: '7 min',
      },
      {
        id: 'd1-9',
        time: '19:00 - 20:00',
        title: 'Speed Networking Session',
        type: 'networking',
        track: 'networking',
        venueId: 'oat',
        venueName: 'PEC Open Air Theatre',
        distance: '400m',
        walkTime: '5 min',
      },
      {
        id: 'd1-10',
        time: '20:00 - 21:30',
        title: 'Dinner & Evening Mixer',
        type: 'social',
        track: null,
        venueId: 'student_center',
        venueName: 'PEC Student Center',
        distance: '450m',
        walkTime: '6 min',
      },
    ],
  },
  day2: {
    label: 'Day 2',
    date: 'March 16, 2026',
    events: [
      {
        id: 'd2-1',
        time: '09:00 - 10:00',
        title: 'Hackathon Mid-Check & Mentoring',
        type: 'hackathon',
        track: 'hackathon',
        venueId: 'siemens_coe',
        venueName: 'Siemens Center of Excellence',
        distance: '520m',
        walkTime: '7 min',
      },
      {
        id: 'd2-2',
        time: '10:00 - 11:30',
        title: 'Panel: Student-to-Founder Playbook',
        type: 'panel',
        track: 'panels',
        venueId: 'senate',
        venueName: 'PEC Senate Hall',
        distance: '380m',
        walkTime: '5 min',
      },
      {
        id: 'd2-3',
        time: '11:30 - 12:30',
        title: 'Investor Open Hours',
        type: 'networking',
        track: 'networking',
        venueId: 'exec_lounge',
        venueName: 'PEC Executive Lounge',
        distance: '300m',
        walkTime: '4 min',
      },
      {
        id: 'd2-4',
        time: '12:30 - 13:30',
        title: 'Lunch Break & Exhibition',
        type: 'break',
        track: null,
        venueId: 'student_center',
        venueName: 'PEC Student Center',
        distance: '450m',
        walkTime: '6 min',
      },
      {
        id: 'd2-5',
        time: '13:30 - 15:00',
        title: 'Hackathon Final Presentations',
        type: 'hackathon',
        track: 'hackathon',
        venueId: 'siemens_coe',
        venueName: 'Siemens Center of Excellence',
        distance: '520m',
        walkTime: '7 min',
      },
      {
        id: 'd2-6',
        time: '15:00 - 16:30',
        title: 'Pitch Competition — Finals',
        type: 'competition',
        track: 'pitch',
        venueId: 'auditorium',
        venueName: 'PEC Main Auditorium',
        distance: '250m',
        walkTime: '3 min',
      },
      {
        id: 'd2-7',
        time: '16:30 - 17:30',
        title: 'Panel: Deep-Tech in India',
        type: 'panel',
        track: 'panels',
        venueId: 'senate',
        venueName: 'PEC Senate Hall',
        distance: '380m',
        walkTime: '5 min',
      },
      {
        id: 'd2-8',
        time: '17:30 - 18:30',
        title: 'Awards Ceremony & Prize Distribution',
        type: 'keynote',
        track: null,
        venueId: 'auditorium',
        venueName: 'PEC Main Auditorium',
        distance: '250m',
        walkTime: '3 min',
      },
      {
        id: 'd2-9',
        time: '18:30 - 19:30',
        title: 'Closing Keynote',
        type: 'keynote',
        track: null,
        venueId: 'auditorium',
        venueName: 'PEC Main Auditorium',
        distance: '250m',
        walkTime: '3 min',
      },
      {
        id: 'd2-10',
        time: '19:30 - 21:00',
        title: 'Closing Mixer & Farewells',
        type: 'social',
        track: null,
        venueId: 'student_center',
        venueName: 'PEC Student Center',
        distance: '450m',
        walkTime: '6 min',
      },
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
