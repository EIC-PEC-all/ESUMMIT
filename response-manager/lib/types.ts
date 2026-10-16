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
