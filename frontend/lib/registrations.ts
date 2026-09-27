// lib/registrations.ts — Connected to MongoDB Backend API
export interface RegistrationRecord {
  id: string
  userId?: string
  name: string
  email: string
  phone: string
  college: string
  category: string
  tracks: string[]
  selectedEvents?: string[]
  amountPaid?: number
  paymentStatus?: 'PAID' | 'FREE' | 'PENDING'
  paymentId?: string
  teamName?: string
  date: string
  qrCodeData: string
  createdAt?: any
}

const LOCAL_STORAGE_KEY = 'pec_summit_registrations'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

const PASS_TYPE_MAP: Record<string, string> = {
  'Student Pass': 'STUDENT_GENERAL',
  'Student Delegate Pass': 'STUDENT_GENERAL',
  'Student Delegate': 'STUDENT_GENERAL',
  'STUDENT_GENERAL': 'STUDENT_GENERAL',
  'Hackathon Pass': 'HACKATHON_BUILDER',
  '24-Hour Hackathon Pass': 'HACKATHON_BUILDER',
  '24-Hour Hackathon': 'HACKATHON_BUILDER',
  'HACKATHON_BUILDER': 'HACKATHON_BUILDER',
  'Pitch Pass': 'FOUNDER_PITCH',
  'Startup Pitch Pass': 'FOUNDER_PITCH',
  'Founder Pass': 'FOUNDER_PITCH',
  'FOUNDER_PITCH': 'FOUNDER_PITCH',
  'Ambassador': 'CAMPUS_AMBASSADOR',
  'Campus Ambassador Pass': 'CAMPUS_AMBASSADOR',
  'Campus Ambassador': 'CAMPUS_AMBASSADOR',
  'CAMPUS_AMBASSADOR': 'CAMPUS_AMBASSADOR',
}

export const getLocalRegistrations = (): RegistrationRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.warn('Error reading local registrations:', e)
    return []
  }
}

export const saveLocalRegistrations = (list: RegistrationRecord[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Error saving local registrations:', e)
  }
}

// ── CREATE (Saved to MongoDB Backend) ──
export const createRegistrationRecord = async (
  data: Omit<RegistrationRecord, 'id' | 'date' | 'qrCodeData'>
): Promise<RegistrationRecord> => {
  const ticketId = `PEC-${Math.floor(100000 + Math.random() * 900000)}`
  const dateStr = new Date().toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const qrData = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PEC-SUMMIT-2026-${encodeURIComponent(
    data.email.trim()
  )}`

  let record: RegistrationRecord = {
    ...data,
    id: ticketId,
    date: dateStr,
    qrCodeData: qrData,
  }

  // 1. Send to MongoDB Backend API
  try {
    const passType = PASS_TYPE_MAP[data.category] || 'STUDENT_GENERAL'
    const res = await fetch(`${API_URL}/registrations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone !== 'Not provided' ? data.phone : undefined,
        college: data.college,
        passType,
        tracks: data.tracks,
      }),
    })

    if (res.ok) {
      const serverData = await res.json()
      if (serverData?.ticketId || serverData?.id) {
        record = {
          ...record,
          id: serverData.ticketId || serverData.id,
          qrCodeData: serverData.qrDataUrl || qrData,
        }
      }
    } else {
      const errData = await res.json().catch(() => null)
      const message =
        errData?.message ||
        (res.status === 409
          ? 'You are already registered for this pass category.'
          : `Registration failed with status ${res.status}.`)
      throw new Error(message)
    }
  } catch (err: any) {
    if (err.message) {
      throw err
    }
    console.warn('MongoDB API unreachable, saving to local cache:', err)
  }

  // 2. Sync to local state
  const currentList = getLocalRegistrations()
  const updated = [record, ...currentList.filter((r) => r.id !== record.id)]
  saveLocalRegistrations(updated)

  return record
}

// ── READ (MongoDB + Local Offline Sync) ──
export const getUserRegistrations = async (
  userId?: string,
  userEmail?: string
): Promise<RegistrationRecord[]> => {
  const localList = getLocalRegistrations()

  // 1. Try fetching from backend API if online
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pec_summit_access_token') : null
    if (token) {
      const res = await fetch(`${API_URL}/registrations/my-passes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const serverPasses = await res.json()
        if (Array.isArray(serverPasses) && serverPasses.length > 0) {
          const syncedList: RegistrationRecord[] = serverPasses.map((sp: any) => ({
            id: sp.passId || sp.id,
            userId: sp.userId || userId,
            name: sp.delegateName || sp.name || '',
            email: sp.delegateEmail || sp.email || userEmail || '',
            phone: sp.delegatePhone || sp.phone || 'Not provided',
            college: sp.delegateCollege || sp.college || 'Punjab Engineering College',
            category: sp.categoryTitle || sp.passType || 'Student Delegate',
            tracks: sp.tracks || [],
            selectedEvents: sp.selectedEvents || [],
            amountPaid: sp.amountPaid || 0,
            paymentStatus: sp.paymentStatus || 'PAID',
            date: new Date(sp.createdAt || Date.now()).toLocaleDateString('en-IN', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            qrCodeData: sp.qrCodeDataUrl || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${sp.passId}`,
          }))

          // Merge server passes with local storage
          const merged = [...syncedList]
          for (const local of localList) {
            if (!merged.some((m) => m.id === local.id)) {
              merged.push(local)
            }
          }
          saveLocalRegistrations(merged)
          return merged
        }
      }
    }
  } catch {
    // Offline or network failure — seamlessly fallback to local cache
  }

  // 2. Return cached offline passes
  if (userId || userEmail) {
    return localList.filter(
      (r) => (userId && r.userId === userId) || (userEmail && r.email?.toLowerCase() === userEmail?.toLowerCase())
    )
  }

  return localList
}

// ── UPDATE (MongoDB + Local Sync) ──
export const updateRegistrationRecord = async (
  ticketId: string,
  updates: Partial<RegistrationRecord>
): Promise<RegistrationRecord | null> => {
  // Sync to backend if possible
  try {
    await fetch(`${API_URL}/registrations/${ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
  } catch {
    // Non-fatal — local update will still apply
  }

  const currentList = getLocalRegistrations()
  let updatedRecord: RegistrationRecord | null = null

  const updatedList = currentList.map((item) => {
    if (item.id === ticketId) {
      updatedRecord = { ...item, ...updates }
      return updatedRecord
    }
    return item
  })

  if (updatedRecord) {
    saveLocalRegistrations(updatedList)
  }

  return updatedRecord
}

// ── DELETE ──
export const deleteRegistrationRecord = async (ticketId: string): Promise<boolean> => {
  // Attempt backend delete first
  try {
    await fetch(`${API_URL}/registrations/${ticketId}`, { method: 'DELETE' })
  } catch {
    // Non-fatal — remove from local cache regardless
  }

  const currentList = getLocalRegistrations()
  const filtered = currentList.filter((item) => item.id !== ticketId)
  saveLocalRegistrations(filtered)
  return true
}
