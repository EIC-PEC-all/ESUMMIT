// lib/registrations.ts — Connected to MongoDB Backend API & Local CMS Sync
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
  status?: string
  paymentId?: string
  teamName?: string
  date: string
  qrCodeData: string
  createdAt?: any
}

import { STORAGE_KEYS } from '@/lib/constants'

const LOCAL_STORAGE_KEY = STORAGE_KEYS.REGISTRATIONS
const DELETED_PASSES_KEY = STORAGE_KEYS.DELETED_PASS_IDS
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const getDeletedPassIds = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(DELETED_PASSES_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export const addDeletedPassId = (id: string) => {
  if (typeof window === 'undefined') return
  try {
    const list = getDeletedPassIds()
    if (!list.includes(id)) {
      list.push(id)
      localStorage.setItem(DELETED_PASSES_KEY, JSON.stringify(list))
    }
  } catch {
    // Non-fatal
  }
}

// ── LOCAL STORAGE HELPERS ──
export const getLocalRegistrations = (): RegistrationRecord[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const deletedIds = new Set(getDeletedPassIds())
    return Array.isArray(parsed) ? parsed.filter((r) => !deletedIds.has(r.id)) : []
  } catch {
    return []
  }
}

export const saveLocalRegistrations = (list: RegistrationRecord[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Local storage quota exceeded or private mode
  }
}

const PASS_TYPE_MAP: Record<string, string> = {
  'Student Pass': 'STUDENT_GENERAL',
  'Startup Silver Pass': 'STARTUP_SILVER',
  'Startup Gold Pass': 'STARTUP_GOLD',
  'Startup Diamond Pass': 'STARTUP_DIAMOND',
  'Founder Pass': 'FOUNDER_PITCH',
  'Investor Pass': 'INVESTOR_VIP',
  'Delegate Pass': 'DELEGATE_ALL_ACCESS',
  'VIP Pass': 'VIP_ALL_ACCESS',
}

// ── CREATE (Saved to MongoDB Backend & Synced with Response Manager) ──
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

  // 1. Send to MongoDB Backend API if available
  try {
    const rawPassType = PASS_TYPE_MAP[data.category] || 'STUDENT_GENERAL'
    // Gracefully map startup pass types to FOUNDER_PITCH for backend Prisma enum compatibility
    const passType = ['STARTUP_SILVER', 'STARTUP_GOLD', 'STARTUP_DIAMOND'].includes(rawPassType)
      ? 'FOUNDER_PITCH'
      : rawPassType
    const tracks = ['STARTUP_SILVER', 'STARTUP_GOLD', 'STARTUP_DIAMOND'].includes(rawPassType)
      ? [...(data.tracks || []), `Package: ${data.category}`]
      : data.tracks

    const res = await fetch(`${API_URL}/registrations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone !== 'Not provided' ? data.phone : undefined,
        college: data.college,
        passType,
        tracks,
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
    } else if (res.status === 409) {
      const errData = await res.json().catch(() => null)
      throw new Error(errData?.message || 'You are already registered for this pass category.')
    }
  } catch (err: any) {
    if (err?.message && err.message.toLowerCase().includes('already registered')) {
      throw err
    }
    // Offline or network error: gracefully proceed with local + CMS persistence
  }

  // 2. Sync to local state
  const currentList = getLocalRegistrations()
  const updated = [record, ...currentList.filter((r) => r.id !== record.id)]
  saveLocalRegistrations(updated)

  return record
}

// ── READ (Backend API + Local Offline Sync) ──
export const getUserRegistrations = async (
  userId?: string,
  userEmail?: string
): Promise<RegistrationRecord[]> => {
  const deletedIds = new Set(getDeletedPassIds())
  const rawLocalList = getLocalRegistrations()
  const localList = rawLocalList.filter((r) => !deletedIds.has(r.id))

  // 1. Try fetching from NestJS backend API if auth token is present
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) : null
    if (token) {
      const res = await fetch(`${API_URL}/registrations/my-passes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const serverPasses = await res.json()
        if (Array.isArray(serverPasses) && serverPasses.length > 0) {
          const syncedList: RegistrationRecord[] = serverPasses
            .filter((sp: any) => !deletedIds.has(sp.passId || sp.id))
            .map((sp: any) => ({
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
    const filtered = localList.filter(
      (r) =>
        (userId && r.userId === userId) ||
        (userEmail && r.email?.toLowerCase().trim() === userEmail?.toLowerCase().trim())
    )
    if (filtered.length > 0) return filtered
    return localList
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
  addDeletedPassId(ticketId)
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
