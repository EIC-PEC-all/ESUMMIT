// components/EventPortfolio/data.ts
// Event Portfolio Activity Schedule & Proposal Data for PEC E-Summit '26

export interface PortfolioEvent {
  id: string
  number: string
  title: string
  shortTitle: string
  eyebrow: string
  category: string
  accentColor: string
  glowColor: string
  purpose: string
  delivery: string
  expectedParticipation: string
  badge: string
  tags: string[]
  partner?: string
  iconName: string
  gradientStyle: string
  image: string
}

export const PORTFOLIO_EVENTS: PortfolioEvent[] = [
  {
    id: 'corporate-workshops',
    number: '01',
    title: 'Corporate Workshops',
    shortTitle: 'Workshops',
    eyebrow: 'SKILL & CAPABILITY HUB',
    category: 'Industry Workshop',
    accentColor: '#7ED321',
    glowColor: 'rgba(126, 211, 33, 0.3)',
    purpose:
      'Delivered entirely in collaboration with confirmed corporate, institutional or knowledge partners (including Google, Wadhwani Foundation, and industry bodies). Provides practical exposure to entrepreneurship, technology, innovation, and employability.',
    delivery:
      'Theme, facilitator profile, duration, delivery mode, eligibility, and participant capacity jointly finalised with confirmed partners.',
    expectedParticipation: 'Subject to partner & venue capacity',
    badge: 'Sponsor Partnered',
    tags: ['Google', 'Wadhwani Foundation', 'Tech Exposure', 'Employability'],
    partner: 'Google & Wadhwani Foundation',
    iconName: 'Laptop',
    gradientStyle: 'from-[#7ED321]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'internship-job-fair',
    number: '02',
    title: 'Internship & Job Fair',
    shortTitle: 'Job Fair',
    eyebrow: 'RECRUITMENT PLATFORM',
    category: 'Talent & Hiring',
    accentColor: '#3DD9FF',
    glowColor: 'rgba(61, 217, 255, 0.3)',
    purpose:
      'A structured recruitment platform connecting startups and participating corporate organisations with students for internships, project-based engagements, and full-time employment roles.',
    delivery:
      'Organisational showcases, role briefings, resume screening, shortlisting, interviews, and speed networking interactions.',
    expectedParticipation: 'Finalised post recruiter confirmation',
    badge: 'Direct Hiring',
    tags: ['Startups', 'Placement', 'Internships', 'Career Access'],
    partner: 'Top Startup Recruiters',
    iconName: 'Briefcase',
    gradientStyle: 'from-[#3DD9FF]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rd-conclave',
    number: '03',
    title: 'R&D Conclave',
    shortTitle: 'R&D Conclave',
    eyebrow: 'RESEARCH INTERFACE',
    category: 'Deep Tech & Research',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    purpose:
      'Connects student innovators, faculty members, and researchers with industry leaders. Participants present research papers, technical prototypes, and technology concepts for structured validation.',
    delivery:
      'Research paper presentations, poster and prototype demonstrations, expert review panels, commercialisation pathways, and 1-on-1 industry interactions.',
    expectedParticipation: 'Finalised after call for papers',
    badge: 'Patent & Commercialisation',
    tags: ['Prototypes', 'Faculty Research', 'Industry Validation', 'IP Rights'],
    partner: 'PEC R&D Cell & Industry Partners',
    iconName: 'Microscope',
    gradientStyle: 'from-[#A855F7]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ipl-auction',
    number: '04',
    title: 'IPL Auction Simulation',
    shortTitle: 'IPL Auction',
    eyebrow: 'BIDDING & STRATEGY',
    category: 'Strategy Competition',
    accentColor: '#FF4D3D',
    glowColor: 'rgba(255, 77, 61, 0.3)',
    purpose:
      'A simulation-based team strategy and bidding competition inspired by professional cricket auction formats. Designed to test analytical thinking, squad balance, negotiation, and financial budget planning.',
    delivery:
      'Teams operate within a defined virtual purse budget, evaluate player profiles, and bid under pre-announced squad composition constraints.',
    expectedParticipation: 'Finalised post format approval',
    badge: 'Virtual Purse Gaming',
    tags: ['Valuation', 'Negotiation', 'Financial Strategy', 'Sports Analytics'],
    iconName: 'Gavel',
    gradientStyle: 'from-[#FF4D3D]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ignite',
    number: '05',
    title: 'Ignite Pitch Stage',
    shortTitle: 'Ignite',
    eyebrow: 'HIGH-ENERGY STAGE',
    category: 'Innovation Showcase',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    purpose:
      'A high-energy platform for showcasing innovative ideas, entrepreneurial thinking, and emerging student talent. Encourages original concepts with rapid clarity of thought.',
    delivery:
      'Rapid pitch rounds, thematic challenges, product demonstrations, and curated presentations evaluated by an expert jury.',
    expectedParticipation: 'Open Registration',
    badge: 'Rapid Pitches',
    tags: ['Pitch Deck', 'Creativity', 'Spotlight Stage', 'Fast-Track Ideas'],
    iconName: 'Zap',
    gradientStyle: 'from-[#F59E0B]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'treasure-hunt',
    number: '06',
    title: 'Campus Treasure Hunt',
    shortTitle: 'Treasure Hunt',
    eyebrow: 'CAMPUS QUEST',
    category: 'Team Exploration',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    purpose:
      'An interactive team-based activity designed to promote logical reasoning, clue-solving, collaboration, observation, and time management across designated campus zones.',
    delivery:
      'Curated route with checkpoints, timed clue-solving challenges, and safe navigation across authorized campus areas.',
    expectedParticipation: 'Finalised after route approval',
    badge: 'Campus Adventure',
    tags: ['Logic Puzzles', 'Navigation', 'Teamwork', 'Speed Run'],
    iconName: 'Compass',
    gradientStyle: 'from-[#10B981]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'baazar',
    number: '07',
    title: 'Baazar Campus Market',
    shortTitle: 'Baazar',
    eyebrow: 'STUDENT MARKETPLACE',
    category: 'Venture Exhibition',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    purpose:
      'A campus marketplace for student-led ventures, merchandise, services, culinary concepts, and creative crafts. Offers real-world exposure to sales, pricing, customer engagement, and inventory.',
    delivery:
      'Stall allocations, commercial pop-ups, product showcases, hygiene/safety guidelines, and direct customer interactions.',
    expectedParticipation: 'Stall capacity & footfall limit',
    badge: 'Live Commerce',
    tags: ['Student Ventures', 'Food & Crafts', 'Sales Experience', 'Pop-Up Stalls'],
    iconName: 'ShoppingBag',
    gradientStyle: 'from-[#EC4899]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bizquiz-saasc',
    number: '08',
    title: 'BizQuiz with SAASC',
    shortTitle: 'BizQuiz',
    eyebrow: 'JOINT TRIVIA CHALLENGE',
    category: 'Business Quiz',
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    purpose:
      'Organised jointly with SAASC to assess knowledge of business history, entrepreneurship, market trends, global economics, iconic brands, and contemporary corporate developments.',
    delivery:
      'Preliminary written screening round followed by moderated live final stage rounds hosted by quizmasters.',
    expectedParticipation: 'Finalised jointly with SAASC',
    badge: 'SAASC Collaboration',
    tags: ['Corporate History', 'Brands & Ads', 'Economics', 'Live Stage Round'],
    partner: 'SAASC PEC',
    iconName: 'HelpCircle',
    gradientStyle: 'from-[#6366F1]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'additional-quiz-saasc',
    number: '09',
    title: 'SAASC Knowledge Quiz',
    shortTitle: 'SAASC Quiz II',
    eyebrow: 'KNOWLEDGE ARENA',
    category: 'Thematic Quiz',
    accentColor: '#3B82F6',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    purpose:
      'A second knowledge-based competitive quiz conducted in collaboration with SAASC on a mutually approved theme, broadening student engagement across diverse domains.',
    delivery:
      'Curated question bank, multi-tier testing rounds, rapid buzzer segments, and team-based evaluation.',
    expectedParticipation: 'Finalised jointly with SAASC',
    badge: 'Thematic Knowledge',
    tags: ['Tech & Future', 'General Awareness', 'Buzzer Round', 'Competitive'],
    partner: 'SAASC PEC',
    iconName: 'Brain',
    gradientStyle: 'from-[#3B82F6]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'campus-ambassador',
    number: '10',
    title: 'Campus Ambassador Net',
    shortTitle: 'Ambassadors',
    eyebrow: 'LEADERSHIP PROGRAMME',
    category: 'Student Outreach',
    accentColor: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.3)',
    purpose:
      'Appoints student representatives from premier institutions across North India to support outreach, branding, participant mobilisation, and event coordination within their campuses.',
    delivery:
      'Structured intake, reporting frameworks, performance tracking, leadership mentorship, and official recognition certificates.',
    expectedParticipation: 'Targeted ambassador intake',
    badge: 'Pan-North India',
    tags: ['Student Leaders', 'Outreach', 'Branding', 'Certificate & Perks'],
    iconName: 'Users',
    gradientStyle: 'from-[#14B8A6]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'expert-speakers',
    number: '11',
    title: 'Expert Speaker Sessions',
    shortTitle: 'Keynotes & Fireside',
    eyebrow: 'THOUGHT LEADERSHIP',
    category: 'Keynotes & Panels',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    purpose:
      'Features renowned entrepreneurs, VC partners, CXOs, policy experts, and academicians sharing actionable insights on startup building, technology frontiers, leadership, and scale.',
    delivery:
      'Keynote addresses, moderated panel conversations, fireside chats, and audience Q&A sessions.',
    expectedParticipation: 'Auditorium capacity',
    badge: 'Industry Visionaries',
    tags: ['VC Insights', 'Founder Stories', 'Fireside Chat', 'Live Q&A'],
    iconName: 'Mic',
    gradientStyle: 'from-[#8B5CF6]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'funding-conclave',
    number: '12',
    title: 'Funding Conclave (TTM)',
    shortTitle: 'TTM Conclave',
    eyebrow: 'INVESTOR DEALROOM',
    category: 'Capital & Mentorship',
    accentColor: '#7ED321',
    glowColor: 'rgba(126, 211, 33, 0.4)',
    purpose:
      'Connects shortlisted high-potential startups and founders with seed investors, venture funds, angel networks, and ecosystem mentors for investment evaluation and deal term sheets.',
    delivery:
      'Curated startup pitches, closed-door investor panels, 1-on-1 office hour meetings, and deal networking in collaboration with TTM.',
    expectedParticipation: 'Selected startup founders',
    badge: 'Term Sheets & Angels',
    tags: ['VC Pitching', 'Angel Funding', 'Term Sheets', '1-on-1 Office Hours'],
    partner: 'TTM & Angel Networks',
    iconName: 'TrendingUp',
    gradientStyle: 'from-[#7ED321]/25 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'case-competition',
    number: '13',
    title: 'Executive Case Competition',
    shortTitle: 'Case Study',
    eyebrow: 'STRATEGIC RESOLUTION',
    category: 'Strategy & Analysis',
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    purpose:
      'Requires student teams to dissect a real or simulated complex business challenge and present a structured, evidence-based strategic solution before an expert jury.',
    delivery:
      'Case brief rollout, multi-stage analytical submissions, slide pitch deck presentations, and jury defense rounds.',
    expectedParticipation: 'Team capacity limits',
    badge: 'Strategic Problem Solving',
    tags: ['Business Case', 'Market Analysis', 'Jury Defense', 'Cash Awards'],
    iconName: 'FileText',
    gradientStyle: 'from-[#F43F5E]/20 via-[#0B150E] to-[#0F1A12]',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
  },
]
