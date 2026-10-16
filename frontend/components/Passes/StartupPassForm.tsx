'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  Linkedin,
  Building2,
  Target,
  Briefcase,
  Gem,
  Crown,
  Shield,
  CheckCircle2,
  Copy,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { getStoredProfile } from '@/lib/onboarding'
import { STARTUP_PACKAGES } from './passesData'

interface StartupFormData {
  fullName: string
  email: string
  phone: string
  linkedin: string
  organization: string
  motive: string
  role: string
  passTier: 'silver' | 'gold' | 'diamond'
}

const ROLE_OPTIONS = [
  'Founder',
  'Investor',
  'Working Professional',
  'Startup/Institute Representative',
  'Other',
]

const MOTIVE_OPTIONS = [
  'Pitching to Investors & Raising Funds',
  'Showcasing Product at Startup Expo',
  'Hiring & Recruitment (Access to 5k+ Talent)',
  'B2B Networking & Strategic Partnerships',
  'Mentorship & Guidance from Industry Leaders',
  'Exploring the Entrepreneurship Ecosystem',
  'Other',
]

interface Props {
  selectedTier: string
  onSelectTier?: (tier: string) => void
  onBackToComparison?: () => void
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

export default function StartupPassForm({
  selectedTier,
  onSelectTier,
  onBackToComparison,
}: Props) {
  const { user } = useAuth()

  const normalizedInitialTier = (
    selectedTier === 'diamond' || selectedTier === 'silver' ? selectedTier : 'gold'
  ) as 'silver' | 'gold' | 'diamond'

  const [form, setForm] = useState<StartupFormData>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    organization: '',
    motive: MOTIVE_OPTIONS[0],
    role: ROLE_OPTIONS[0],
    passTier: normalizedInitialTier,
  })

  const [submitState, setSubmitState] = useState<SubmitState>('idle')
  const [applicationId, setApplicationId] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string>('')

  // Sync when prop selectedTier changes
  useEffect(() => {
    if (selectedTier === 'diamond' || selectedTier === 'gold' || selectedTier === 'silver') {
      setForm((prev) => ({ ...prev, passTier: selectedTier as 'silver' | 'gold' | 'diamond' }))
    }
  }, [selectedTier])

  // Pre-fill user data if available
  useEffect(() => {
    const profile = getStoredProfile()
    setForm((prev) => ({
      ...prev,
      fullName: user?.displayName || profile?.name || prev.fullName,
      email: user?.email || profile?.email || prev.email,
      phone: profile?.phone || prev.phone,
      organization: profile?.college || prev.organization,
    }))
  }, [user])

  const selectedPkg =
    STARTUP_PACKAGES.find((p) => p.tier === form.passTier) ?? STARTUP_PACKAGES[1]

  const handleTierSwitch = (tier: 'silver' | 'gold' | 'diamond') => {
    setForm((prev) => ({ ...prev, passTier: tier }))
    if (onSelectTier) onSelectTier(tier)
  }

  const updateField = (key: keyof StartupFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.fullName.trim()) return toast.error('Full Name is required')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return toast.error('A valid email address is required')
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      return toast.error('A valid 10-digit phone number is required')
    }
    if (!form.linkedin.trim()) {
      return toast.error('LinkedIn Profile URL or ID is required')
    }
    if (!form.motive.trim()) {
      return toast.error('Please specify your primary motive')
    }
    if (!form.role.trim()) {
      return toast.error('Please select your role')
    }

    setSubmitState('submitting')
    setErrorMsg('')

    try {
      const payload = {
        fullName: form.fullName.trim(),
        founderName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        linkedin: form.linkedin.trim(),
        founderLinkedIn: form.linkedin.trim().startsWith('http')
          ? form.linkedin.trim()
          : `https://linkedin.com/in/${form.linkedin.trim().replace(/^@/, '')}`,
        organization: form.organization.trim(),
        startupName: form.organization.trim() || `${form.fullName.trim()}'s Venture`,
        motive: form.motive.trim(),
        role: form.role.trim(),
        passTier: form.passTier,
        passTierName: selectedPkg.name,
        passPrice: `${selectedPkg.price} + GST`,
        mouComfortable: 'Yes, I am comfortable with the fee for my selected option and can proceed after reviewing the MoU.',
        status: 'PENDING_REVIEW',
      }

      const res = await fetch('/api/funding-conclave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json().catch(() => ({ success: false }))

      if (res.ok && data.success) {
        setApplicationId(data.applicationId || `PEC-FC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`)
        setSubmitState('success')
        toast.success('Application registered successfully!')
      } else {
        throw new Error(data.error || 'Failed to submit application')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please try again.'
      setErrorMsg(msg)
      setSubmitState('error')
      toast.error(msg)
    }
  }

  const handleReset = () => {
    setSubmitState('idle')
    setErrorMsg('')
    setApplicationId('')
  }

  // ── Success State Screen ───────────────────────────────────────────────────
  if (submitState === 'success') {
    return (
      <motion.div
        id="startup-pass-form"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-panel border border-mint/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl max-w-3xl mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-mint" />
        </div>

        <div>
          <span className="font-mono-data text-xs font-bold uppercase tracking-[0.25em] text-mint">
            REGISTRATION RECEIVED
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-primary mt-2">
            YOU&apos;RE <span className="text-gradient-mint">PRE-REGISTERED!</span>
          </h2>
          <p className="text-secondary font-body text-sm max-w-lg mx-auto leading-relaxed mt-2">
            Thank you for applying for the <strong className="text-primary">{selectedPkg.name}</strong>. Our team will review your application details, shortlist you, and send an MoU.
          </p>
        </div>

        {applicationId && (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-mint/10 border border-mint/25">
            <span className="font-mono-data text-xs text-secondary uppercase tracking-wider">Application Ref:</span>
            <span className="font-mono-data font-black text-mint tracking-widest text-sm">{applicationId}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(applicationId)
                toast.success('Application ID copied!')
              }}
              aria-label="Copy Application ID"
              className="p-1.5 rounded-full hover:bg-mint/10 text-secondary hover:text-mint transition-colors cursor-pointer"
            >
              <Copy size={15} />
            </button>
          </div>
        )}

        <div className="p-5 rounded-2xl bg-panel-alt border border-border-subtle text-left max-w-lg mx-auto space-y-2 text-xs font-mono-data text-secondary">
          <div className="flex justify-between">
            <span className="text-muted">Selected Tier:</span>
            <span className="font-bold text-primary">{selectedPkg.name} ({selectedPkg.price})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Applicant:</span>
            <span className="font-bold text-primary">{form.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Role:</span>
            <span className="font-bold text-primary">{form.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Next Step:</span>
            <span className="font-bold text-mint">Team Review &amp; MoU Dispatch</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {onBackToComparison && (
            <button
              type="button"
              onClick={onBackToComparison}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-panel-alt border border-border-subtle text-secondary hover:text-primary font-mono-data text-xs font-bold uppercase tracking-wider transition-all cursor-pointer hover:border-mint"
            >
              <ArrowLeft size={14} />
              <span>Back to Packages</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-mint text-void font-mono-data text-xs font-black uppercase tracking-wider transition-all cursor-pointer hover:brightness-105 shadow-md"
          >
            <RotateCcw size={14} />
            <span>Submit Another</span>
          </button>
        </div>
      </motion.div>
    )
  }

  // ── Main Form Screen ───────────────────────────────────────────────────────
  return (
    <div id="startup-pass-form" className="w-full max-w-4xl mx-auto">
      <Toaster position="top-right" />

      <div className="rounded-3xl bg-panel border border-border-subtle p-6 sm:p-9 md:p-11 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-mint/5 blur-[100px] pointer-events-none rounded-full" />

        {/* Back Link */}
        {onBackToComparison && (
          <button
            type="button"
            onClick={onBackToComparison}
            className="inline-flex items-center gap-2 font-mono-data text-xs text-secondary hover:text-mint transition-colors mb-6 cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Packages Comparison</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-7">
          <span className="font-mono-data text-xs font-black uppercase tracking-[0.25em] text-mint flex items-center gap-1.5 mb-1.5">
            <Sparkles size={13} />
            PEC E-SUMMIT 2026 REGISTRATION
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-primary">
            Founders, Investors &amp; Professionals <span className="text-gradient-mint">Pass Application</span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed mt-2 max-w-2xl">
            Partner with E-Summit 2026 to showcase, network, hire, and collaborate. Our team will review your details, shortlist you, and send an MoU.
          </p>
        </div>

        {/* Tier Selector Ribbon */}
        <div className="mb-8 p-1.5 rounded-2xl bg-panel-alt border border-border-subtle flex flex-col sm:flex-row gap-2">
          {STARTUP_PACKAGES.map((pkg) => {
            const isSelected = form.passTier === pkg.tier
            let Icon = Shield
            if (pkg.tier === 'gold') Icon = Crown
            if (pkg.tier === 'diamond') Icon = Gem

            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => handleTierSwitch(pkg.tier)}
                className={`flex-1 flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-mint text-void font-black shadow-md'
                    : 'text-secondary hover:text-primary hover:bg-panel'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={17} className={isSelected ? 'text-void' : 'text-mint'} />
                  <div>
                    <div className="font-mono-data text-xs font-bold uppercase tracking-wider">
                      {pkg.name}
                    </div>
                    <div className={`text-[11px] font-mono-data ${isSelected ? 'text-void/80' : 'text-muted'}`}>
                      {pkg.price} + GST
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <span className="font-mono-data text-[10px] font-black uppercase px-2 py-0.5 rounded bg-void text-mint">
                    Selected
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
              Selected: {selectedPkg.name} — {selectedPkg.price} + GST
            </div>
            <p className="text-secondary font-body text-xs mt-0.5">
              {selectedPkg.tagline} Includes full access to sessions, networking lunch &amp; investor circles.
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
              <label htmlFor="startup-fullName" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Full Name <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="startup-fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="e.g. Aman Gupta"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="startup-email" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Email Address <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="startup-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="startup-phone" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Phone Number (WhatsApp) <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="startup-phone"
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
              <label htmlFor="startup-linkedin" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                LinkedIn Profile / ID <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Linkedin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="startup-linkedin"
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

          {/* Organization / Startup / Institute Name */}
          <div>
            <label htmlFor="startup-organization" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
              Organization / Startup / Institute Name
            </label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input
                id="startup-organization"
                type="text"
                value={form.organization}
                onChange={(e) => updateField('organization', e.target.value)}
                placeholder="e.g. NexaAI Labs / Peak Ventures"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm placeholder:text-muted transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Role at Event */}
            <div>
              <label htmlFor="startup-role" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                What is your role at the event? <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="startup-role"
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r} className="bg-panel text-primary">
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Package Choice Confirmation */}
            <div>
              <label htmlFor="startup-passTier" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Which package/pass are you choosing? <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <Gem size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="startup-passTier"
                  value={form.passTier}
                  onChange={(e) => handleTierSwitch(e.target.value as 'silver' | 'gold' | 'diamond')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-panel-alt border border-border-subtle focus:border-mint focus:outline-none text-primary font-body text-sm transition-colors cursor-pointer appearance-none"
                >
                  <option value="diamond" className="bg-panel text-primary">Diamond Pass (₹8,000 + GST)</option>
                  <option value="gold" className="bg-panel text-primary">Gold Pass (₹3,500 + GST)</option>
                  <option value="silver" className="bg-panel text-primary">Silver Pass (₹1,000 + GST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Primary Motive */}
          <div>
            <label htmlFor="startup-motive" className="block font-mono-data text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
              What is your primary motive for attending E-Summit 2026? <span className="text-mint">*</span>
            </label>
            <div className="relative">
              <Target size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <select
                id="startup-motive"
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
              className="w-full py-4 px-6 rounded-full bg-mint text-void font-mono-data text-xs sm:text-sm font-black uppercase tracking-wider cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitState === 'submitting' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Registering Application to Database...</span>
                </>
              ) : (
                <>
                  <span>Submit Application for {selectedPkg.name}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
            <p className="text-center font-mono-data text-[10px] text-muted uppercase tracking-wider mt-2.5">
              🔒 Form responses are saved directly to E-Summit database. Team will reach out with MoU.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
