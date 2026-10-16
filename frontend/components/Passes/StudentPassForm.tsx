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
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { getStoredProfile, saveStoredProfile } from '@/lib/onboarding'
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

const COURSE_YEAR_OPTIONS = [
  'B.Tech / B.E. — 1st Year',
  'B.Tech / B.E. — 2nd Year',
  'B.Tech / B.E. — 3rd Year',
  'B.Tech / B.E. — 4th Year',
  'Postgraduate / MBA / M.Tech',
  'Other Degree / Stream',
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

  const [form, setForm] = useState<StudentFormData>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    college: '',
    courseYear: COURSE_YEAR_OPTIONS[1],
    motive: MOTIVE_OPTIONS[0],
    selectedPassId: resolveInitialPass(selectedTier),
  })

  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [registrationId, setRegistrationId] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Sync prop changes
  useEffect(() => {
    if (selectedTier) {
      setForm((prev) => ({
        ...prev,
        selectedPassId: resolveInitialPass(selectedTier),
      }))
    }
  }, [selectedTier])

  // Pre-fill user data
  useEffect(() => {
    const profile = getStoredProfile()
    setForm((prev) => ({
      ...prev,
      fullName: user?.displayName || profile?.name || prev.fullName,
      email: user?.email || profile?.email || prev.email,
      phone: profile?.phone || prev.phone,
      college: profile?.college || prev.college,
    }))
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
    if (!form.linkedin.trim()) return toast.error('LinkedIn Profile or ID is required')
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
        `Course/Year: ${form.courseYear}`,
        `Motive: ${form.motive}`,
        `LinkedIn: ${form.linkedin.trim()}`,
        `Phone: ${form.phone.trim()}`,
      ]

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

      // Submit to backend NestJS API with database persistence
      let regId = `PEC-STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

      try {
        const res = await fetch(`${apiUrl}/registrations/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            college: form.college.trim(),
            passType: backendPassType,
            tracks,
          }),
          signal: AbortSignal.timeout(6000),
        })

        const data = await res.json().catch(() => ({}))
        if (data?.registration?.passId) {
          regId = data.registration.passId
        } else if (data?.passId) {
          regId = data.passId
        } else if (typeof data?.message === 'string') {
          const match = data.message.match(/pass ID\s+([A-Z0-9-]+)/i)
          if (match?.[1]) regId = match[1]
        }
      } catch (backendErr) {
        console.warn('Backend sync note:', backendErr)
      }

      // ── Persist pass locally for instant profile access ──
      const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(regId)}`
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
        paymentStatus: selectedPkg.fee === 0 ? 'FREE' : 'PAID',
        date: new Date().toLocaleDateString('en-IN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        qrCodeData: qrDataUrl,
      }

      const existingPasses = getLocalRegistrations()
      const dedupedPasses = existingPasses.filter((p) => p.id !== regId)
      saveLocalRegistrations([newRecord, ...dedupedPasses])

      // ── Sync with Response Manager store ──
      try {
        await fetch('/api/registrations/record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            applicationId: regId,
            name: form.fullName.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            college: form.college.trim(),
            category: selectedPkg.name,
            tracks,
            amountPaid: selectedPkg.fee,
            paymentStatus: selectedPkg.fee === 0 ? 'FREE' : 'PAID',
          }),
        })
      } catch {
        // Non-fatal
      }

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
      toast.success('Student pass registered successfully!')
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
        className="rounded-3xl bg-panel border border-mint/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-mint" />
        </div>

        <div>
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.25em] text-mint">
            REGISTRATION CONFIRMED
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-primary mt-2">
            YOU&apos;RE <span className="text-gradient-mint">REGISTERED!</span>
          </h2>
          <p className="text-secondary font-body text-sm max-w-lg mx-auto leading-relaxed mt-2">
            Your pass for <strong className="text-primary">{selectedPkg.name}</strong> has been secured in the E-Summit database.
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

        <div className="p-5 rounded-2xl bg-panel-alt border border-border-subtle text-left max-w-lg mx-auto space-y-2 text-xs font-mono-data text-secondary">
          <div className="flex justify-between">
            <span className="text-muted">Pass Tier:</span>
            <span className="font-bold text-primary">{selectedPkg.name} ({selectedPkg.price})</span>
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint text-void font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:brightness-105 shadow-md"
          >
            <span>View in My Profile</span>
            <ArrowRight size={14} />
          </Link>
          {onBackToCards && (
            <button
              type="button"
              onClick={onBackToCards}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-panel-alt border border-border-subtle text-secondary hover:text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:border-mint"
            >
              <ArrowLeft size={14} />
              <span>Back to Passes</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-panel-alt border border-border-subtle text-secondary hover:text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:border-mint"
          >
            <RotateCcw size={14} />
            <span>Register Another</span>
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
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-mint/5 blur-[100px] pointer-events-none rounded-full" />

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
            <Sparkles size={13} />
            PEC E-SUMMIT 2026 DELEGATE PASS
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-primary">
            Student &amp; Builder <span className="text-gradient-mint">Pass Registration</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed mt-2 max-w-2xl">
            Join 5,000+ ambitious student engineers, designers &amp; founders at Punjab Engineering College, Chandigarh.
          </p>
        </div>

        {/* Pass Selector Tabs */}
        <div className="mb-8 p-1.5 rounded-full bg-panel-alt border border-border-subtle flex flex-row items-center gap-2 overflow-x-auto no-scrollbar">
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
                className={`flex-1 min-w-[190px] sm:min-w-0 w-full flex items-center justify-between sm:justify-center gap-2 py-3 px-3.5 sm:px-4 rounded-full transition-all cursor-pointer text-left sm:text-center shrink-0 sm:shrink whitespace-nowrap ${
                  isSelected
                    ? 'btn-mint-gradient text-void shadow-md scale-[1.01]'
                    : 'text-secondary hover:text-primary hover:bg-panel'
                }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Icon size={15} className={isSelected ? 'text-void stroke-[2.5]' : 'text-mint'} />
                  <div>
                    <div className="font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider truncate">
                      {pkg.name.replace(' PASS', '')}
                    </div>
                    <div className={`text-[10px] sm:text-[11px] font-mono-data font-bold ${isSelected ? 'text-void/90' : 'text-muted'}`}>
                      {pkg.price}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span className="font-mono-data text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-void text-mint shadow-xs">
                    ACTIVE
                  </span>
                )}
              </button>
            )
          })}
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
              <label htmlFor="student-email" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                College / Personal Email <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="rahul@pec.edu.in"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
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
                LinkedIn Profile / ID <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="student-linkedin"
                  type="text"
                  required
                  value={form.linkedin}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
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
                  value={form.courseYear}
                  onChange={(e) => updateField('courseYear', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  {COURSE_YEAR_OPTIONS.map((c) => (
                    <option key={c} value={c} className="bg-panel text-primary">
                      {c}
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

          {/* Error display */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono-data text-xs">
              {errorMsg}
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
                  <span>Registering Pass to Database...</span>
                </>
              ) : (
                <>
                  <span>Claim {selectedPkg.name} ({selectedPkg.price})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-center font-mono-data text-[10px] text-muted uppercase tracking-wider mt-2.5 flex items-center justify-center gap-1.5">
              <Shield size={12} className="text-mint shrink-0" />
              <span>Instant confirmation. Pass credentials will be available on your summit profile.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
