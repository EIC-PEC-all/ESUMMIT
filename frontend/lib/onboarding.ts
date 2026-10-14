// lib/onboarding.ts
// Central attendee profile and onboarding state helpers

export interface AttendeeProfile {
  name: string
  email: string
  phone: string
  college: string
  state?: string
  city?: string
  branch?: string
  gradYear: string
  whatsappAlerts?: boolean
  emailAlerts?: boolean
  onboardingCompleted?: boolean
}

export const PROFILE_STORAGE_KEY = 'pec_summit_attendee_profile'
export const PROFILE_UPDATED_EVENT = 'pec_profile_updated'

export const POPULAR_COLLEGES = [
  'Punjab Engineering College (PEC)',
  'IIT Delhi',
  'IIT Roorkee',
  'IIT Ropar',
  'TIET Patiala',
  'UIET Chandigarh',
  'Chitkara University',
] as const

export const GRADUATION_YEARS = [
  { label: '1st Year (Class of 2029)', value: '1st Year (Class of 2029)' },
  { label: '2nd Year (Class of 2028)', value: '2nd Year (Class of 2028)' },
  { label: '3rd Year (Class of 2027)', value: '3rd Year (Class of 2027)' },
  { label: 'Final Year (Class of 2026)', value: 'Final Year (Class of 2026)' },
  { label: 'Postgraduate / Research Scholar', value: 'Postgraduate / Research' },
  { label: 'Alumni / Founder / Working Professional', value: 'Alumni / Founder / Professional' },
  { label: 'Other', value: 'Other' },
] as const

export function normalizeGradYear(val?: string | null): string {
  if (!val) return 'Final Year (Class of 2026)'
  const s = val.trim()
  if (s === '2029' || s.includes('2029')) return '1st Year (Class of 2029)'
  if (s === '2028' || s.includes('2028')) return '2nd Year (Class of 2028)'
  if (s === '2027' || s.includes('2027')) return '3rd Year (Class of 2027)'
  if (s === '2026' || s.includes('2026')) return 'Final Year (Class of 2026)'
  if (s.toLowerCase().includes('postgrad') || s.toLowerCase().includes('research')) return 'Postgraduate / Research'
  if (s.toLowerCase().includes('alumni') || s.toLowerCase().includes('founder') || s.toLowerCase().includes('professional')) return 'Alumni / Founder / Professional'
  if (s === 'Other') return 'Other'
  return s
}

export function getStoredProfile(): AttendeeProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AttendeeProfile
  } catch {
    return null
  }
}

export function isOnboardingComplete(profile: AttendeeProfile | null): boolean {
  if (!profile) return false
  if (profile.onboardingCompleted === true) return true
  const hasCollege = Boolean(profile.college && profile.college.trim().length > 0)
  const hasGradYear = Boolean(profile.gradYear && profile.gradYear.trim().length > 0)
  const hasState = Boolean(profile.state && profile.state.trim().length > 0)
  const hasCity = Boolean(profile.city && profile.city.trim().length > 0)
  return hasCollege && hasGradYear && hasState && hasCity
}

export function saveStoredProfile(updates: Partial<AttendeeProfile>): AttendeeProfile {
  const current = getStoredProfile() || {
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    gradYear: 'Final Year (Class of 2026)',
    whatsappAlerts: true,
    emailAlerts: true,
    onboardingCompleted: false,
  }

  const normalizedGrad = updates.gradYear
    ? normalizeGradYear(updates.gradYear)
    : current.gradYear
    ? normalizeGradYear(current.gradYear)
    : 'Final Year (Class of 2026)'

  const merged: AttendeeProfile = {
    ...current,
    ...updates,
    gradYear: normalizedGrad,
    onboardingCompleted: true,
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged))
      window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: merged }))
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e)
    }
  }

  return merged
}
