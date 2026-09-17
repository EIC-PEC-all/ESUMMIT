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
  registrationUrl?: string | null
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
  tier: 'Title Sponsor' | 'Powered By' | 'Associate Sponsor' | 'Ecosystem Partner' | 'Previous Sponsor'
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
    name: 'Sandeep Jain',
    role: 'Founder',
    company: 'GeeksforGeeks',
    badge: 'EDTECH PIONEER',
    category: 'keynote',
    initials: 'SJ',
    bio: 'Founder of GeeksforGeeks, one of the world’s largest computer science and coding education platforms empowering millions of engineers.',
    track: 'EdTech & Scaling Tech Platforms',
  },
  {
    id: 'sp-2',
    name: 'Saurabh Munjal',
    role: 'Co-Founder & CEO',
    company: 'Lahori Zeera',
    badge: 'D2C SCALE LEADER',
    category: 'keynote',
    initials: 'SM',
    bio: 'Co-Founder & CEO of Lahori Zeera, revolutionizing traditional beverage distribution across India with multi-crore FMCG distribution.',
    track: 'Consumer Brands & FMCG Scale',
  },
  {
    id: 'sp-3',
    name: 'Aditi Bhutia Madan',
    role: 'Founder',
    company: 'Momo Mami',
    badge: 'SHARK TANK FOUNDER',
    category: 'panelist',
    initials: 'AM',
    bio: 'Shark Tank India featured founder, master chef, and entrepreneur who scaled Momo Mami (BluePine Foods) into a pan-India frozen food brand.',
    track: 'FoodTech & Women Entrepreneurship',
  },
  {
    id: 'sp-4',
    name: 'Sourabh Goyal',
    role: 'Founder',
    company: 'SuccessBrew',
    badge: 'STARTUP ADVISOR',
    category: 'mentor',
    initials: 'SG',
    bio: 'Founder of SuccessBrew, active angel investor and mentor coaching early-stage founders on product-market fit and venture scaling.',
    track: 'Venture Building & Growth',
  },
  {
    id: 'sp-5',
    name: 'Mandeep Kaur Tangra',
    role: 'Founder',
    company: 'SimbaQuartz',
    badge: 'RURAL INNOVATOR',
    category: 'panelist',
    initials: 'MK',
    bio: 'Pioneered IT and technology empowerment in rural Punjab through SimbaQuartz, creating global software jobs in grassroots communities.',
    track: 'Social Impact & Tech Empowerment',
  },
  {
    id: 'sp-6',
    name: 'Aahan Khurma',
    role: 'Co-Founder & CEO',
    company: 'Wellversed',
    badge: 'HEALTH & NUTRITION',
    category: 'panelist',
    initials: 'AK',
    bio: 'Co-Founder & CEO of Wellversed, building Asia’s largest wellness house of brands and nutritional science products.',
    track: 'D2C HealthTech & House of Brands',
  },
  {
    id: 'sp-7',
    name: 'Drishti Kharbanda',
    role: 'Founder',
    company: 'Bake Cosmetics',
    badge: 'BEAUTY & WELLNESS',
    category: 'panelist',
    initials: 'DK',
    bio: 'Founder of Bake Cosmetics, pioneering organic skincare and clean beauty formulations with rapid D2C marketplace growth.',
    track: 'Consumer Goods & Digital Marketing',
  },
  {
    id: 'sp-8',
    name: 'Aseem Ghavri',
    role: 'Co-Founder',
    company: 'Third Unicorn',
    badge: 'TECH OPERATOR',
    category: 'keynote',
    initials: 'AG',
    bio: 'Serial entrepreneur and Co-Founder at Third Unicorn (alongside Ashneer Grover) building disruptive fintech and fantasy tech products.',
    track: 'Fintech & Zero to One Ventures',
  },
  {
    id: 'sp-9',
    name: 'Varun Singla',
    role: 'Founder',
    company: 'Gate Smashers',
    badge: 'TOP EDUCATOR',
    category: 'keynote',
    initials: 'VS',
    bio: 'Founder of Gate Smashers, India’s most popular computer science lecture channel mentoring 1.5M+ engineers across core fundamentals.',
    track: 'Engineering Education & Content Scale',
  },
  {
    id: 'sp-10',
    name: 'Sarvjeet Singh',
    role: 'Founder',
    company: 'Finvasia',
    badge: 'FINTECH TITAN',
    category: 'investor',
    initials: 'SS',
    bio: 'Founder of Finvasia and Shoonya, leading multinational financial conglomerate operating across commission-free trading, banking, and forex.',
    track: 'Global Capital & Algorithmic Trading',
  },
  {
    id: 'sp-11',
    name: 'Paresh Gupta',
    role: 'Founder',
    company: 'CUETPro / GSEC / Brevity',
    badge: 'ECOSYSTEM STRATEGIST',
    category: 'mentor',
    initials: 'PG',
    bio: '4x TEDx Speaker, serial entrepreneur, and mentor shaping incubation ecosystems and national startup strategy.',
    track: 'Startup Valuation & Incubation',
  },
  {
    id: 'sp-12',
    name: 'Sharad Sagar',
    role: 'Founder & CEO',
    company: 'Dexterity Global',
    badge: 'GLOBAL LEADER',
    category: 'keynote',
    initials: 'SS',
    bio: 'Forbes 30 Under 30, Rockefeller Foundation Fellow, and President of Dexterity Global transforming youth leadership across India.',
    track: 'Global Leadership & Public Good',
  },
  {
    id: 'sp-13',
    name: 'Paritosh Anand',
    role: 'Founder',
    company: 'WeSmile / Believe Clothing',
    badge: 'CREATOR ECONOMY',
    category: 'panelist',
    initials: 'PA',
    bio: 'Storyteller, founder of Believe Clothing and WeSmile media, inspiring millions of young creators and digital builders.',
    track: 'Creator Economy & Brand Storytelling',
  },
  {
    id: 'sp-14',
    name: 'Aditya Arora',
    role: 'Android Lead',
    company: 'SAP',
    badge: 'TECH ARCHITECT',
    category: 'panelist',
    initials: 'AA',
    bio: 'Android Lead at SAP, angel investor in 25+ tech startups, and Microsoft Most Valuable Professional (MVP).',
    track: 'Enterprise Tech & Angel Investing',
  },
  {
    id: 'sp-15',
    name: 'Nandu Nandkishore',
    role: 'Former Global CEO',
    company: 'Nestlé Nutrition',
    badge: 'FORTUNE 500 LEADER',
    category: 'keynote',
    initials: 'NN',
    bio: 'Former Executive Board Member at Nestlé S.A. and Global CEO of Nestlé Nutrition, corporate strategist, and investor at London Business School.',
    track: 'Global Scale & Corporate Governance',
  },
  {
    id: 'sp-16',
    name: 'Daksh Sethi',
    role: 'Founder & CEO',
    company: 'Guby Rogers',
    badge: 'YOUTH CATALYST',
    category: 'panelist',
    initials: 'DS',
    bio: 'Founder of Guby Rogers, keynote speaker, and soft skills accelerator empowering students to crack corporate and founder careers.',
    track: 'Personal Branding & Career Velocity',
  },
  {
    id: 'sp-17',
    name: 'Hardik Banga',
    role: 'Co-Founder',
    company: 'Adsworm',
    badge: 'PERFORMANCE MEDIA',
    category: 'mentor',
    initials: 'HB',
    bio: 'Co-Founder of Adsworm, performance marketing strategist and digital media accelerator helping startups scale customer acquisition.',
    track: 'Growth Hacking & Ad Networks',
  },
  {
    id: 'sp-18',
    name: 'Rupinder Singh',
    role: 'Founder',
    company: 'Bio House / Mentor / Investor',
    badge: 'ANGEL INVESTOR',
    category: 'investor',
    initials: 'RS',
    bio: 'Founder of Bio House, seasoned life sciences investor, and startup mentor driving biotechnology and hardware incubation.',
    track: 'BioTech & Seed Stage Deals',
  },
]

export const MASTER_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    number: '01',
    title: 'E-Summit Hackathon',
    category: 'Hackathon',
    eyebrow: '24-HOUR HACKATHON',
    image: '/gallery/pec_pitch_table.png',
    purpose: 'High-energy innovation sprint where ideas turn into working solutions and tech prototypes fast.',
    delivery: '24-Hour continuous sprint, mentor checkpoint reviews, and live product demos before judges.',
    expectedParticipation: '500+ Hackers across 120 Teams',
    tags: ['AI & ML', 'Full-Stack', 'Open Source', '₹5.0L Prize Pool'],
    partner: 'Google Cloud & GitHub',
  },
  {
    id: 'ev-2',
    number: '02',
    title: 'Talent Fair (Internship & Job Fair)',
    category: 'Career Fair',
    eyebrow: 'MEET PEOPLE WHO ARE READY TO BUILD',
    image: '/gallery/pec_startup_fair.png',
    purpose: 'A focused bridge between high-intent students and organisations looking for interns, collaborators, and early-career talent.',
    delivery: 'On-spot resume reviews, technical interviews, and internship/PPO opportunities.',
    expectedParticipation: '800+ Applicants across 35+ Companies',
    tags: ['Startups & Companies', 'Paid Roles', 'Direct Hiring'],
    partner: 'PEC Training & Placement Cell',
  },
  {
    id: 'ev-3',
    number: '03',
    title: 'Funding Conclave',
    category: 'Venture Capital',
    eyebrow: 'CAPITAL, WITHOUT THE THEATRE',
    image: '/gallery/pec_funding_conclave.png',
    purpose: 'A focused environment where promising ventures meet investors, funds, and experienced operators through curated pitching.',
    delivery: 'Curated dealflow, investor context matching, and founder readiness masterclasses.',
    expectedParticipation: '20+ Top VCs & Angel Networks',
    tags: ['Curated Dealflow', 'Investor Context', 'Founder Readiness'],
    partner: 'Finvasia & Chandigarh Angels Network',
  },
  {
    id: 'ev-4',
    number: '04',
    title: 'IPL Auction Strategy Challenge',
    category: 'Strategy & Finance',
    eyebrow: 'REAL-TIME SIMULATION',
    image: '/gallery/pec_pitch.jpg',
    purpose: 'Experience the real-time simulation of IPL Auction, testing budget allocation, player valuation, and live bidding tactics.',
    delivery: 'Live simulated auction hall with real-time bidding rounds and squad optimization metrics.',
    expectedParticipation: '60+ Bidding Squads',
    tags: ['Live Auction', 'Budget Strategy', '₹1.0L Prize'],
    partner: 'PEC Sports & Finance Club',
  },
  {
    id: 'ev-5',
    number: '05',
    title: 'Build & Pitch Competition',
    category: 'Pitch Competition',
    eyebrow: 'BUILD AND PITCH',
    image: '/gallery/pec_innovation_stage.png',
    purpose: 'Build and pitch your brand to investors, raise funds, and receive actionable term-sheet feedback from top VCs.',
    delivery: 'Pitch deck presentation followed by direct investor Q&A and evaluation.',
    expectedParticipation: '100+ Early Concepts',
    tags: ['Brand Pitch', 'Term Sheets', 'Grant Pool'],
    partner: 'Fireside Ventures & Chiratae',
  },
  {
    id: 'ev-6',
    number: '06',
    title: 'E-Bazaar (Startup & Flea Market)',
    category: 'Marketplace',
    eyebrow: 'EXPERIENCE REAL-TIME TRADING',
    image: '/gallery/pec_group.png',
    purpose: 'Experience real-time trading stimulation and live marketplace for student-run D2C brands, products, and pop-ups.',
    delivery: '2-Day dedicated exhibition area with thousands of attendee walk-ins and live sales.',
    expectedParticipation: '25+ Student Ventures',
    tags: ['D2C Pop-ups', 'Student Stalls', 'Live Trading'],
    partner: 'E-Cell PEC Community',
  },
  {
    id: 'ev-7',
    number: '07',
    title: 'Game of Brands & Biz Quiz',
    category: 'Quiz Arena',
    eyebrow: 'INNOVATIVE & ENGAGING TRIVIA',
    image: '/gallery/pec_senate_hall.png',
    purpose: 'Innovative, creative and engaging quiz competition testing business world acumen with lots of brands.',
    delivery: 'Buzzer rounds, rapid-fire trivia, and brand case identification stages.',
    expectedParticipation: '150+ Quiz Teams',
    tags: ['Brand Trivia', 'Venture Quiz', 'Cash Awards'],
    partner: 'SAASC PEC',
  },
  {
    id: 'ev-8',
    number: '08',
    title: 'Startup Expo + Science Fair',
    category: 'Deep Tech & Expo',
    eyebrow: 'BE SEEN BY THE RIGHT PEOPLE',
    image: '/gallery/pec_senate_roundtable.png',
    purpose: 'A live discovery floor for student ventures, emerging startups, research-led ideas, and applied innovation.',
    delivery: 'Demonstrate prototypes, discover collaborators, connect with mentors, and learn direct market feedback.',
    expectedParticipation: '40+ Deep Tech & Research Exhibits',
    tags: ['Demonstrate', 'Discover', 'Connect', 'Learn'],
    partner: 'PEC Research & Consultation Wing',
  },
  {
    id: 'ev-9',
    number: '09',
    title: 'Networking Arena',
    category: 'Networking',
    eyebrow: 'THE RIGHT PEOPLE, IN THE SAME ROOM',
    image: '/gallery/pec_auditorium.png',
    purpose: 'Structured, high-intent encounters across founders, investors, mentors, alumni, recruiters, and ecosystem organisations.',
    delivery: 'Curated introductions matched by stage, open networking spaces, and seamless follow-through.',
    expectedParticipation: '1,000+ Founders & Attendees',
    tags: ['Curated Matchmaking', 'Open Networking', 'Follow-Through'],
    partner: 'CII & Young Indians',
  },
  {
    id: 'ev-10',
    number: '10',
    title: 'Women Founders + Alumni Connect',
    category: 'Community',
    eyebrow: 'COMMUNITIES THAT COMPOUND AMBITION',
    image: '/gallery/pec_team.png',
    purpose: 'Stories, networks, and practical support making founder journeys visible, paired with returning alumni leaders.',
    delivery: 'Keynote panels, closed-door masterminds, and cross-generational mentoring circles.',
    expectedParticipation: '300+ Women Founders & Alumni',
    tags: ['Women in Tech', 'Alumni Mentorship', 'Venture Circles'],
    partner: 'PEC Alumni Association',
  },
  {
    id: 'ev-11',
    number: '11',
    title: 'Campus Treasure Hunt',
    category: 'Fun Activities',
    eyebrow: 'TEAMWORK & EXPLORATION',
    image: '/gallery/pec_lawn_mosaic.png',
    purpose: 'Fun activity combining teamwork, problem-solving, and exploration where participants follow clues across campus to find hidden items.',
    delivery: 'Campus-wide clue checkpoints with live digital leaderboards.',
    expectedParticipation: '600+ Participants',
    tags: ['Team Quest', 'Campus Challenge', 'Exclusive Merch'],
    partner: 'PEC Student Council',
  },
  {
    id: 'ev-12',
    number: '12',
    title: 'Stand-up Comedy & E-Sports Arena',
    category: 'Fun Activities',
    eyebrow: 'WIT, TIMING & COMPETITIVE GAMING',
    image: '/gallery/pec_keynote_speaker.png',
    purpose: 'Live stand-up comedy performance and high-octane E-Sports tournaments in titles like League of Legends and Fortnite.',
    delivery: 'Main auditorium comedy night + dedicated gaming zone tournaments.',
    expectedParticipation: '1,500+ Attendees',
    tags: ['Stand-up Comedy', 'E-Sports Tournaments', 'Entertainment'],
    partner: 'E-Cell Culture & Entertainment Wing',
  },
]

export const MASTER_ALUMNI: AlumniItem[] = [
  {
    id: 'al-1',
    name: 'Kalpana Chawla',
    role: 'Astronaut & Aerospace Pioneer',
    company: 'NASA',
    batch: "PEC '82 (Aeronautical)",
    achievement: 'First woman of Indian origin in space; Global icon of aerospace engineering courage and vision.',
  },
  {
    id: 'al-2',
    name: 'Satish Dhawan',
    role: 'Former Chairman',
    company: 'ISRO',
    batch: "PEC '38 (Mechanical)",
    achievement: 'Father of experimental fluid dynamics research in India; Led ISRO during the transformative satellite launch era.',
  },
  {
    id: 'al-3',
    name: 'Jaspal Bhatti',
    role: 'Iconic Satirist & Film Pioneer',
    company: 'Flop Show & Media Studio',
    batch: "PEC '78 (Electrical)",
    achievement: 'Padma Bhushan Awardee; Legendary creator who redefined television satire and independent media in India.',
  },
  {
    id: 'al-4',
    name: 'Gajendra Jangid',
    role: 'Co-Founder & CMO',
    company: 'CARS24',
    batch: "PEC '05",
    achievement: 'Scaled CARS24 to a $3.3B+ valuation unicorn across 4 countries.',
  },
  {
    id: 'al-5',
    name: 'Padmasree Warrior',
    role: 'Founder & CEO',
    company: 'Fable',
    batch: "PEC '82",
    achievement: 'Former CTO of Cisco & Motorola; Board member at Microsoft and Spotify.',
  },
  {
    id: 'al-6',
    name: 'Steve Sanghi',
    role: 'Executive Chairman',
    company: 'Microchip Technology',
    batch: "PEC '75",
    achievement: 'Led Microchip Technology from early stage to a $40B+ Nasdaq semiconductor giant.',
  },
  {
    id: 'al-7',
    name: 'Kunwar Sachdev',
    role: 'Founder & Innovator',
    company: 'Su-Kam Power Systems',
    batch: "PEC '84",
    achievement: 'Known as the "Solar Man of India"; Revolutionized renewable energy systems across 70+ countries.',
  },
]

export const MASTER_SPONSORS: SponsorItem[] = [
  { id: 'sp-1', name: 'Finvasia', tier: 'Title Sponsor', logo: 'https://cdn.simpleicons.org/f-secure/white', category: 'Fintech & Trading' },
  { id: 'sp-2', name: 'SBI (State Bank of India)', tier: 'Powered By', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/SBI-Logo.svg', category: 'Banking Partner' },
  { id: 'sp-3', name: 'Fireside Ventures', tier: 'Associate Sponsor', logo: 'https://cdn.simpleicons.org/firefoxbrowser/white', category: 'Venture Capital' },
  { id: 'sp-4', name: 'Amar Ujala', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/newsblur/white', category: 'Media Partner' },
  { id: 'sp-5', name: 'CII (Confederation of Indian Industry)', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/civic/white', category: 'Industry Partner' },
  { id: 'sp-6', name: 'uTrade', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/trademarked/white', category: 'Algorithmic Trading' },
  { id: 'sp-7', name: 'Monster Energy', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/monster/white', category: 'Energy Drink Partner' },
  { id: 'sp-8', name: 'Vivo', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/vivo/white', category: 'Smartphone Partner' },
  { id: 'sp-9', name: 'Chiratae Ventures', tier: 'Associate Sponsor', logo: 'https://cdn.simpleicons.org/chartdotjs/white', category: 'Venture Capital' },
  { id: 'sp-10', name: 'Shree Ganesh (South Indian Food)', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/googlehangouts/white', category: 'Food Partner' },
  { id: 'sp-11', name: 'Shoutlo', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/speakerdeck/white', category: 'Local Discovery' },
  { id: 'sp-12', name: 'Young Indians (Yi)', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/youtubekids/white', category: 'Youth Leadership' },
  { id: 'sp-13', name: 'Dainik Bhaskar', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/dailymotion/white', category: 'Print Media' },
  { id: 'sp-14', name: 'CityWoofer', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/woocommerce/white', category: 'Ticketing & Events' },
  { id: 'sp-15', name: 'Venture Wolf', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/wolfram/white', category: 'Startup Accelerator' },
  { id: 'sp-16', name: "Victoria's Cafe", tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/vlcmediaplayer/white', category: 'Hospitality' },
  { id: 'sp-17', name: 'JAL', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/japanairlines/white', category: 'Hydration Partner' },
  { id: 'sp-18', name: 'CITCO', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/cisco/white', category: 'Tourism Partner' },
  { id: 'sp-19', name: 'Smaaash', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/smashdotgg/white', category: 'Gaming & Entertainment' },
  { id: 'sp-20', name: 'Decathlon Play', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/decathlon/white', category: 'Sports & Active' },
  { id: 'sp-21', name: 'Shoonya', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/shazam/white', category: 'Zero-Brokerage Trading' },
  { id: 'sp-22', name: 'Rebel Foods', tier: 'Ecosystem Partner', logo: 'https://cdn.simpleicons.org/foodpanda/white', category: 'Cloud Kitchen Partner' },
]

export const MASTER_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who can attend PEC E-Summit 2026?',
    answer: 'E-Summit 2026 is open to student innovators, developers, creators, early-stage founders, investors, and industry professionals from across India. Join us on 26–27 September 2026 at Punjab Engineering College, Chandigarh.',
    category: 'General',
  },
  {
    id: 'faq-2',
    question: 'Are registration passes free?',
    answer: 'General Student Delegate Passes and Campus Ambassador Passes are 100% FREE. Specific competition tracks like the 24-Hour Hackathon and Build & Pitch may include small delegate confirmation fees for prize pool pools.',
    category: 'Passes',
  },
  {
    id: 'faq-3',
    question: 'How do I check in at the venue on 26–27 September 2026?',
    answer: 'Once registered, your digital E-Badge with a unique cryptographic QR code is generated instantly. Present your digital badge on your smartphone at the PEC Main Gate entry scanners.',
    category: 'Passes',
  },
  {
    id: 'faq-4',
    question: 'What are the cash prizes for competitions?',
    answer: 'Competitions feature major prize pools across tracks, including the 24-Hour Hackathon (₹5.0 Lakhs), Build & Pitch Competition, IPL Auction Strategy, and Biz Quiz.',
    category: 'Pitch',
  },
  {
    id: 'faq-5',
    question: 'Are accommodation options available for outstation participants?',
    answer: 'Yes! Subsidized campus hostel accommodation and guest house allocations are provided on a first-come, first-served basis for confirmed outstation participants with an active E-Summit pass.',
    category: 'General',
  },
]

export const MASTER_STATS = [
  { label: 'Total Footfall', value: 2000, suffix: '+', id: 'footfall', display: '2K+' },
  { label: 'Startups Attended', value: 100, suffix: '+', id: 'startups', display: '100+' },
  { label: 'Workshops Conducted', value: 50, suffix: '+', id: 'workshops', display: '50+' },
  { label: 'Speaker Sessions', value: 30, suffix: '+', id: 'speakers', display: '30+' },
  { label: 'Event Participation', value: 5000, suffix: '+', id: 'participation', display: '5K+' },
  { label: 'Alumni Support', value: 1000, suffix: '+', id: 'alumni', display: '1000+' },
]

export const MASTER_CONTACTS = {
  faculty: [
    { role: 'Coordinator', name: 'Dr. Simranjit Singh', phone: '+91 98725 52898' },
    { role: 'Co-Coordinator', name: 'Dr. Sudesh Rani', phone: '+91 98768 60085' },
  ],
  studentLeadership: [
    { role: 'Convener', name: 'Vansh Gupta', phone: '+91 90413 09108' },
    { role: 'Convener', name: 'Bhrigu Verma', phone: '+91 94783 35331' },
  ],
  location: 'Entrepreneurship & Incubation Cell (EIC), Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh 160012',
  dates: '26–27 September 2026',
  city: 'Chandigarh',
  emails: ['eicpec@pec.edu.in', 'esummitpr.pec@gmail.com'],
}
