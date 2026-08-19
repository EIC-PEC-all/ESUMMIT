// lib/api-types.ts
// Hand-mirrored response shapes from E_Summit_Backend (/api/v1).
// Keep in sync with the NestJS DTOs/services referenced in each comment.

export type Role =
  | 'SUPER_ADMIN'
  | 'ORGANIZER'
  | 'VOLUNTEER_CHECKIN'
  | 'INVESTOR'
  | 'DELEGATE'

export type PassType =
  | 'STUDENT_GENERAL'
  | 'FOUNDER_PITCH'
  | 'HACKATHON_BUILDER'
  | 'CAMPUS_AMBASSADOR'

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

/** auth.service.ts PUBLIC_USER_SELECT */
export interface PublicUser {
  id: string
  email: string
  name: string
  phone: string | null
  college: string | null
  gradYear: string | null
  city: string | null
  role: Role
  referralCode: string | null
  createdAt: string
}

/** POST /auth/login | POST /auth/register */
export interface AuthResponse {
  user: PublicUser
  accessToken: string
}

/** registrations/pass-types.config.ts, spread with a live totalIssued count */
export interface PassCatalogEntry {
  id: string
  enumType: PassType
  title: string
  tagline: string
  feeAmount: number
  feeDisplay: string
  badgeTitle: string
  category: 'student' | 'founder' | 'group' | 'ambassador'
  features: string[]
  popular?: boolean
  totalIssued: number
}

/** registrations.service.ts formatRegistrationResponse() */
export interface FormattedRegistration {
  id: string
  passId: string
  passType: PassType
  categoryTitle: string
  badgeTitle: string
  amountPaid: number
  isCheckedIn: boolean
  tracks: string[]
  qrToken: string
  /** Ready-to-use QR image URL rendered by the backend. */
  qrCodeDataUrl: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    college: string | null
    phone: string | null
  }
  payment: {
    orderId: string
    status: PaymentStatus
    amount: number
  } | null
}

/** POST /registrations/create */
export interface CreateRegistrationDto {
  name: string
  email: string
  phone?: string
  college?: string
  gradYear?: string
  city?: string
  passType: PassType
  tracks?: string[]
  referralCode?: string
}

export interface CreateRegistrationResponse {
  registration: FormattedRegistration
  isPaymentRequired: boolean
  catalogInfo: PassCatalogEntry
}

/** POST /payments/create-order */
export interface CreateOrderResponse {
  orderId: string
  amount: number
  amountInPaisa: number
  currency: string
  passId: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  razorpayKeyId: string
}

/** POST /payments/verify */
export interface VerifyPaymentResponse {
  success: boolean
  message: string
  payment: {
    id: string
    orderId: string
    transactionId: string | null
    amount: number
    currency: string
    status: PaymentStatus
  }
}

/** GET /events */
export interface BackendEvent {
  id: string
  title: string
  type: string
  track: string | null
  day: number
  startTime: string
  endTime: string
  venue: string
  speakerIds: string[]
  createdAt: string
}

/** GET /speakers */
export interface BackendSpeaker {
  id: string
  name: string
  title: string
  bio: string
  track: string
  avatarUrl: string | null
  initials: string
  color: string
}

/** GET /sponsors — flat list; group by `tier` client-side. */
export interface BackendSponsor {
  id: string
  tier: string
  name: string
  logoUrl: string | null
  websiteUrl: string | null
}

/** POST /subscribers */
export interface SubscribeResponse {
  success: boolean
  message: string
}

export type CompetitionType = 'PITCH_COMPETITION' | 'HACKATHON'

export interface TeamMember {
  id: string
  userId: string
  role: string
  user: {
    name: string
    email: string
    college: string | null
  }
}

export interface Submission {
  id: string
  teamId: string
  title: string
  description: string
  repoUrl: string | null
  demoUrl: string | null
  deckPdfUrl: string | null
  submittedAt: string
}

export interface Score {
  id: string
  teamId: string
  judgeId: string
  innovation: number
  execution: number
  marketSize: number
  presentation: number
  comments: string | null
  createdAt: string
  judge?: {
    name: string
    email: string
  }
}

export interface Team {
  id: string
  name: string
  code: string
  type: CompetitionType
  trackName: string
  leaderId: string
  members: TeamMember[]
  submission?: Submission | null
  scores: Score[]
  createdAt: string
  averageScore?: number
  totalScore?: number
}

export interface CreateTeamDto {
  name: string
  type: CompetitionType
  trackName: string
}

export interface JoinTeamDto {
  code: string
}

export interface SubmitProjectDto {
  title: string
  description: string
  repoUrl?: string
  demoUrl?: string
  deckPdfUrl?: string
}

export interface ConciergeChatResponse {
  answer: string
  action?: {
    type: string
    payload: Record<string, any>
  }
  sources?: string[]
}
