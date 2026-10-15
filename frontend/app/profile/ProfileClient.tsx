'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Ticket,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  Download,
  Edit3,
  Trash2,
  X,
  Settings,
  Sparkles,
  Briefcase,
  Building2,
  TrendingUp,
  ExternalLink,
  Copy,
  Check,
  Clock,
  DollarSign,
  FileText,
  Globe,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  RegistrationRecord,
  getUserRegistrations,
  updateRegistrationRecord,
  deleteRegistrationRecord,
  getLocalRegistrations,
  saveLocalRegistrations,
} from '@/lib/registrations'
import toast, { Toaster } from 'react-hot-toast'
import NavHeader from '@/components/Nav/NavHeader'
import { useSummitData } from '@/hooks/useSummitData'
import { TOAST_STYLE } from '@/lib/constants'
import { auth, isFirebaseConfigured } from '@/lib/firebase'
import { updateProfile } from 'firebase/auth'
import AccountPreferencesForm from '@/components/Profile/AccountPreferencesForm'
import {
  AttendeeProfile,
  PROFILE_STORAGE_KEY,
  PROFILE_UPDATED_EVENT,
  getStoredProfile,
  saveStoredProfile,
  normalizeGradYear,
} from '@/lib/onboarding'

export type { AttendeeProfile }

export interface StartupPassApplication {
  _id?: string
  applicationId: string
  passTier?: string
  passTierName?: string
  passPrice?: string
  userId?: string
  email: string
  founderName: string
  phone: string
  founderLinkedIn?: string
  startupName: string
  websiteUrl?: string
  dpiitNumber?: string
  stage?: string
  sector?: string
  revenueStage?: string
  totalFundingRaised?: string
  currentAsk?: string
  preMoneyValuation?: string
  committedCapital?: string
  pitchDeckUrl?: string
  demoVideoUrl?: string
  mouComfortable?: string
  status: string
  reviewNotes?: string
  internalRating?: number
  createdAt: string
  updatedAt?: string
}

export function getPassStatusInfo(status?: string) {
  switch (status?.toUpperCase()) {
    case 'PENDING_REVIEW':
      return {
        label: 'Pending Screening',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        dot: 'bg-amber-400 animate-pulse',
        description: 'Your application has been received and queued for initial screening by the investment committee.',
        nextStep: 'Screening usually takes 24–48 hours. Keep an eye on your email & WhatsApp for updates.',
      }
    case 'UNDER_REVIEW':
      return {
        label: 'Under Committee Review',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        dot: 'bg-blue-400 animate-pulse',
        description: 'Your pitch deck and startup metrics are currently being evaluated by our VC panel.',
        nextStep: 'The investment team may reach out to request clarification or revenue validation.',
      }
    case 'SHORTLISTED':
      return {
        label: 'Shortlisted for Pitch',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        dot: 'bg-emerald-400',
        description: 'Congratulations! Your startup has been shortlisted to pitch live before institutional investors.',
        nextStep: 'Please check your registered inbox for the participation MoU agreement and schedule.',
      }
    case 'MOU_SENT':
      return {
        label: 'MoU Agreement Sent',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        dot: 'bg-purple-400',
        description: 'Participation MoU has been dispatched to your email for signing.',
        nextStep: 'Sign and return the MoU agreement to lock in your conclave pitching slot.',
      }
    case 'MOU_ACCEPTED':
      return {
        label: 'MoU Accepted',
        color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        dot: 'bg-cyan-400',
        description: 'Your signed MoU has been verified by the organizing committee.',
        nextStep: 'Pass payment instructions have been sent to your email.',
      }
    case 'PAYMENT_CONFIRMED':
      return {
        label: 'Pass Confirmed & Locked',
        color: 'text-mint bg-mint/15 border-mint/30',
        dot: 'bg-mint shadow-[0_0_8px_#00F5D4]',
        description: 'Pass payment confirmed! Your Founder passes and Conclave pitching slot are locked.',
        nextStep: 'Present your Application Reference ID at the registration desk on March 19th at PEC.',
      }
    case 'REJECTED':
      return {
        label: 'Not Shortlisted',
        color: 'text-red-400 bg-red-500/10 border-red-500/20',
        dot: 'bg-red-400',
        description: 'Due to conclave pitch slot capacity, we are unable to advance this application.',
        nextStep: 'You can still attend student events, keynotes, and workshops by registering on the events page.',
      }
    default:
      return {
        label: 'Application Submitted',
        color: 'text-neutral-300 bg-white/5 border-white/10',
        dot: 'bg-neutral-400',
        description: 'Application submitted successfully and recorded in our system.',
        nextStep: 'Our team will review your pitch deck and reach out via email / WhatsApp.',
      }
  }
}

function formatDateSafe(dateStr?: string) {
  if (!dateStr) return 'Recently'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return 'Recently'
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return 'Recently'
  }
}

function getTierColor(tier?: string, tierName?: string) {
  const t = (tierName || tier || '').toLowerCase()
  if (t.includes('gold')) {
    return {
      badge: 'bg-amber-400/10 text-amber-400 border-amber-400/25',
      accent: 'text-amber-400',
    }
  }
  if (t.includes('diamond')) {
    return {
      badge: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/25',
      accent: 'text-cyan-400',
    }
  }
  return {
    badge: 'bg-mint/10 text-mint border-mint/20',
    accent: 'text-mint',
  }
}

function cleanPrice(price?: string | null) {
  if (!price) return ''
  return price.replace(/^\?+/, '₹').replace(/\?(\d)/g, '₹$1')
}

function deduplicateApps(apps: StartupPassApplication[]) {
  const seen = new Set<string>()
  const result: StartupPassApplication[] = []

  const sorted = [...apps].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )

  for (const app of sorted) {
    const startupKey = `${(app.email || '').toLowerCase().trim()}_${(app.startupName || '').toLowerCase().trim()}`
    if (app.startupName && seen.has(startupKey)) {
      continue
    }
    if (app.startupName) {
      seen.add(startupKey)
    }
    result.push(app)
  }
  return result
}

export default function ProfileClient() {
  const { user, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([])
  const [passApplications, setPassApplications] = useState<StartupPassApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'passes' | 'startup_passes' | 'account'>('passes')
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null)
  
  const [currentBadge, setCurrentBadge] = useState<RegistrationRecord | null>(null)
  const [editingPass, setEditingPass] = useState<RegistrationRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const [profile, setProfile] = useState<AttendeeProfile>(() => {
    return (
      getStoredProfile() || {
        name: '',
        email: '',
        phone: '',
        college: '',
        branch: '',
        gradYear: '',
        whatsappAlerts: true,
        emailAlerts: true,
        onboardingCompleted: false,
      }
    )
  })

  const { data } = useSummitData()
  const summitDates = data?.siteConfig?.summitDates || 'MARCH 19 - 21'

  const fetchRegistrations = useCallback(async () => {
    try {
      const records = await getUserRegistrations(user?.uid)
      setMyRegistrations(records)
    } catch (err) {
      console.error('Failed to fetch user registrations', err)
      toast.error('Failed to load your passes.', TOAST_STYLE)
    } finally {
      setLoading(false)
    }
  }, [user])

  const fetchPassApplications = useCallback(async () => {
    // 1. Read from local cache first for zero-latency instant rendering
    let localList: StartupPassApplication[] = []
    try {
      const cached = localStorage.getItem('pec_user_pass_applications')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed) && parsed.length > 0) {
          localList = deduplicateApps(parsed)
          setPassApplications(localList)
        }
      }
    } catch {
      // non-fatal local cache
    }

    // 2. Query live from server with user credentials to fetch real-time organizer reviews
    const queryEmail = user?.email || profile.email || localList[0]?.email
    const queryUserId = user?.uid || localList[0]?.userId

    if (!queryEmail && !queryUserId) return

    try {
      const params = new URLSearchParams()
      if (queryEmail) params.set('email', queryEmail)
      if (queryUserId) params.set('userId', queryUserId)

      const res = await fetch(`/api/funding-conclave/apply?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        if (json.success && Array.isArray(json.applications)) {
          const serverApps: StartupPassApplication[] = json.applications

          // Create map of server applications
          const serverMap = new Map<string, StartupPassApplication>()
          serverApps.forEach((app) => {
            if (app.applicationId) serverMap.set(app.applicationId, app)
          })

          // Merge: server items + any local items not yet reflected on server
          const merged: StartupPassApplication[] = [...serverApps]
          localList.forEach((local) => {
            if (local.applicationId && !serverMap.has(local.applicationId)) {
              merged.push(local)
            }
          })

          const finalApps = deduplicateApps(merged)
          setPassApplications(finalApps)
          try {
            localStorage.setItem('pec_user_pass_applications', JSON.stringify(finalApps))
          } catch {}
        }
      }
    } catch {
      // non-fatal network error, fallback to localList
    }
  }, [user, profile.email])

  useEffect(() => {
    if (authLoading) return
    const local = typeof window !== 'undefined' ? localStorage.getItem('pec_summit_registrations') : null
    const hasLocal = local && JSON.parse(local).length > 0
    const localPassApps = typeof window !== 'undefined' ? localStorage.getItem('pec_user_pass_applications') : null
    const hasLocalPassApps = localPassApps && JSON.parse(localPassApps).length > 0

    if (!user && !hasLocal && !hasLocalPassApps) {
      router.push('/register')
      return
    }

    fetchRegistrations()
    fetchPassApplications()

    // Automatically default to startup_passes tab if user only has startup pass requests
    if (!hasLocal && hasLocalPassApps) {
      setActiveTab('startup_passes')
    }
  }, [user, authLoading, router, fetchRegistrations, fetchPassApplications])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProfile((prev) => ({
          ...prev,
          ...parsed,
          gradYear: normalizeGradYear(parsed.gradYear),
        }))
      } else {
        const fallbackName = user?.displayName || myRegistrations[0]?.name || ''
        const fallbackEmail = user?.email || myRegistrations[0]?.email || ''
        const fallbackPhone =
          myRegistrations[0]?.phone && myRegistrations[0]?.phone !== 'Not provided'
            ? myRegistrations[0]?.phone
            : ''
        const fallbackCollege = myRegistrations[0]?.college || 'Punjab Engineering College (PEC)'

        setProfile((prev) => ({
          ...prev,
          name: fallbackName,
          email: fallbackEmail,
          phone: fallbackPhone,
          college: fallbackCollege,
        }))
      }
    } catch {
      // non-fatal
    }
  }, [user, myRegistrations])

  useEffect(() => {
    const handleSync = (e: Event) => {
      const custom = e as CustomEvent<AttendeeProfile>
      if (custom.detail) {
        setProfile(custom.detail)
      } else {
        const p = getStoredProfile()
        if (p) setProfile(p)
      }
    }
    window.addEventListener(PROFILE_UPDATED_EVENT, handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProfile(true)
    try {
      saveStoredProfile(profile)

      // Update cached auth display name if changed
      const localAuthStr = localStorage.getItem('pec_summit_auth_user')
      if (localAuthStr) {
        try {
          const authObj = JSON.parse(localAuthStr)
          authObj.displayName = profile.name
          localStorage.setItem('pec_summit_auth_user', JSON.stringify(authObj))
        } catch {}
      }

      // Sync name, phone, college to local passes so tickets reflect new details
      const localPasses = getLocalRegistrations()
      if (localPasses.length > 0) {
        const updated = localPasses.map((p) => ({
          ...p,
          name: profile.name || p.name,
          phone: profile.phone || p.phone,
          college: profile.college || p.college,
        }))
        saveLocalRegistrations(updated)
        setMyRegistrations(updated)
      }

      // Update Firebase user displayName if configured
      if (isFirebaseConfigured && auth?.currentUser && profile.name) {
        try {
          await updateProfile(auth.currentUser, { displayName: profile.name })
        } catch {}
      }

      toast.success('Profile & preferences updated successfully!', TOAST_STYLE)
    } catch {
      toast.error('Failed to save profile changes.', TOAST_STYLE)
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleDeletePass = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return
    try {
      await deleteRegistrationRecord(id)
      await fetchRegistrations()
      toast.success('Booking cancelled successfully', TOAST_STYLE)
      if (currentBadge?.id === id) {
        setCurrentBadge(null)
      }
    } catch {
      toast.error('Failed to cancel booking', TOAST_STYLE)
    }
  }

  const handleCopyAppId = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedAppId(id)
    toast.success(`Application ID ${id} copied!`, TOAST_STYLE)
    setTimeout(() => setCopiedAppId(null), 2000)
  }

  if (authLoading || loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="flex items-center gap-2 text-mint font-mono text-sm uppercase">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          Loading Profile...
        </div>
      </div>
    )
  }

  return (
    <div className="w-full text-white selection:bg-mint/30 flex flex-col relative overflow-hidden font-sans">
      <Toaster position="bottom-center" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-mint/5 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-mint/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        
        {/* Profile Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display mb-1">
              Attendee Profile
            </h1>
            <p className="text-sm text-neutral-400">
              Welcome back, <span className="text-white font-bold">{profile.name || user?.displayName || myRegistrations[0]?.name || 'Student'}</span>!
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {currentBadge ? (
              <button
                type="button"
                onClick={() => setCurrentBadge(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-neutral-300 hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono font-bold text-neutral-300 hover:text-white uppercase tracking-wider transition-all cursor-pointer"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        {!currentBadge && (
          <div className="flex items-center gap-2 border-b border-white/10 pb-3.5 mb-6 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('passes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                activeTab === 'passes'
                  ? 'bg-mint text-void shadow-[0_0_15px_rgba(0,242,178,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Ticket size={14} />
              <span>Registered Events ({myRegistrations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('startup_passes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                activeTab === 'startup_passes'
                  ? 'bg-mint text-void shadow-[0_0_15px_rgba(0,242,178,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Briefcase size={14} />
              <span>Startup Passes ({passApplications.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                activeTab === 'account'
                  ? 'bg-mint text-void shadow-[0_0_15px_rgba(0,242,178,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Settings size={14} />
              <span>Personal Details</span>
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentBadge ? (
            <motion.div
              key="ticket-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full space-y-5"
            >
              {/* Digital E-Badge */}
              <div className="relative rounded-[2rem] overflow-hidden bg-[#0A1611] border border-mint/20 shadow-2xl p-6 sm:p-8 flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Image src="/esummit-mark.png" alt="Mark" width={120} height={120} />
                </div>
                
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Image src="/esummit-logo.png" alt="Logo" width={100} height={30} className="h-6 w-auto" />
                      <div className="w-px h-6 bg-white/20 mx-1" />
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
                        {summitDates} • PEC
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-mint/10 border border-mint/20 text-xs font-bold uppercase tracking-wider text-mint">
                    {currentBadge.category}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4 flex-1">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        Attendee Name
                      </span>
                      <h3 className="text-2xl font-black text-white">
                        {currentBadge.name}
                      </h3>
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        College / Institution
                      </span>
                      <p className="text-sm font-medium text-neutral-300">{currentBadge.college}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-mono mb-1">
                        Pass ID
                      </span>
                      <span className="inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs font-bold text-mint">
                        {currentBadge.id}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-2xl shrink-0 flex flex-col items-center">
                    <Image
                      src={currentBadge.qrCodeData}
                      alt="Check-in QR"
                      width={120}
                      height={120}
                      className="w-24 h-24 object-contain mix-blend-multiply"
                      unoptimized
                    />
                    <span className="text-[9px] text-neutral-800 font-bold uppercase mt-1 font-mono tracking-wider">
                      Entry QR
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Link
                  href="/register"
                  className="py-2.5 px-3 rounded-full bg-mint hover:bg-white text-void text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Sparkles size={14} />
                  <span>Story Badge</span>
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download size={14} />
                  <span>Print Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPass(currentBadge)}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePass(currentBadge.id)}
                  className="py-2.5 px-3 rounded-full border border-white/15 bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>Cancel Pass</span>
                </button>
              </div>
            </motion.div>
          ) : activeTab === 'account' ? (
            <motion.div
              key="account-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AccountPreferencesForm
                profile={profile}
                setProfile={setProfile}
                onSave={handleSaveProfile}
                isSaving={isSavingProfile}
                userDisplayName={user?.displayName}
              />
            </motion.div>
          ) : activeTab === 'startup_passes' ? (
            <motion.div
              key="startup-passes-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {passApplications.length === 0 ? (
                <div className="text-center py-14 sm:py-16 border border-dashed border-white/10 rounded-3xl p-6 sm:p-10 bg-white/[0.01] w-full">
                  <div className="max-w-md mx-auto space-y-4">
                    <Briefcase size={44} className="mx-auto text-neutral-600 mb-1 stroke-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1.5 font-display uppercase tracking-wider">
                        No Startup Pass Requests Yet
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-400">
                        Have a venture looking to raise seed or growth capital? Apply for the Funding Conclave to pitch in front of 25+ institutional venture funds and angel networks.
                      </p>
                    </div>
                    <div className="pt-2">
                      <Link
                        href="/passes"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-mint text-void font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(0,242,178,0.25)] transition-all"
                      >
                        <span>Apply for Startup Pass</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                    <div>
                      <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                        Funding Conclave Applications ({passApplications.length})
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Track the live screening status, committee evaluation, and pitch slot confirmation for your startup pass requests.
                      </p>
                    </div>
                    <Link
                      href="/passes"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-mint/30 bg-mint/10 hover:bg-mint/20 text-mint text-xs font-mono font-bold uppercase tracking-wider transition-colors self-start sm:self-auto"
                    >
                      <span>New Application</span>
                    </Link>
                  </div>

                  <div className="space-y-5">
                    {passApplications.map((app) => {
                      const statusInfo = getPassStatusInfo(app.status)
                      const tierStyle = getTierColor(app.passTier, app.passTierName)
                      const displayPrice = cleanPrice(app.passPrice)
                      return (
                        <div
                          key={app.applicationId || app._id}
                          className="rounded-3xl border border-white/10 bg-[#0B1512] p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all hover:border-mint/30 group"
                        >
                          {/* Ambient subtle glow */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 rounded-full blur-[80px] pointer-events-none" />

                          {/* Top Row: Tier, Pricing, Date, Status */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border tracking-wider uppercase ${tierStyle.badge}`}>
                                {app.passTierName || 'GOLD PASS'}
                              </span>
                              {displayPrice && (
                                <span className="text-xs font-mono text-neutral-300 font-semibold">
                                  {displayPrice}
                                </span>
                              )}
                              <span className="text-[11px] font-mono text-neutral-500">
                                • {formatDateSafe(app.createdAt)}
                              </span>
                            </div>

                            {/* Status badge */}
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.color}`}>
                              <span className={`w-2 h-2 rounded-full ${statusInfo.dot}`} />
                              {statusInfo.label}
                            </span>
                          </div>

                          {/* Title & Reference ID */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 relative z-10">
                            <div>
                              <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-0.5">
                                Venture / Startup
                              </span>
                              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-display group-hover:text-mint transition-colors">
                                {app.startupName}
                              </h3>
                            </div>

                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full self-start sm:self-auto">
                              <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">Ref ID:</span>
                              <span className="text-xs sm:text-sm font-mono font-bold text-mint tracking-wider">{app.applicationId}</span>
                              <button
                                type="button"
                                onClick={() => handleCopyAppId(app.applicationId)}
                                className="p-1 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer ml-1"
                                title="Copy Reference ID"
                              >
                                {copiedAppId === app.applicationId ? <Check size={13} className="text-mint" /> : <Copy size={13} />}
                              </button>
                            </div>
                          </div>

                          {/* Details Grid - 3 Clean Balanced Pillars */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-4 relative z-10">
                            {/* Pillar 1: Founder & Leadership */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between gap-3">
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider flex items-center gap-1.5">
                                  <Building2 size={12} className="text-mint" /> Founder & Team
                                </span>
                                <p className="text-sm font-bold text-white truncate pt-0.5">{app.founderName}</p>
                                <p className="text-xs text-neutral-400 truncate">{app.email}</p>
                                <p className="text-xs text-neutral-400 truncate">{app.phone}</p>
                              </div>
                              {app.founderLinkedIn ? (
                                <a
                                  href={app.founderLinkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-mint hover:underline transition-all w-fit"
                                >
                                  <span>Founder Profile</span>
                                  <ExternalLink size={10} />
                                </a>
                              ) : (
                                <span className="text-[11px] font-mono text-neutral-600">No profile link</span>
                              )}
                            </div>

                            {/* Pillar 2: Venture Metrics & Financials */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between gap-2.5">
                              <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider flex items-center gap-1.5">
                                  <TrendingUp size={12} className="text-mint" /> Venture & Ask
                                </span>
                                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                                  <span className="text-xs font-semibold text-white">{app.stage || 'Early Stage'}</span>
                                  <span className="text-neutral-500">•</span>
                                  <span className="text-xs text-neutral-300">{app.sector || 'General'}</span>
                                </div>
                                <div className="flex items-baseline gap-3 pt-1 flex-wrap">
                                  <div>
                                    <span className="text-[9px] uppercase font-mono text-neutral-400 block">Ask</span>
                                    <span className="text-sm font-bold font-mono text-mint">{app.currentAsk || 'Undisclosed'}</span>
                                  </div>
                                  {app.preMoneyValuation && (
                                    <div>
                                      <span className="text-[9px] uppercase font-mono text-neutral-400 block">Valuation</span>
                                      <span className="text-xs font-semibold font-mono text-neutral-300">{app.preMoneyValuation}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {app.dpiitNumber ? (
                                <span className="text-[11px] font-mono text-neutral-400">
                                  DPIIT: <span className="text-white font-medium">{app.dpiitNumber}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] font-mono text-neutral-600">DPIIT: Not Registered</span>
                              )}
                            </div>

                            {/* Pillar 3: Pitch Materials & Links */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between gap-2.5">
                              <div className="space-y-2">
                                <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider flex items-center gap-1.5">
                                  <FileText size={12} className="text-mint" /> Pitch Materials
                                </span>
                                <div className="pt-0.5">
                                  {app.pitchDeckUrl ? (
                                    <a
                                      href={app.pitchDeckUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mint/10 hover:bg-mint/20 border border-mint/30 text-xs font-mono font-bold text-mint transition-all"
                                    >
                                      <FileText size={12} />
                                      <span>View Pitch Deck</span>
                                      <ExternalLink size={11} />
                                    </a>
                                  ) : (
                                    <span className="text-xs text-neutral-500 italic block">No pitch deck uploaded</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap pt-1">
                                {app.websiteUrl && (
                                  <a
                                    href={app.websiteUrl.startsWith('http') ? app.websiteUrl : `https://${app.websiteUrl}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors"
                                  >
                                    <Globe size={11} />
                                    <span>Website</span>
                                    <ExternalLink size={10} />
                                  </a>
                                )}
                                {app.mouComfortable && (
                                  <span className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1">
                                    <CheckCircle2 size={11} /> MoU Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Progress & Evaluation Stage Box */}
                          <div className="rounded-2xl border border-white/10 bg-[#07100D] p-4 space-y-2 relative z-10 mt-3.5">
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 p-2 rounded-full border ${statusInfo.color}`}>
                                <Clock size={13} />
                              </div>
                              <div className="space-y-1 flex-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                                  Evaluation Status: {statusInfo.label}
                                </h4>
                                <p className="text-xs text-neutral-300 leading-relaxed">
                                  {statusInfo.description}
                                </p>
                                <p className="text-xs text-neutral-400 font-mono pt-1">
                                  <span className="text-mint font-semibold">Next Action: </span>
                                  {statusInfo.nextStep}
                                </p>
                              </div>
                            </div>

                            {/* Committee review note if organizer left notes */}
                            {app.reviewNotes && (
                              <div className="mt-3 pt-3 border-t border-white/10">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-mint block font-bold mb-1">
                                  Committee Feedback
                                </span>
                                <p className="text-xs text-neutral-200 bg-white/5 p-3.5 rounded-2xl border border-white/10 font-mono italic">
                                  &ldquo;{app.reviewNotes}&rdquo;
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {passApplications.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl border border-mint/20 bg-mint/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-mint/10 text-mint border border-mint/20">
                      <Briefcase size={16} />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        You have {passApplications.length} Startup Pass Request{passApplications.length > 1 ? 's' : ''} in review
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Track live status, committee evaluation, and pitch slot updates.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('startup_passes')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mint text-void text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <span>View Startup Requests</span>
                  </button>
                </div>
              )}
              {myRegistrations.length === 0 ? (
                <div className="text-center py-14 sm:py-16 border border-dashed border-white/10 rounded-3xl p-6 sm:p-10 bg-white/[0.01] w-full">
                  <div className="max-w-md mx-auto space-y-4">
                    <Ticket size={44} className="mx-auto text-neutral-600 mb-1 stroke-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1.5 font-display uppercase tracking-wider">No Events Registered</h3>
                      <p className="text-xs sm:text-sm text-neutral-400">
                        You haven&apos;t registered for any summit events, hackathons, or workshops yet.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <Link
                        href="/events"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-mint text-void font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(0,242,178,0.25)] transition-all"
                      >
                        <span>Explore &amp; Register Events</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setActiveTab('account')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        <Settings size={13} />
                        <span>Edit Personal Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myRegistrations.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-white/10 bg-[#13221C] p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-white/20 transition-all group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-mint/10 text-mint font-bold uppercase tracking-wider font-mono">
                            {item.category}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500 font-bold">#{item.id.slice(-6)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-mint transition-colors">{item.name}</h3>
                          <p className="text-xs text-neutral-400 truncate mt-1">{item.college}</p>
                        </div>
                        {item.selectedEvents && item.selectedEvents.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {item.selectedEvents.map((ev) => (
                              <span
                                key={ev}
                                className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 font-mono uppercase tracking-wider"
                              >
                                {ev}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                        <span className="text-neutral-500 font-mono text-[10px] font-semibold uppercase tracking-wider">
                          {item.paymentStatus === 'PAID' ? `₹${item.amountPaid || 0}` : 'FREE ENTRY'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setCurrentBadge(item)}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            View Ticket
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePass(item.id)}
                            className="p-1.5 rounded-full border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/15 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Cancel / Delete Pass"
                            aria-label={`Cancel pass ${item.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Pass Modal */}
      <AnimatePresence>
        {editingPass && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-[2rem] border border-white/15 bg-[#13221C] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Edit Pass Details</h3>
                <button
                  type="button"
                  onClick={() => setEditingPass(null)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editingPass) return
                  setIsSubmitting(true)
                  try {
                    await updateRegistrationRecord(editingPass.id, {
                      name: editingPass.name,
                      phone: editingPass.phone,
                      college: editingPass.college,
                    })
                    await fetchRegistrations()
                    if (currentBadge?.id === editingPass.id) {
                      setCurrentBadge({ ...currentBadge, ...editingPass })
                    }
                    setEditingPass(null)
                    toast.success('Pass updated successfully!', TOAST_STYLE)
                  } catch {
                    toast.error('Failed to update pass.', TOAST_STYLE)
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingPass.name}
                    onChange={(e) => setEditingPass({ ...editingPass, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#081310] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">Phone</label>
                  <input
                    type="tel"
                    value={editingPass.phone || ''}
                    onChange={(e) => setEditingPass({ ...editingPass, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#081310] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider font-mono">College</label>
                  <input
                    type="text"
                    value={editingPass.college}
                    onChange={(e) => setEditingPass({ ...editingPass, college: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#081310] px-3.5 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-mint px-4 py-3 text-sm font-bold text-void hover:bg-white transition-colors disabled:opacity-50 uppercase tracking-wider cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
