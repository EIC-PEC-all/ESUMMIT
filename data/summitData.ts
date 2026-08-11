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
    title: 'Pitchers Pitch',
    category: 'VC Dealflow Arena',
    eyebrow: 'FLAGSHIP PITCH',
    image: '/gallery/pec_pitch.jpg',
    purpose: 'Direct funding pitch competition connecting top 20 shortlisted startups to VC syndicates.',
    delivery: '5-minute pitch + 3-minute Q&A in front of 15+ Angel Networks and Institutional VCs.',
    expectedParticipation: '150+ Seed & Pre-Seed Applicants',
    tags: ['Seed Capital', 'VC Panel', '₹7.5L Cash Pool', 'Direct Term Sheets'],
    partner: 'Sequoia Surge & Indian Angel Network',
  },
  {
    id: 'ev-3',
    number: '03',
    title: 'Startup Fair & Expo',
    category: 'Exhibition Arena',
    eyebrow: 'PHYSICAL STALLS',
    image: '/gallery/pec_startup_fair.png',
    purpose: 'Physical product exhibition for founders to demo live products to 3,000+ delegates and media.',
    delivery: '2-Day dedicated booth space with high footfall networking and investor walk-throughs.',
    expectedParticipation: '40 Exhibiting Startups',
    tags: ['Live Demos', 'Media Exposure', 'Customer Feedback'],
    partner: 'TiE Chandigarh',
  },
  {
    id: 'ev-4',
    number: '04',
    title: 'Investor Matchmaking Lounge',
    category: 'VIP Networking',
    eyebrow: '1-ON-1 VC SESSIONS',
    image: '/gallery/pec_investor_poster.png',
    purpose: 'Curated 15-minute 1-on-1 speed networking meetings between verified founders and angel investors.',
    delivery: 'Closed-door VIP lounge entry with pre-scheduled investor calendars.',
    expectedParticipation: '30+ Institutional & Angel Investors',
    tags: ['Term Sheets', 'Private Lounge', 'Cap Table Advice'],
    partner: 'Chandigarh Angels Network',
  },
  {
    id: 'ev-5',
    number: '05',
    title: 'Executive Leadership Keynotes',
    category: 'Keynote Arena',
    eyebrow: 'VISIONARY TALKS',
    image: '/gallery/pec_keynote_speaker.png',
    purpose: 'Inspiring keynotes by unicorn founders, corporate executives, and industry visionaries.',
    delivery: 'Main Auditorium keynote speeches followed by audience Q&A.',
    expectedParticipation: '1,500+ Attendees',
    tags: ['Unicorn Founders', 'Leadership', 'Industry Vision'],
    partner: 'PEC Alumni Association',
  },
  {
    id: 'ev-6',
    number: '06',
    title: 'Funding Conclave',
    category: 'Venture Panel',
    eyebrow: 'ANGEL SYNDICATE',
    image: '/gallery/pec_funding_conclave.png',
    purpose: 'High-level panel discussion on early-stage valuation, term sheet pitfalls, and macro VC trends.',
    delivery: 'Interactive Senate Hall roundtable panel with partner VCs.',
    expectedParticipation: '300+ Founders & Investors',
    tags: ['Term Sheets', 'Valuations', 'Macro Trends'],
    partner: 'Morgan Stanley & Peak XV',
  },
  {
    id: 'ev-7',
    number: '07',
    title: 'Product Design Workshop',
    category: 'Industry Workshop',
    eyebrow: 'DEEPTECH PROTOTYPING',
    image: '/gallery/pec_senate_roundtable.png',
    purpose: 'Hands-on masterclass on UI/UX architecture, system design, and rapid MVP prototyping.',
    delivery: '3-Hour intensive hands-on lab workshop with industry leads.',
    expectedParticipation: '200+ Designers & PMs',
    tags: ['Figma', 'System Design', 'MVP Sprint'],
    partner: 'Design Innovation Center',
  },
  {
    id: 'ev-8',
    number: '08',
    title: 'Tech & AI Summit',
    category: 'Deep Tech',
    eyebrow: 'ROBOTICS & GEN-AI',
    image: '/gallery/pec_auditorium.png',
    purpose: 'Exploration of cutting-edge developments in Generative AI, Autonomous Systems, and Deep Tech.',
    delivery: 'Auditorium keynotes, live hardware demos, and panel discussions.',
    expectedParticipation: '800+ Tech Enthusiasts',
    tags: ['Generative AI', 'Robotics', 'DeepTech'],
    partner: 'Siemens Center of Excellence',
  },
  {
    id: 'ev-9',
    number: '09',
    title: 'Women Entrepreneurship Forum',
    category: 'Empowerment',
    eyebrow: 'FEMALE FOUNDERS',
    image: '/gallery/pec_innovation_stage.png',
    purpose: 'Celebrating and empowering female entrepreneurs through keynotes, mentorship, and networking.',
    delivery: 'Felicitation ceremony, fireside chats, and focused mentorship tables.',
    expectedParticipation: '400+ Delegates',
    tags: ['Women In Tech', 'Mentorship', 'Grant Pool'],
    partner: 'Ministry of Education Innovation Cell',
  },
  {
    id: 'ev-10',
    number: '10',
    title: 'Case Competition',
    category: 'Strategy',
    eyebrow: 'BUSINESS CASE CHALLENGE',
    image: '/gallery/pec_senate_hall.png',
    purpose: 'Solve real-world corporate strategy, market expansion, and turnaround business cases.',
    delivery: '2-Round presentation with case solution deck defense before industry judges.',
    expectedParticipation: '80+ Teams',
    tags: ['Market Strategy', 'Problem Solving', '₹1.5L Prize'],
    partner: 'McKinsey & Co. Alumni',
  },
  {
    id: 'ev-11',
    number: '11',
    title: 'Trading & Fintech Simulation',
    category: 'Fintech Simulation',
    eyebrow: 'MOCK STOCK EXCHANGE',
    image: '/gallery/pec_lawn_mosaic.png',
    purpose: 'Real-time simulated stock market trading and algorithmic portfolio management challenge.',
    delivery: 'Live 4-Hour trading simulation platform with dynamic market shocks.',
    expectedParticipation: '350+ Traders',
    tags: ['Stock Market', 'Portfolio Strategy', 'Algorithmic Trading'],
    partner: 'Zerodha Partner Network',
  },
  {
    id: 'ev-12',
    number: '12',
    title: 'Campus Founder League',
    category: 'Inter-College Clash',
    eyebrow: 'INCUBATOR BATTLE',
    image: '/gallery/pec_group.png',
    purpose: 'Inter-college battle showcasing top student ventures from 30+ North Indian engineering colleges.',
    delivery: 'Fast-paced elevator pitches and audience voting rounds.',
    expectedParticipation: '30+ College E-Cells',
    tags: ['Inter-College', 'Elevator Pitch', 'Incubator Support'],
    partner: 'EIC PEC Incubator',
  },
  {
    id: 'ev-13',
    number: '13',
    title: 'E-Summit Gala & Award Night',
    category: 'Grand Ceremony',
    eyebrow: 'FELICITATION NIGHT',
    image: '/gallery/pec_team.png',
    purpose: 'Grand closing ceremony celebrating competition winners, alumni achievements, and partner felicitation.',
    delivery: 'Stage awards, VIP dinner, and networking cocktail night.',
    expectedParticipation: '1,000+ VIP Guests & Delegates',
    tags: ['Awards', 'VIP Gala', 'Felicitation'],
    partner: 'Punjab Engineering College',
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
