// data/summitData.ts
// Master Centralized Single-Source-Of-Truth Data Repository for PEC E-Summit 2026

export interface Speaker {
  id: string
  name: string
  role: string
  company: string
  badge: string
  category: 'keynote' | 'panelist' | 'investor' | 'mentor'
  initials: string
  image?: string
  bio: string
  track: string
}

export interface EventItem {
  id: string
  number: string
  title: string
  category: string
  eyebrow: string
  image: string
  purpose: string
  delivery: string
  expectedParticipation: string
  tags: string[]
  partner?: string
}

export interface AlumniItem {
  id: string
  name: string
  role: string
  company: string
  batch: string
  achievement: string
  image?: string
}

export interface SponsorItem {
  id: string
  name: string
  tier: 'Title Sponsor' | 'Powered By' | 'Associate Sponsor' | 'Ecosystem Partner'
  logo: string
  category: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'General' | 'Passes' | 'Hackathon' | 'Pitch'
}

export const MASTER_SPEAKERS: Speaker[] = [
  {
    id: 'sp-1',
    name: 'Peyush Bansal',
    role: 'Co-Founder & CEO',
    company: 'Lenskart',
    badge: 'KEYNOTE SPEAKER',
    category: 'keynote',
    initials: 'PB',
    bio: 'Peyush Bansal revolutionized D2C eyewear retail across Asia and has backed 50+ early-stage tech startups.',
    track: 'D2C & Retail Innovation',
  },
  {
    id: 'sp-2',
    name: 'Anupam Mittal',
    role: 'Founder & CEO',
    company: 'People Group (Shaadi.com)',
    badge: 'SHARK INVESTOR',
    category: 'investor',
    initials: 'AM',
    bio: 'Pioneer of consumer internet platforms in India and active angel investor in over 200+ technology companies.',
    track: 'Angel Syndicates & VC Scaling',
  },
  {
    id: 'sp-3',
    name: 'Dr. Ritesh Malik',
    role: 'Founder',
    company: 'Innov8 Coworking',
    badge: 'STARTUP MENTOR',
    category: 'mentor',
    initials: 'RM',
    bio: 'Doctor turned entrepreneur and ecosystem builder focused on prop-tech and healthcare innovation.',
    track: 'Zero to One Scaling',
  },
  {
    id: 'sp-4',
    name: 'Gajendra Jangid',
    role: 'Co-Founder & CMO',
    company: 'CAR24',
    badge: 'PANELIST',
    category: 'panelist',
    initials: 'GJ',
    bio: 'PEC Alumnus scaling auto-tech logistics across international markets.',
    track: 'Growth Strategy & Execution',
  },
  {
    id: 'sp-5',
    name: 'Upasana Taku',
    role: 'Co-Founder & COO',
    company: 'MobiKwik',
    badge: 'FINTECH KEYNOTE',
    category: 'keynote',
    initials: 'UT',
    bio: 'Fintech pioneer leading digital payments infrastructure and financial inclusion for millions.',
    track: 'Fintech Infrastructure',
  },
  {
    id: 'sp-6',
    name: 'Kunwar Sachdev',
    role: 'Founder',
    company: 'Su-Kam Power Systems',
    badge: 'HARDWARE MENTOR',
    category: 'mentor',
    initials: 'KS',
    bio: 'Solar energy and hardware manufacturing pioneer in North India.',
    track: 'Hardware & CleanTech Manufacturing',
  },
]

export const MASTER_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    number: '01',
    title: 'E-Summit Hackathon',
    category: 'Developer Arena',
    eyebrow: '24-HOUR CODEATHON',
    image: '/gallery/pec_pitch_table.png',
    purpose: 'Build production-ready AI, Fintech, and Open Source prototypes overnight with cloud mentor support.',
    delivery: '24-Hour continuous dev sprint, live API mentor checkpoints, and final jury demo pitch.',
    expectedParticipation: '500+ Hackers across 120 Teams',
    tags: ['AI & ML', 'Web3', 'Cloud API', '₹5.0L Cash Pool'],
    partner: 'Google Cloud & GitHub',
  },
  {
    id: 'ev-2',
    number: '02',
    title: 'Internship & Job Fair',
    category: 'Career Fair',
    eyebrow: 'RECRUITMENT PLATFORM',
    image: '/gallery/pec_startup_fair.png',
    purpose: 'Direct talent recruitment connect bridging high-growth tech startups with top PEC engineering talent.',
    delivery: 'On-spot resume screening, technical interviews, and immediate offer letters.',
    expectedParticipation: '800+ Applicants across 35+ Companies',
    tags: ['Job Offers', 'Paid Internships', 'Direct Hiring'],
    partner: 'PEC Training & Placement Cell',
  },
  {
    id: 'ev-3',
    number: '03',
    title: 'R&D Conclave',
    category: 'Deep Tech Research',
    eyebrow: 'RESEARCH INTERFACE',
    image: '/gallery/pec_senate_roundtable.png',
    purpose: 'Showcasing commercializable research patents, hardware innovations, and lab prototypes to VCs.',
    delivery: 'Interactive poster presentations, prototype demos, and tech transfer roundtables.',
    expectedParticipation: '40+ Research Projects',
    tags: ['Patents', 'Deep Tech', 'Tech Transfer'],
    partner: 'PEC Research & Consultation Wing',
  },
  {
    id: 'ev-4',
    number: '04',
    title: 'IPL Auction Simulation',
    category: 'Financial Strategy',
    eyebrow: 'BIDDING & STRATEGY',
    image: '/gallery/pec_pitch.jpg',
    purpose: 'High-stakes cricket player bidding competition testing valuation skills, purse management, and squad strategy.',
    delivery: 'Live simulated auction hall with real-time bidding rounds and dynamic player rating algorithms.',
    expectedParticipation: '60+ Bidding Squads',
    tags: ['Live Auction', 'Purse Strategy', '₹1.0L Prize'],
    partner: 'PEC Sports & Finance Club',
  },
  {
    id: 'ev-5',
    number: '05',
    title: 'Ignite Pitch Stage',
    category: 'Pitch Arena',
    eyebrow: 'HIGH-ENERGY STAGE',
    image: '/gallery/pec_innovation_stage.png',
    purpose: 'Rapid 3-minute elevator pitch competition for early-stage student concepts and seed ideas.',
    delivery: '3-minute pitch + 2-minute instant feedback from angel investors.',
    expectedParticipation: '100+ Early Concepts',
    tags: ['Elevator Pitch', 'Angel Feedback', 'Grant Pool'],
    partner: 'Chandigarh Angels Network',
  },
  {
    id: 'ev-6',
    number: '06',
    title: 'Campus Treasure Hunt',
    category: 'Interactive Quest',
    eyebrow: 'CAMPUS QUEST',
    image: '/gallery/pec_lawn_mosaic.png',
    purpose: 'Campus-wide cryptographic puzzle hunt exploring PEC historical landmarks and hidden startup clues.',
    delivery: 'Geo-tagged mobile web app checkins with multi-stage cryptic clues.',
    expectedParticipation: '600+ Participants',
    tags: ['Cryptic Clues', 'Campus Quest', 'Instant Rewards'],
    partner: 'PEC Student Council',
  },
  {
    id: 'ev-7',
    number: '07',
    title: 'Baazar Campus Market',
    category: 'Campus Stalls',
    eyebrow: 'STUDENT MARKETPLACE',
    image: '/gallery/pec_group.png',
    purpose: 'Vibrant student-run flea market featuring D2C merchandise, food pop-ups, and artisanal stalls.',
    delivery: '2-Day dedicated physical marketplace with high delegate footfall.',
    expectedParticipation: '25+ Student Ventures',
    tags: ['D2C Pop-ups', 'Student Stalls', 'Live Sales'],
    partner: 'E-Cell PEC Community',
  },
  {
    id: 'ev-8',
    number: '08',
    title: 'BizQuiz with SAASC',
    category: 'Business Quiz',
    eyebrow: 'JOINT TRIVIA CHALLENGE',
    image: '/gallery/pec_senate_hall.png',
    purpose: 'Premier business, brand history, and venture capital trivia quiz competition.',
    delivery: 'Buzzer rounds, rapid-fire trivia, and visual brand identification stages.',
    expectedParticipation: '150+ Quiz Teams',
    tags: ['Brand Trivia', 'Venture Quiz', 'Cash Pool'],
    partner: 'SAASC PEC',
  },
  {
    id: 'ev-9',
    number: '09',
    title: 'SAASC Knowledge Quiz',
    category: 'Academic Quiz',
    eyebrow: 'KNOWLEDGE ARENA',
    image: '/gallery/pec_auditorium.png',
    purpose: 'Inter-college general awareness, macro-economics, and tech policy knowledge challenge.',
    delivery: 'Multi-tier written prelims followed by live stage final rounds.',
    expectedParticipation: '200+ Competitors',
    tags: ['General Knowledge', 'Policy', 'Trophies'],
    partner: 'SAASC PEC',
  },
  {
    id: 'ev-10',
    number: '10',
    title: 'Campus Ambassador Net',
    category: 'Outreach Network',
    eyebrow: 'LEADERSHIP PROGRAMME',
    image: '/gallery/pec_team.png',
    purpose: 'Pan-India student ambassador network driving outreach, registrations, and summit promotion across 50+ colleges.',
    delivery: 'Leadership orientation, weekly leaderboard sprints, and VIP summit passes.',
    expectedParticipation: '150+ Campus Ambassadors',
    tags: ['Leadership', 'Networking', 'Certificates'],
    partner: 'E-Cell PEC Outreach Wing',
  },
  {
    id: 'ev-11',
    number: '11',
    title: 'Expert Speaker Sessions',
    category: 'Keynotes',
    eyebrow: 'THOUGHT LEADERSHIP',
    image: '/gallery/pec_keynote_speaker.png',
    purpose: 'Visionary keynotes and fireside chats with unicorn founders, CXOs, and top industry leaders.',
    delivery: 'Main Auditorium keynotes followed by interactive audience Q&A sessions.',
    expectedParticipation: '1,500+ Attendees',
    tags: ['Unicorn Founders', 'Fireside Chats', 'Q&A'],
    partner: 'PEC Alumni Association',
  },
  {
    id: 'ev-12',
    number: '12',
    title: 'Funding Conclave (TTM)',
    category: 'VC Dealflow',
    eyebrow: 'INVESTOR DEALROOM',
    image: '/gallery/pec_funding_conclave.png',
    purpose: 'Exclusive closed-door dealroom connecting investment-ready startups with top tier VC funds.',
    delivery: 'Private 1-on-1 term sheet discussions and cap table strategy reviews.',
    expectedParticipation: '20+ Top VCs & Syndicates',
    tags: ['Term Sheets', 'Private Dealroom', 'Cap Table'],
    partner: 'Sequoia Surge & Peak XV',
  },
  {
    id: 'ev-13',
    number: '13',
    title: 'Executive Case Competition',
    category: 'Case Challenge',
    eyebrow: 'STRATEGIC RESOLUTION',
    image: '/gallery/pec_admin_building.jpg',
    purpose: 'Solve real-world corporate strategy, turnaround, and market expansion case studies.',
    delivery: 'Case presentation defense before corporate management consultants.',
    expectedParticipation: '50+ Case Squads',
    tags: ['Strategy', 'Consulting Case', '₹1.5L Pool'],
    partner: 'McKinsey & Co. Alumni Network',
  },
]

export const MASTER_ALUMNI: AlumniItem[] = [
  {
    id: 'al-1',
    name: 'Gajendra Jangid',
    role: 'Co-Founder & CMO',
    company: 'CARS24',
    batch: 'Batch of 2005',
    achievement: 'Scaled CARS24 to a $3.3B+ valuation unicorn across 4 countries.',
  },
  {
    id: 'al-2',
    name: 'Padmasree Warrior',
    role: 'Founder & CEO',
    company: 'Fable',
    batch: 'Batch of 1982',
    achievement: 'Former CTO of Cisco & Motorola; Board member at Microsoft and Spotify.',
  },
  {
    id: 'al-3',
    name: 'Steve Sanghi',
    role: 'Executive Chairman',
    company: 'Microchip Technology',
    batch: 'Batch of 1975',
    achievement: 'Led Microchip Technology from early stage to a $40B+ Nasdaq semiconductor giant.',
  },
]

export const MASTER_SPONSORS: SponsorItem[] = [
  {
    id: 'sp-1',
    name: 'Google Cloud',
    tier: 'Title Sponsor',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    category: 'Cloud Infrastructure',
  },
  {
    id: 'sp-2',
    name: 'GitHub',
    tier: 'Powered By',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Logo.png',
    category: 'Developer Ecosystem',
  },
  {
    id: 'sp-3',
    name: 'Razorpay',
    tier: 'Associate Sponsor',
    logo: 'https://razorpay.com/assets/razorpay-glyph.svg',
    category: 'Fintech Infrastructure',
  },
]

export const MASTER_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who can attend PEC E-Summit 2026?',
    answer: 'E-Summit is open to student founders, developers, creators, aspiring entrepreneurs, and industry professionals from across India.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'Are registration passes free?',
    answer: 'General Student Delegate Passes and Campus Ambassador Passes are 100% FREE. Specialized passes like Startup Founder & Hackathon passes have small entry fees for prize pools.',
    category: 'Passes',
  },
  {
    id: 'faq-3',
    question: 'How do I check in at the venue on March 15-16?',
    answer: 'Once you register, your digital E-Badge with a unique QR code is generated instantly. Show your digital badge on your phone at PEC gate entry for volunteer scanning.',
    category: 'Passes',
  },
  {
    id: 'faq-4',
    question: 'What are the cash prizes for competitions?',
    answer: 'The Pitchers Pitch competition features a total prize pool of ₹7.5 Lakhs in non-dilutive equity grants. The 24-Hour Hackathon features a prize pool of ₹5.0 Lakhs.',
    category: 'Pitch',
  },
  {
    id: 'faq-6',
    question: 'Are accommodation options available for outstation participants?',
    answer: 'Yes, subsidized hostel accommodation and campus guest house rooms are allocated on a first-come, first-served basis upon presentation of an active E-Summit registration pass.',
    category: 'General',
  },
]

export const MASTER_CONTACTS = {
  faculty: [
    { role: 'Faculty Coordinator', name: 'Dr. Simranjit Singh', phone: '+91 98725 52898' },
    { role: 'Faculty Co-coordinator', name: 'Dr. Sudesh Rani', phone: '+91 98768 60085' },
  ],
  studentLeadership: [
    { role: 'Student Convener', name: 'Simarpreet Kaur', phone: '+91 84271 46574' },
    { role: 'Student Co-convener', name: 'Shubham Mangal', phone: '+91 78349 75811' },
    { role: 'Student Co-convener', name: 'Vedansh Singh', phone: '+91 88268 73264' },
    { role: 'Marketing Head', name: 'Japneet Pathania', phone: '+91 85449 18700' },
  ],
  location: 'Entrepreneurship & Incubation Cell - Incubator (Near Siemens Lab), Punjab Engineering College, Sector-12 (160012), Chandigarh',
  emails: ['eicpec@pec.edu.in', 'esummitpr.pec@gmail.com'],
}
