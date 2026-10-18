'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  BookOpen,
  Target,
  Crown,
  Terminal,
  Shield,
  Gem,
  CheckCircle2,
  Copy,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Lock,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { STATE_NAMES, getCitiesForState } from '@/data/indiaLocations'
import {
  getStoredProfile,
  saveStoredProfile,
  saveUserProfileToDb,
  GRADUATION_YEARS,
  normalizeGradYear,
} from '@/lib/onboarding'
import {
  RegistrationRecord,
  getLocalRegistrations,
  saveLocalRegistrations,
} from '@/lib/registrations'
import { STUDENT_PACKAGES } from './passesData'

interface StudentFormData {
  fullName: string
  email: string
  phone: string
  linkedin: string
  college: string
  state: string
  city: string
  customCity: string
  courseYear: string
  motive: string
  selectedPassId: string
}

const MOTIVE_OPTIONS = [
  'Competing in Hackathon & Coding Contests',
  'Attending Visionary Keynotes & Speaker Sessions',
  'Exploring Startup Expo & Demo Zones',
  'Networking with Founders & Investors',
  'Internships, Jobs & Career Opportunities',
  'Pitching Ideas & Learning Venture Building',
  'Other',
]

interface Props {
  selectedTier: string
  onSelectTier?: (tier: string) => void
  onBackToCards?: () => void
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function StudentPassForm({
  selectedTier,
  onSelectTier,
  onBackToCards,
}: Props) {
  const { user } = useAuth()

  // Match selectedTier against STUDENT_PACKAGES
  const resolveInitialPass = (tier: string) => {
    const found = STUDENT_PACKAGES.find(
      (p) => p.id === tier || p.tier === tier
    )
    return found ? found.id : STUDENT_PACKAGES[0].id
  }

  const [form, setForm] = useState<StudentFormData>(() => {
    const profile = getStoredProfile()
    return {
      fullName: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      linkedin: '',
      college: profile?.college || '',
      state: profile?.state || 'Punjab',
      city: profile?.city || 'Chandigarh Tricity',
      customCity: '',
      courseYear: normalizeGradYear(profile?.gradYear) || '1st Year (Class of 2030)',
      motive: MOTIVE_OPTIONS[0],
      selectedPassId: resolveInitialPass(selectedTier),
    }
  })

  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [registrationId, setRegistrationId] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [existingPass, setExistingPass] = useState<{
    id: string
    category?: string
  } | null>(null)

  // Sync prop changes
  useEffect(() => {
    if (selectedTier) {
      setForm((prev) => ({
        ...prev,
        selectedPassId: resolveInitialPass(selectedTier),
      }))
    }
  }, [selectedTier])

  // Pre-fill user data & check existing registration
  useEffect(() => {
    const profile = getStoredProfile()
    setForm((prev) => {
      const st = profile?.state || prev.state || 'Punjab'
      const c = profile?.city || prev.city || 'Chandigarh Tricity'
      return {
        ...prev,
        fullName: user?.displayName || profile?.name || prev.fullName,
        email: user?.email || profile?.email || prev.email,
        phone: profile?.phone || prev.phone,
        college: profile?.college || prev.college,
        state: st,
        city: c,
        courseYear: normalizeGradYear(profile?.gradYear) || prev.courseYear,
      }
    })

    // Check local storage first
    const local = getLocalRegistrations()
    if (local && local.length > 0) {
      setExistingPass({ id: local[0].id, category: local[0].category })
    }

    // Check backend API for user registration
    const email = user?.email || profile?.email
    if (email) {
      fetch(`/api/profile?email=${encodeURIComponent(email.trim().toLowerCase())}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data?.profile?.registrations) && data.profile.registrations.length > 0) {
            const first = data.profile.registrations[0]
            setExistingPass({
              id: first.passId || first.id,
              category: first.passType,
            })
          }
        })
        .catch(() => {})
    }
  }, [user])

  const selectedPkg =
    STUDENT_PACKAGES.find((p) => p.id === form.selectedPassId) ?? STUDENT_PACKAGES[0]

  const handlePassSwitch = (passId: string) => {
    setForm((prev) => ({ ...prev, selectedPassId: passId }))
    if (onSelectTier) onSelectTier(passId)
  }

  const updateField = (key: keyof StudentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleStateChange = (newState: string) => {
    setForm((prev) => ({
      ...prev,
      state: newState,
      city: '',
      customCity: '',
    }))
  }

  const availableCities = getCitiesForState(form.state)
  const finalCity = form.city === 'Other' ? form.customCity.trim() : form.city.trim()

  // ── Open Form for all users (logged in or guest) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.fullName.trim()) return toast.error('Full Name is required')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('A valid college or personal email is required')
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      return toast.error('A valid 10-digit WhatsApp number is required')
    }
    if (!form.college.trim()) return toast.error('College / Institute Name is required')
    if (!form.state.trim()) return toast.error('State or UT is required')
    if (!finalCity) return toast.error('City is required')
    if (!form.courseYear.trim()) return toast.error('Degree & Year of Study is required')
    if (!form.motive.trim()) return toast.error('Please select your primary motive')

    setSubmitState('submitting')
    setErrorMsg('')

    try {
      // Backend prisma passType mapping
      let backendPassType = 'STUDENT_GENERAL'
      if (selectedPkg.tier === 'hackathon') backendPassType = 'HACKATHON_BUILDER'
      else if (selectedPkg.tier === 'all-access' || selectedPkg.tier === 'combo') {
        backendPassType = 'STUDENT_GENERAL'
      }

      const tracks = [
        `Pass: ${selectedPkg.name} (${selectedPkg.price})`,
        `College: ${form.college.trim()}`,
        `Location: ${finalCity}, ${form.state.trim()}`,
        `Year: ${form.courseYear}`,
        `Motive: ${form.motive}`,
        ...(form.linkedin.trim() ? [`LinkedIn: ${form.linkedin.trim()}`] : []),
        `Phone: ${form.phone.trim()}`,
      ]

      // ── Mark Onboarding Completed & Sync Profile ──
      const profileData = {
        name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        state: form.state.trim(),
        city: finalCity,
        gradYear: form.courseYear,
        onboardingCompleted: true,
      }
      saveStoredProfile(profileData)
      saveUserProfileToDb(profileData).catch(() => {})

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

      // Submit to backend NestJS API with database persistence
      let regId = `PEC-STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      const res = await fetch(`${apiUrl}/registrations/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          college: form.college.trim(),
          city: finalCity,
          state: form.state.trim(),
          gradYear: form.courseYear,
          passType: backendPassType,
          tracks,
        }),
        signal: AbortSignal.timeout(8000),
      })

      const data = await res.json().catch(() => ({}))

      if (res.status === 409) {
        const duplicatePassId =
          data?.passId ||
          data?.registration?.passId ||
          (typeof data?.message === 'string'
            ? data.message.match(/pass ID\s+([A-Z0-9-]+)/i)?.[1]
            : null) ||
          existingPass?.id ||
          'Existing'

        setExistingPass({ id: duplicatePassId, category: selectedPkg.name })
        const friendlyMsg = `User ${form.email.trim().toLowerCase()} is already registered with pass ID ${duplicatePassId}. Each attendee is permitted 1 active student pass.`
        setErrorMsg(friendlyMsg)
        setSubmitState('error')
        toast.error(`Already registered with Pass ID ${duplicatePassId}!`, { duration: 6000 })
        return
      }

      if (!res.ok) {
        const errMsg =
          typeof data?.message === 'string'
            ? data.message
            : Array.isArray(data?.message)
            ? data.message.join(', ')
            : `Registration failed (${res.status}). Please try again.`
        setErrorMsg(errMsg)
        setSubmitState('error')
        toast.error(errMsg)
        return
      }

      if (data?.registration?.passId) {
        regId = data.registration.passId
      } else if (data?.passId) {
        regId = data.passId
      }

      // ── Persist pass record locally & to DB with status ──
      const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(regId)}`
      const isFree = selectedPkg.fee === 0
      const initialStatus = isFree ? 'PAYMENT_CONFIRMED' : 'PENDING_REVIEW'
      const initialPaymentStatus = isFree ? 'FREE' : 'PENDING'

      const newRecord: RegistrationRecord = {
        id: regId,
        userId: user?.uid,
        name: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        category: selectedPkg.name,
        tracks,
        amountPaid: selectedPkg.fee,
        paymentStatus: initialPaymentStatus,
        status: initialStatus,
        date: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        qrCodeData: qrDataUrl,
      }

      // ── Persist pass locally (Single Pass Rule) ──
      saveLocalRegistrations([newRecord])
      setExistingPass({ id: regId, category: selectedPkg.name })

      // Update attendee profile
      try {
        const stored = getStoredProfile()
        saveStoredProfile({
          ...(stored || {}),
          name: form.fullName.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          college: form.college.trim(),
          onboardingCompleted: true,
        })
      } catch {}

      setRegistrationId(regId)
      setSubmitState('success')
      toast.success(isFree ? 'Registration confirmed successfully!' : 'Application submitted! Our team will contact you for payment verification.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setErrorMsg(msg)
      setSubmitState('error')
      toast.error(msg)
    }
  }

  const handleReset = () => {
    setSubmitState('idle')
    setErrorMsg('')
    setRegistrationId('')
  }

  // ── Success State Screen ───────────────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <motion.div
        id="student-pass-form"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-panel border border-mint/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl w-full max-w-5xl mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-mint" />
        </div>

        <div>
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.25em] text-mint">
            {selectedPkg.fee === 0 ? 'REGISTRATION CONFIRMED' : 'APPLICATION RECEIVED'}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-primary mt-2">
            {selectedPkg.fee === 0 ? (
              <>YOU&apos;RE <span className="text-gradient-mint">REGISTERED!</span></>
            ) : (
              <>YOU&apos;RE <span className="text-gradient-mint">PRE-REGISTERED!</span></>
            )}
          </h2>
          <p className="text-secondary font-body text-sm sm:text-base max-w-xl mx-auto leading-relaxed mt-2">
            {selectedPkg.fee === 0 ? (
              <>Your pass for <strong className="text-primary">{selectedPkg.name}</strong> is confirmed in the E-Summit database.</>
            ) : (
              <>Thank you for applying for the <strong className="text-primary">{selectedPkg.name}</strong>. Your application is saved directly to your account. Our team will contact you on WhatsApp / Email for payment verification, after which your pass status will be confirmed on your profile.</>
            )}
          </p>
        </div>

        {registrationId && (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-mint/10 border border-mint/25">
            <span className="font-mono-data text-xs text-secondary uppercase tracking-wider">Pass ID:</span>
            <span className="font-mono-data font-black text-mint tracking-widest text-sm">{registrationId}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(registrationId)
                toast.success('Pass ID copied!')
              }}
              aria-label="Copy Pass ID"
              className="p-1.5 rounded-full hover:bg-mint/10 text-secondary hover:text-mint transition-colors cursor-pointer"
            >
              <Copy size={15} />
            </button>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-panel-alt border border-border-subtle text-left max-w-xl mx-auto space-y-2.5 text-xs font-mono-data text-secondary">
          <div className="flex justify-between">
            <span className="text-muted">Pass Tier:</span>
            <span className="font-bold text-primary">{selectedPkg.name} ({selectedPkg.price})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Status:</span>
            <span className={`font-bold ${selectedPkg.fee === 0 ? 'text-mint' : 'text-amber-400'}`}>
              {selectedPkg.fee === 0 ? 'Confirmed & Active' : 'Pending Review / Payment Verification'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delegate:</span>
            <span className="font-bold text-primary">{form.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">College:</span>
            <span className="font-bold text-primary">{form.college}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Event Dates:</span>
            <span className="font-bold text-mint">November 14–15, 2026 @ PEC Chandigarh</span>
          </div>
        </div>

        <p className="text-[11px] font-mono-data text-muted max-w-md mx-auto">
          Notice: Each attendee is permitted 1 active student pass. Re-registering or switching tiers automatically replaces previous registrations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/profile?tab=passes"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-mint text-void font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:brightness-105 shadow-lg shadow-mint/20"
          >
            <span>View in My Profile</span>
            <ArrowRight size={14} />
          </Link>
          {onBackToCards && (
            <button
              type="button"
              onClick={onBackToCards}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-panel-alt border border-border-subtle text-secondary hover:text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:border-mint"
            >
              <ArrowLeft size={14} />
              <span>Back to Passes</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-panel-alt border border-border-subtle text-secondary hover:text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:border-mint"
          >
            <RotateCcw size={14} />
            <span>Switch Pass Tier</span>
          </button>
        </div>
      </motion.div>
    )
  }

  // ── Main Form Screen ───────────────────────────────────────────────────────
  return (
    <div id="student-pass-form" className="w-full max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <div className="rounded-3xl bg-panel border border-border-subtle p-6 sm:p-9 md:p-11 shadow-2xl relative overflow-hidden">

        {/* Back Link */}
        {onBackToCards && (
          <button
            type="button"
            onClick={onBackToCards}
            className="inline-flex items-center gap-2 font-mono-data text-xs text-secondary hover:text-mint transition-colors mb-6 cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Passes</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-7">
          <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-mint flex items-center gap-1.5 mb-1.5">
            PEC E-SUMMIT 2026 DELEGATE PASS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-primary">
            Student &amp; Builder <span className="text-gradient-mint">Pass Registration</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed mt-2 max-w-2xl">
            Join 5,000+ ambitious student engineers, designers &amp; founders at Punjab Engineering College, Chandigarh.
          </p>
        </div>

        {/* Auth Status Banner */}
        {user ? (
          <div className="mb-6 px-4 py-2.5 rounded-2xl bg-mint/10 border border-mint/20 flex items-center justify-between gap-3 text-xs font-mono-data">
            <div className="flex items-center gap-2 text-mint font-bold">
              <CheckCircle2 size={15} />
              <span>Logged in as: <strong className="text-white">{user.email}</strong></span>
            </div>
            <span className="text-[10px] text-muted uppercase tracking-wider hidden sm:inline">Details Auto-Synced</span>
          </div>
        ) : (
          <div className="mb-6 p-3.5 rounded-2xl bg-panel-alt border border-border-subtle flex items-center justify-between gap-3 text-xs font-mono-data">
            <div className="flex items-center gap-2 text-secondary">
              <ArrowRight size={14} className="text-mint shrink-0" />
              <span>Have an existing account? <Link href="/login?callbackUrl=/passes" className="text-mint font-bold hover:underline">Sign In</Link> to sync your passes, or fill details below to apply directly.</span>
            </div>
          </div>
        )}

        {/* Existing Pass Notice */}
        {existingPass && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-mono-data text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Active Pass Detected ({existingPass.id})
                </p>
                <p className="font-body text-xs text-secondary leading-relaxed">
                  You already have an active pass registered for <strong className="text-primary">{existingPass.category || 'Student Pass'}</strong>. Each attendee is permitted 1 pass per category.
                </p>
              </div>
            </div>
            <Link
              href="/profile?tab=passes"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mint text-void font-mono-data text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shrink-0 shadow-sm"
            >
              <span>View Pass</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* Pass Selector Tabs — Single-line horizontally scrollable with fully extending pill container */}
        <div className="w-full overflow-x-auto no-scrollbar pb-2 mb-8">
          <div className="inline-flex min-w-full items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-panel-alt border border-border-subtle shadow-md">
            {STUDENT_PACKAGES.map((pkg) => {
              const isSelected = form.selectedPassId === pkg.id
              let Icon = Shield
              if (pkg.tier === 'all-access') Icon = Crown
              if (pkg.tier === 'hackathon') Icon = Terminal
              if (pkg.tier === 'combo') Icon = Gem

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handlePassSwitch(pkg.id)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3.5 sm:px-5 rounded-full transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                      : 'text-secondary hover:text-primary hover:bg-panel'
                  }`}
                >
                  <Icon size={15} className={isSelected ? 'text-void stroke-[2.5]' : 'text-mint shrink-0'} />
                  <span className="font-mono-data text-xs sm:text-sm font-black uppercase tracking-wider">
                    {pkg.name.replace(' PASS', '')}
                  </span>
                  <span className={`text-[11px] sm:text-xs font-mono-data font-bold ${isSelected ? 'text-void/90' : 'text-muted'}`}>
                    {pkg.price}
                  </span>
                  {isSelected && (
                    <span className="font-mono-data text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-void text-mint shadow-xs ml-0.5">
                      ACTIVE
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Tier Brief */}
        <div className="mb-8 p-4 rounded-2xl bg-mint/5 border border-mint/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-mono-data text-xs font-bold text-mint uppercase tracking-wider">
              Selected: {selectedPkg.name} — {selectedPkg.price}
            </div>
            <p className="text-secondary font-body text-xs mt-0.5">
              {selectedPkg.tagline}
            </p>
          </div>
          <span className="font-mono-data text-[11px] text-muted uppercase tracking-widest shrink-0">
            * Required fields
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label htmlFor="student-fullName" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Full Name <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="student-email" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary">
                  Account Email <span className="text-mint">*</span>
                </label>
                {user?.email && (
                  <span className="inline-flex items-center gap-1 font-mono-data text-[10px] text-mint uppercase tracking-wider font-bold">
                    <CheckCircle2 size={11} /> Verified Account
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-email"
                  type="email"
                  required
                  readOnly={Boolean(user?.email)}
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="rahul@pec.edu.in"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors ${
                    user?.email ? 'opacity-85 cursor-not-allowed bg-black/30' : ''
                  }`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="student-phone" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Phone Number (WhatsApp) <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* LinkedIn ID */}
            <div>
              <label htmlFor="student-linkedin" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                LinkedIn Profile / ID <span className="text-muted text-[10px] font-normal lowercase">(optional)</span>
              </label>
              <div className="relative">
                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-linkedin"
                  type="text"
                  value={form.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username (optional)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Location: State and City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="student-state" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                State / Union Territory <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="student-state"
                  required
                  value={form.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled className="bg-panel text-muted">
                    Select State / UT
                  </option>
                  {STATE_NAMES.map((s) => (
                    <option key={s} value={s} className="bg-panel text-primary">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="student-city" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                City / Town <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="student-city"
                  required
                  value={form.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  <option value="" disabled className="bg-panel text-muted">
                    Select City
                  </option>
                  {availableCities.map((c) => (
                    <option key={c} value={c} className="bg-panel text-primary">
                      {c}
                    </option>
                  ))}
                  <option value="Other" className="bg-panel text-primary font-bold">
                    Other (Specify Custom City)
                  </option>
                </select>
              </div>

              {form.city === 'Other' && (
                <div className="mt-2.5">
                  <input
                    type="text"
                    required
                    value={form.customCity}
                    onChange={(e) => updateField('customCity', e.target.value)}
                    placeholder="Enter your city name"
                    className="w-full px-4 py-2.5 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* College / Institute */}
            <div>
              <label htmlFor="student-college" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                College / University / School <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-college"
                  type="text"
                  required
                  value={form.college}
                  onChange={(e) => updateField('college', e.target.value)}
                  placeholder="e.g. Punjab Engineering College, Chandigarh"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Course & Year */}
            <div>
              <label htmlFor="student-courseYear" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Degree &amp; Year of Study <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="student-courseYear"
                  required
                  value={form.courseYear}
                  onChange={(e) => updateField('courseYear', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  {GRADUATION_YEARS.map((y) => (
                    <option key={y.value} value={y.value} className="bg-panel text-primary">
                      {y.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Primary Motive */}
          <div>
            <label htmlFor="student-motive" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
              Primary motive for attending E-Summit 2026? <span className="text-mint">*</span>
            </label>
            <div className="relative">
              <Target size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                id="student-motive"
                value={form.motive}
                onChange={(e) => updateField('motive', e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
              >
                {MOTIVE_OPTIONS.map((m) => (
                  <option key={m} value={m} className="bg-panel text-primary">
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Graceful Error Display */}
          {errorMsg && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-3 shadow-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-mono-data text-xs font-black uppercase tracking-wider text-amber-300">
                    Registration Alert
                  </h4>
                  <p className="font-body text-xs text-secondary leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              </div>

              {existingPass?.id && (
                <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2">
                  <div className="font-mono-data text-xs text-secondary flex items-center gap-1.5">
                    <span>Active Pass ID:</span>
                    <span className="font-bold text-primary px-2.5 py-0.5 rounded bg-panel border border-border-subtle">
                      {existingPass.id}
                    </span>
                  </div>
                  <Link
                    href="/profile?tab=passes"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-mint text-void font-mono-data text-[11px] font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-sm"
                  >
                    <span>View Pass in Profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitState === 'submitting'}
              className="btn-mint-gradient w-full py-4 px-6 rounded-full text-void font-mono-data text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering Application to Database...</span>
                </>
              ) : (
                <>
                  <span>
                    {selectedPkg.fee === 0
                      ? `Submit Registration for ${selectedPkg.name}`
                      : `Submit Application for ${selectedPkg.name} (${selectedPkg.price})`}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-center font-mono-data text-[10px] text-muted uppercase tracking-wider mt-2.5 flex items-center justify-center gap-1.5">
              <Shield size={12} className="text-mint shrink-0" />
              <span>Form responses are saved directly to E-Summit database. Team will reach out for payment confirmation.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
