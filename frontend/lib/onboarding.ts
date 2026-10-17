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
  { label: '1st Year (Class of 2030)', value: '1st Year (Class of 2030)' },
  { label: '2nd Year (Class of 2029)', value: '2nd Year (Class of 2029)' },
  { label: '3rd Year (Class of 2028)', value: '3rd Year (Class of 2028)' },
  { label: 'Final Year (Class of 2027)', value: 'Final Year (Class of 2027)' },
  { label: 'Graduating Batch / Class of 2026', value: 'Class of 2026' },
  { label: 'Postgraduate / Research Scholar', value: 'Postgraduate / Research' },
  { label: 'Alumni / Founder / Working Professional', value: 'Alumni / Founder / Professional' },
  { label: 'Other', value: 'Other' },
] as const

export function normalizeGradYear(val?: string | null): string {
  if (!val) return '1st Year (Class of 2030)'
  const s = val.trim()
  if (s === '2030' || s.includes('2030')) return '1st Year (Class of 2030)'
  if (s === '2029' || s.includes('2029')) return '2nd Year (Class of 2029)'
  if (s === '2028' || s.includes('2028')) return '3rd Year (Class of 2028)'
  if (s === '2027' || s.includes('2027')) return 'Final Year (Class of 2027)'
  if (s === '2026' || s.includes('2026')) return 'Class of 2026'
  if (s.toLowerCase().includes('postgrad') || s.toLowerCase().includes('research')) return 'Postgraduate / Research'
  if (s.toLowerCase().includes('alumni') || s.toLowerCase().includes('founder') || s.toLowerCase().includes('professional')) return 'Alumni / Founder / Professional'
  if (s === 'Other') return 'Other'
  return s
}

export function getStoredProfile(userEmail?: string | null): AttendeeProfile | null {
  if (typeof window === 'undefined') return null
  try {
    if (userEmail) {
      const userKey = `pec_profile_${userEmail.trim().toLowerCase()}`
      const userRaw = localStorage.getItem(userKey)
      if (userRaw) {
        return JSON.parse(userRaw) as AttendeeProfile
      }
    }
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AttendeeProfile
    if (userEmail && parsed.email && parsed.email.toLowerCase() !== userEmail.toLowerCase()) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length === 12) {
    return digits.slice(2)
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return digits.slice(1)
  }
  return digits
}

export function isValid10DigitPhone(phone?: string | null): boolean {
  if (!phone) return false
  const normalized = normalizePhoneNumber(phone)
  return normalized.length === 10 && /^\d{10}$/.test(normalized)
}

export function validateAttendeeProfile(profile: Partial<AttendeeProfile>): {
  isValid: boolean
  error?: string
} {
  const name = (profile.name || '').trim()
  if (!name || name.length < 2) {
    return { isValid: false, error: 'Please enter your full name (at least 2 characters).' }
  }

  const phone = (profile.phone || '').trim()
  if (!phone) {
    return { isValid: false, error: 'WhatsApp number is compulsory.' }
  }
  if (!isValid10DigitPhone(phone)) {
    return { isValid: false, error: 'Please enter a valid 10-digit WhatsApp number.' }
  }

  const college = (profile.college || '').trim()
  if (!college || college.length < 2) {
    return { isValid: false, error: 'Please enter your college or institution name.' }
  }

  const state = (profile.state || '').trim()
  if (!state) {
    return { isValid: false, error: 'Please select your State / UT.' }
  }

  const city = (profile.city || '').trim()
  if (!city || city.length < 2) {
    return { isValid: false, error: 'Please select or specify your City / District.' }
  }

  const gradYear = (profile.gradYear || '').trim()
  if (!gradYear) {
    return { isValid: false, error: 'Please select your Year of Study / Graduation.' }
  }

  return { isValid: true }
}

export function isOnboardingComplete(profile: AttendeeProfile | null): boolean {
  if (!profile) return false
  const hasPhone = isValid10DigitPhone(profile.phone)
  const hasCollege = Boolean(profile.college && profile.college.trim().length >= 2)
  const hasGradYear = Boolean(profile.gradYear && profile.gradYear.trim().length > 0)
  const hasState = Boolean(profile.state && profile.state.trim().length > 0)
  const hasCity = Boolean(profile.city && profile.city.trim().length >= 2)
  return hasPhone && hasCollege && hasGradYear && hasState && hasCity
}

export function saveStoredProfile(updates: Partial<AttendeeProfile>): AttendeeProfile {
  const emailKey = updates.email || undefined
  const current = getStoredProfile(emailKey) || {
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    gradYear: '1st Year (Class of 2030)',
    whatsappAlerts: true,
    emailAlerts: true,
    onboardingCompleted: false,
  }

  const normalizedGrad = updates.gradYear
    ? normalizeGradYear(updates.gradYear)
    : current.gradYear
    ? normalizeGradYear(current.gradYear)
    : '1st Year (Class of 2030)'

  const merged: AttendeeProfile = {
    ...current,
    ...updates,
    gradYear: normalizedGrad,
    onboardingCompleted: true,
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(merged))
      const email = (merged.email || '').trim().toLowerCase()
      if (email) {
        localStorage.setItem(`pec_profile_${email}`, JSON.stringify(merged))
      }
      window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: merged }))
    } catch (e) {
      console.warn('Failed to save profile to localStorage:', e)
    }
  }

  return merged
}

export async function fetchUserProfileFromDb(email: string): Promise<AttendeeProfile | null> {
  if (!email || typeof window === 'undefined') return null
  try {
    const res = await fetch(`/api/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.success && data.profile) {
      const prof = data.profile as AttendeeProfile
      saveStoredProfile(prof)
      return prof
    }
    return null
  } catch (err) {
    console.warn('Failed to fetch user profile from DB:', err)
    return null
  }
}

export async function saveUserProfileToDb(profile: Partial<AttendeeProfile>): Promise<boolean> {
  if (!profile.email || typeof window === 'undefined') return false
  try {
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
    const data = await res.json()
    return Boolean(data?.success)
  } catch (err) {
    console.warn('Failed to save user profile to DB:', err)
    return false
  }
}

