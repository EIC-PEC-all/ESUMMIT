export type ApplicationStatus =
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'MOU_SENT'
  | 'MOU_ACCEPTED'
  | 'PAYMENT_CONFIRMED'
  | 'REJECTED'

export interface FundingApplication {
  _id?: string
  applicationId: string
  passTier?: string
  passTierName?: string
  passPrice?: string
  email: string
  founderName: string
  phone: string
  founderLinkedIn: string
  startupName: string
  organization?: string
  role?: string
  motive?: string
  websiteUrl?: string
  dpiitNumber?: string
  stage?: string
  sector?: string
  revenueStage: string
  totalFundingRaised: string
  currentAsk: string
  preMoneyValuation?: string
  committedCapital?: string
  pitchDeckUrl: string
  demoVideoUrl?: string
  mouComfortable: string
  status: ApplicationStatus
  paymentMethod?: string
  reviewNotes?: string
  internalRating?: number
  createdAt: string
  updatedAt: string
}

export interface UserSession {
  _id: string
  userAgent?: string
  ipAddress?: string
  expiresAt: string
  createdAt: string
  isActive: boolean
}

export interface UserRegistrationPass {
  _id: string
  passId: string
  passType: string
  amountPaid: number
  qrToken?: string
  isCheckedIn: boolean
  isRevoked: boolean
  tracks?: string[]
  createdAt: string
}

export interface UserProfile {
  _id: string
  email: string
  name: string
  phone?: string
  college?: string
  gradYear?: string
  city?: string
  state?: string
  district?: string
  role: string
  referralCode?: string
  referredById?: string
  createdAt: string
  updatedAt: string
  // Aggregated session & pass details
  activeSessionsCount: number
  isLoggedIn: boolean
  lastLoginAt?: string
  sessions: UserSession[]
  registrations: UserRegistrationPass[]
}

export interface UsersMetricsStats {
  totalUsers: number
  activeLoggedInUsers: number
  totalActiveSessions: number
  usersWithPasses: number
  totalRegistrations: number
}

