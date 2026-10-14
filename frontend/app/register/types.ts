import { GraduationCap, Terminal, Briefcase, Award, Shield, Crown, Gem } from 'lucide-react'

export interface PassTier {
  id: string
  title: string
  category?: 'attendee' | 'startup'
  tagline: string
  desc: string
  fee: number
  feeLabel: string
  badge: string
  defaultEventId?: string
  popular?: boolean
  icon: any
}

export const PASS_TIERS: PassTier[] = [
  {
    id: 'silver',
    title: 'Silver Pass',
    category: 'startup',
    tagline: 'Discovery Tier',
    desc: 'Expo showcase attendance, keynote speaker sessions & delegate kit.',
    fee: 1000,
    feeLabel: '₹1,000 + GST',
    badge: 'STARTUP EXPO',
    icon: Shield,
  },
  {
    id: 'gold',
    title: 'Gold Pass',
    category: 'startup',
    tagline: 'Startup Growth',
    desc: '10-minute stage pitch, investor panel, 2 delegate passes & channel branding.',
    fee: 3500,
    feeLabel: '₹3,500 + GST',
    badge: 'MOST POPULAR',
    popular: true,
    icon: Crown,
  },
  {
    id: 'diamond',
    title: 'Diamond Pass',
    category: 'startup',
    tagline: 'Comprehensive Expo',
    desc: 'Dedicated 10×10 ft stall, on-site PEC hiring desk & VIP investor dinner.',
    fee: 8000,
    feeLabel: '₹8,000 + GST',
    badge: 'VIP STALL',
    icon: Gem,
  },
]


export const INTEREST_TRACKS = [
  'Artificial Intelligence & ML',
  'Fintech & Venture Finance',
  'Pitch Competitions',
  '24-Hour Hackathons',
  'DeepTech & Robotics',
  'Web3 & Cloud Systems',
]

export const EVENT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'pitch', label: 'Pitch & Startups' },
  { id: 'finance', label: 'Finance' },
  { id: 'workshops', label: 'Workshops' },
]

export interface RegistrationFormData {
  name: string
  email: string
  phone: string
  college: string
  teamName: string
}
