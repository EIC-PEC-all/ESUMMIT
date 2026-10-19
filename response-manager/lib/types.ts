export type ApplicationStatus =
  | 'PENDING_REVIEW'
  | 'SHORTLISTED'
  | 'PAYMENT_CONFIRMED'
  | 'REJECTED'

// Discriminated union type so we know which form type this came from
export type PassCategory = 'student' | 'startup'

export interface Registration {
  _id?: string
  applicationId: string
  category: PassCategory

  // Common fields (both forms)
  fullName: string
  email: string
  phone: string
  linkedin?: string
  motive?: string

  // Student pass fields
  college?: string
  state?: string
  city?: string
  courseYear?: string

  // Startup pass fields
  organization?: string
  role?: string

  // Pass metadata
  passTier?: string
  passTierName?: string
  passPrice?: string
  paymentMethod?: string

  // Status & admin
  status: ApplicationStatus
  reviewNotes?: string
  createdAt: string
  updatedAt: string
}

// Legacy alias used across the portal — maps to Registration
export type FundingApplication = Registration

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
  paymentStatus?: string
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
