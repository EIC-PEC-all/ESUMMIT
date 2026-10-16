'use client'

import React, { useState, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Building2,
  DollarSign,
  FileText,
  User,
  Calendar,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

interface FormData {
  email: string
  founderName: string
  phone: string
  founderLinkedIn: string
  startupName: string
  websiteUrl: string
  dpiitNumber: string
  stage: string
  sector: string
  revenueStage: string
  totalFundingRaised: string
  currentAsk: string
  preMoneyValuation: string
  committedCapital: string
  pitchDeckUrl: string
  demoVideoUrl: string
  mouComfortable: string
}

const INITIAL_FORM_DATA: FormData = {
  email: '',
  founderName: '',
  phone: '',
  founderLinkedIn: '',
  startupName: '',
  websiteUrl: '',
  dpiitNumber: '',
  stage: '',
  sector: '',
  revenueStage: '',
  totalFundingRaised: '',
  currentAsk: '',
  preMoneyValuation: '',
  committedCapital: '',
  pitchDeckUrl: '',
  demoVideoUrl: '',
  mouComfortable: '',
}

const STAGE_OPTIONS = [
  { id: 'Idea / concept', title: 'Idea / Concept', desc: 'Validating problem & early hypothesis' },
  { id: 'Prototype / MVP', title: 'Prototype / MVP', desc: 'Working prototype or proof of concept built' },
  { id: 'Pre-revenue / pilots', title: 'Pre-Revenue / Pilots', desc: 'Pilots running with initial users/partners' },
  { id: 'Early revenue', title: 'Early Revenue', desc: 'Commercial launch with paying customers' },
  { id: 'Product-market fit', title: 'Product-Market Fit', desc: 'Defensible PMF with solid retention metrics' },
  { id: 'Growth / scaling', title: 'Growth / Scaling', desc: 'Rapid growth, expanding go-to-market engine' },
]

const REVENUE_OPTIONS = [
  'Pre-revenue',
  'Under ₹10 lakh annual revenue',
  '₹10 lakh–₹50 lakh annual revenue',
  '₹50 lakh–₹1 crore annual revenue',
  'Over ₹1 crore annual revenue',
]

const MOU_OPTIONS = [
  {
    id: 'Yes, I am comfortable with the fee for my selected option and can proceed after reviewing the MoU.',
    label: 'Yes, I am comfortable with the fee for my selected option and can proceed after reviewing the MoU.',
  },
  {
    id: 'Not yet decided',
    label: 'Not yet decided',
  },
]

const STORAGE_KEY = 'pec_fc_application_draft'

export default function FundingConclaveClient() {
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submittedData, setSubmittedData] = useState<{ applicationId: string } | null>(null)
  const [copiedId, setCopiedId] = useState<boolean>(false)
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false)

  // Unique IDs for accessibility
  const emailId = useId()
  const founderNameId = useId()
  const phoneId = useId()
  const linkedInId = useId()
  const startupNameId = useId()
  const websiteUrlId = useId()
  const dpiitId = useId()
  const sectorId = useId()
  const totalFundingId = useId()
  const currentAskId = useId()
  const valuationId = useId()
  const committedCapitalId = useId()
  const pitchDeckId = useId()
  const demoVideoId = useId()

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({ ...prev, ...parsed }))
          setHasRestoredDraft(true)
        }
      }
    } catch {
      // LocalStorage access error ignored
    }
  }, [])

  // Auto-save draft changes
  useEffect(() => {
    if (!submittedData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      } catch {
        // Ignored
      }
    }
  }, [formData, submittedData])

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setFormData(INITIAL_FORM_DATA)
    setHasRestoredDraft(false)
    setStep(1)
    toast.success('Draft cleared')
  }

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return false
      }
      if (!formData.founderName.trim()) {
        toast.error('Primary founder full name is required')
        return false
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        toast.error('Please enter a valid mobile / WhatsApp number')
        return false
      }
      if (!formData.founderLinkedIn.trim()) {
        toast.error('Founder LinkedIn profile URL is required')
        return false
      }
    }

    if (currentStep === 2) {
      if (!formData.startupName.trim()) {
        toast.error('Startup name is required')
        return false
      }
      if (!formData.stage) {
        toast.error('Please select the current stage of your startup')
        return false
      }
      if (!formData.sector.trim()) {
        toast.error('Primary sector / industry is required')
        return false
      }
    }

    if (currentStep === 3) {
      if (!formData.revenueStage) {
        toast.error('Please select your current revenue stage')
        return false
      }
      if (!formData.totalFundingRaised.trim()) {
        toast.error('Total external funding is required (enter 0 if bootstrapped)')
        return false
      }
      if (!formData.currentAsk.trim()) {
        toast.error('Current fundraise ask is required (enter NA if not raising)')
        return false
      }
    }

    if (currentStep === 4) {
      if (!formData.pitchDeckUrl.trim() || !formData.pitchDeckUrl.startsWith('http')) {
        toast.error('Please provide a valid pitch deck URL (starting with http:// or https://)')
        return false
      }
      if (!formData.mouComfortable) {
        toast.error('Please answer the MoU participation fee question')
        return false
      }
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5))
      window.scrollTo({ top: 120, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 120, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/funding-conclave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSubmittedData({ applicationId: data.applicationId })
      localStorage.removeItem(STORAGE_KEY)
      toast.success('Application submitted successfully!')
      window.scrollTo({ top: 80, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyApplicationId = () => {
    if (submittedData?.applicationId) {
      navigator.clipboard.writeText(submittedData.applicationId)
      setCopiedId(true)
      toast.success('Application ID copied to clipboard')
      setTimeout(() => setCopiedId(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-deep text-primary pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#8AC53F]/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-[#A8EE4A]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#8AC53F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Festival Home
          </Link>

          {hasRestoredDraft && !submittedData && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8AC53F] flex items-center gap-1.5 bg-[#8AC53F]/10 border border-[#8AC53F]/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8AC53F] animate-pulse" />
                Draft restored
              </span>
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-[#64748B] hover:text-[#FF4D3D] transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Hero Banner Card */}
        <div className="mb-10 p-6 sm:p-8 rounded-2xl bg-[#081310] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#8AC53F]/10 blur-3xl pointer-events-none" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-[#8AC53F]/10 text-[#8AC53F] border border-[#8AC53F]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              INVESTOR ARENA
            </span>
            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#8AC53F]" />
              14–15 November 2026
            </span>
            <span className="text-xs text-[#94A3B8] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#8AC53F]" />
              Punjab Engineering College (Deemed to be University), Chandigarh
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            PEC E-Summit 2026 | Funding Conclave Startup Application
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-3xl mb-6">
            The Funding Conclave gives selected startups an opportunity to pitch before investors during PEC E-Summit 2026. Every application will be screened using the pitch deck, business quality, traction, fundraising readiness and investor fit. Submission of this form does not confirm selection.
          </p>

          {/* 5-Step Process Accordion / Guide */}
          <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/5 text-xs text-[#94A3B8]">
            <span className="font-semibold text-white uppercase tracking-wider block mb-2 font-mono text-[11px]">
              Registration process:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <div className="flex items-start gap-2 bg-[#081310] p-2.5 rounded-lg border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  1
                </span>
                <span>Select preferred option & submit startup details and pitch deck.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#081310] p-2.5 rounded-lg border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  2
                </span>
                <span>PEC Funding Conclave team will review application and pitch deck.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#081310] p-2.5 rounded-lg border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  3
                </span>
                <span>Shortlisted startups will receive an MoU.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#081310] p-2.5 rounded-lg border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  4
                </span>
                <span>Review & accept MoU; payment made directly to PEC bank account stated in MoU.</span>
              </div>
              <div className="flex items-start gap-2 bg-[#081310] p-2.5 rounded-lg border border-white/5">
                <span className="w-5 h-5 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                  5
                </span>
                <span>Registration is confirmed only after payment is received.</span>
              </div>
            </div>
          </div>
        </div>

        {/* If Application Submitted Successfully */}
        {submittedData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-12 rounded-2xl bg-[#081310] border border-[#8AC53F]/30 text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-full bg-[#8AC53F]/20 text-[#8AC53F] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#8AC53F] block mb-2">
              Application Received
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Application Submitted Successfully
            </h2>
            <p className="text-[#94A3B8] text-sm max-w-lg mx-auto mb-8">
              Thank you for applying to the PEC E-Summit 2026 Funding Conclave. Our screening team has received your
              submission and pitch deck.
            </p>

            <div className="max-w-md mx-auto p-5 rounded-xl bg-[#0D1C18] border border-white/10 mb-8 text-left">
              <span className="text-xs text-[#94A3B8] block mb-1">Your Application Reference ID:</span>
              <div className="flex items-center justify-between">
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#8AC53F]">
                  {submittedData.applicationId}
                </span>
                <button
                  type="button"
                  onClick={copyApplicationId}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 transition-colors flex items-center gap-1.5"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-[#8AC53F]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8AC53F] text-[#060D0B] font-semibold text-sm hover:bg-[#A8EE4A] transition-colors"
              >
                Return to E-Summit Home
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null)
                  setFormData(INITIAL_FORM_DATA)
                  setStep(1)
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 text-white font-medium text-sm hover:bg-white/10 border border-white/10 transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Step Progress Bar */}
            <div className="mb-8 p-4 rounded-xl bg-[#081310] border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-[#8AC53F] font-semibold">
                  STEP {step} OF 5: {step === 1 && 'FOUNDER DETAILS'}
                  {step === 2 && 'STARTUP PROFILE'}
                  {step === 3 && 'FINANCIALS & ASK'}
                  {step === 4 && 'PITCH DECK & MOU'}
                  {step === 5 && 'REVIEW & SUBMIT'}
                </span>
                <span className="text-[#94A3B8]">{Math.round((step / 5) * 100)}% COMPLETE</span>
              </div>
              <div className="w-full h-1.5 bg-[#0D1C18] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8AC53F] transition-all duration-300"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>

              {/* Step Pills */}
              <div className="grid grid-cols-5 gap-2 mt-4 text-center text-[11px]">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`py-1.5 px-1 rounded transition-colors ${
                    step === 1
                      ? 'text-[#8AC53F] font-semibold bg-[#8AC53F]/10'
                      : step > 1
                      ? 'text-white hover:text-[#8AC53F]'
                      : 'text-[#64748B]'
                  }`}
                >
                  1. Founder
                </button>
                <button
                  type="button"
                  onClick={() => validateStep(1) && setStep(2)}
                  className={`py-1.5 px-1 rounded transition-colors ${
                    step === 2
                      ? 'text-[#8AC53F] font-semibold bg-[#8AC53F]/10'
                      : step > 2
                      ? 'text-white hover:text-[#8AC53F]'
                      : 'text-[#64748B]'
                  }`}
                >
                  2. Startup
                </button>
                <button
                  type="button"
                  onClick={() => validateStep(1) && validateStep(2) && setStep(3)}
                  className={`py-1.5 px-1 rounded transition-colors ${
                    step === 3
                      ? 'text-[#8AC53F] font-semibold bg-[#8AC53F]/10'
                      : step > 3
                      ? 'text-white hover:text-[#8AC53F]'
                      : 'text-[#64748B]'
                  }`}
                >
                  3. Financials
                </button>
                <button
                  type="button"
                  onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && setStep(4)}
                  className={`py-1.5 px-1 rounded transition-colors ${
                    step === 4
                      ? 'text-[#8AC53F] font-semibold bg-[#8AC53F]/10'
                      : step > 4
                      ? 'text-white hover:text-[#8AC53F]'
                      : 'text-[#64748B]'
                  }`}
                >
                  4. Deck & MoU
                </button>
                <button
                  type="button"
                  onClick={() => validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4) && setStep(5)}
                  className={`py-1.5 px-1 rounded transition-colors ${
                    step === 5
                      ? 'text-[#8AC53F] font-semibold bg-[#8AC53F]/10'
                      : 'text-[#64748B]'
                  }`}
                >
                  5. Review
                </button>
              </div>
            </div>

            {/* Step Forms */}
            <div className="p-6 sm:p-10 rounded-2xl bg-[#081310] border border-white/10 shadow-xl">
              <AnimatePresence mode="wait">
                {/* STEP 1: Founder and Contact Details */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-[#8AC53F]" />
                        1. Founder and Contact Details
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Please enter the details of the founder who will coordinate directly with the PEC Funding Conclave team.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor={emailId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Email <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={emailId}
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="founder@yourstartup.com"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor={founderNameId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Primary founder’s full name <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={founderNameId}
                          type="text"
                          required
                          value={formData.founderName}
                          onChange={(e) => updateField('founderName', e.target.value)}
                          placeholder="e.g. Anand Dubey"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor={phoneId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Mobile / WhatsApp Number <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={phoneId}
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>

                      <div>
                        <label htmlFor={linkedInId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Founder LinkedIn Profile URL <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={linkedInId}
                          type="url"
                          required
                          value={formData.founderLinkedIn}
                          onChange={(e) => updateField('founderLinkedIn', e.target.value)}
                          placeholder="https://linkedin.com/in/foundername"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Startup Profile */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#8AC53F]" />
                        2. Startup Profile
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Help us understand your product, vision, and stage of development.
                      </p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div>
                        <label htmlFor={startupNameId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Startup name <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={startupNameId}
                          type="text"
                          required
                          value={formData.startupName}
                          onChange={(e) => updateField('startupName', e.target.value)}
                          placeholder="e.g. Acme Tech Labs"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={websiteUrlId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Startup website URL
                          </label>
                          <input
                            id={websiteUrlId}
                            type="url"
                            value={formData.websiteUrl}
                            onChange={(e) => updateField('websiteUrl', e.target.value)}
                            placeholder="https://acme.io"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor={dpiitId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            DPIIT recognition number, if applicable
                          </label>
                          <input
                            id={dpiitId}
                            type="text"
                            value={formData.dpiitNumber}
                            onChange={(e) => updateField('dpiitNumber', e.target.value)}
                            placeholder="e.g. DIPP12345"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                          Current stage of the startup <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {STAGE_OPTIONS.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => updateField('stage', opt.id)}
                              className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                formData.stage === opt.id
                                    ? 'bg-[#8AC53F]/10 border-[#8AC53F] text-white shadow-[0_0_15px_var(--border-glow)]'
                                  : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                  formData.stage === opt.id ? 'border-[#8AC53F] bg-[#8AC53F]' : 'border-white/30'
                                }`}
                              >
                                {formData.stage === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#060D0B]" />}
                              </div>
                              <div>
                                <span className="font-semibold text-sm block text-white">{opt.title}</span>
                                <span className="text-xs text-[#94A3B8]">{opt.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor={sectorId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Primary sector / industry <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={sectorId}
                          type="text"
                          required
                          value={formData.sector}
                          onChange={(e) => updateField('sector', e.target.value)}
                          placeholder="e.g. AI / DeepTech, SaaS, FinTech, CleanTech, HealthTech"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Financials and Fundraise */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#8AC53F]" />
                        3. Financials and Fundraise
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Commercial metrics and capital requirements for investor matching.
                      </p>
                    </div>

                    <div className="space-y-5 pt-2">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                          Current revenue stage <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <div className="space-y-2">
                          {REVENUE_OPTIONS.map((rev) => (
                            <button
                              key={rev}
                              type="button"
                              onClick={() => updateField('revenueStage', rev)}
                              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                                formData.revenueStage === rev
                                  ? 'bg-[#8AC53F]/10 border-[#8AC53F] text-white'
                                  : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  formData.revenueStage === rev ? 'border-[#8AC53F] bg-[#8AC53F]' : 'border-white/30'
                                }`}
                              >
                                {formData.revenueStage === rev && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#060D0B]" />
                                )}
                              </div>
                              <span className="text-sm font-medium">{rev}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={totalFundingId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Total external funding raised to date (in INR; enter 0 if bootstrapped) <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={totalFundingId}
                            type="text"
                            required
                            value={formData.totalFundingRaised}
                            onChange={(e) => updateField('totalFundingRaised', e.target.value)}
                            placeholder="in INR (enter 0 if bootstrapped)"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor={currentAskId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Current fundraise amount / ask (in INR; enter NA if not raising) <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={currentAskId}
                            type="text"
                            required
                            value={formData.currentAsk}
                            onChange={(e) => updateField('currentAsk', e.target.value)}
                            placeholder="in INR (enter NA if not raising)"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={valuationId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Expected pre-money valuation (in INR), if decided
                          </label>
                          <input
                            id={valuationId}
                            type="text"
                            value={formData.preMoneyValuation}
                            onChange={(e) => updateField('preMoneyValuation', e.target.value)}
                            placeholder="e.g. ₹5 Crore"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>

                        <div>
                          <label htmlFor={committedCapitalId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Capital already committed in the current round, if any
                          </label>
                          <input
                            id={committedCapitalId}
                            type="text"
                            value={formData.committedCapital}
                            onChange={(e) => updateField('committedCapital', e.target.value)}
                            placeholder="e.g. ₹25 Lakhs"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Pitch Deck and Event Participation */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#8AC53F]" />
                        4. Pitch Deck and Event Participation
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Upload your pitch deck link and confirm participation terms.
                      </p>
                    </div>

                    <div className="space-y-5 pt-2">
                      <div>
                        <label htmlFor={pitchDeckId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Pitch deck link (Google Drive, Dropbox, OneDrive or DocSend) <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <input
                          id={pitchDeckId}
                          type="url"
                          required
                          value={formData.pitchDeckUrl}
                          onChange={(e) => updateField('pitchDeckUrl', e.target.value)}
                          placeholder="https://drive.google.com/file/d/... or DocSend link"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                        <p className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-[#8AC53F]" />
                          Required for screening. PDF is preferred. Please ensure the link is accessible to anyone with the link and does not require an access request.
                        </p>
                      </div>

                      <div>
                        <label htmlFor={demoVideoId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                          Product demo / video link, if available
                        </label>
                        <input
                          id={demoVideoId}
                          type="url"
                          value={formData.demoVideoUrl}
                          onChange={(e) => updateField('demoVideoUrl', e.target.value)}
                          placeholder="https://youtube.com/... or Loom link"
                          className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#8AC53F] transition-colors"
                        />
                      </div>

                      <div className="pt-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                          If shortlisted, are you comfortable proceeding with the applicable participation fee after
                          reviewing the MoU? <span className="text-[#FF4D3D]">*</span>
                        </label>
                        <div className="space-y-2.5">
                          {MOU_OPTIONS.map((mou) => (
                            <button
                              key={mou.id}
                              type="button"
                              onClick={() => updateField('mouComfortable', mou.id)}
                              className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                                formData.mouComfortable === mou.id
                                  ? 'bg-[#8AC53F]/10 border-[#8AC53F] text-white shadow-[0_0_15px_var(--border-glow)]'
                                  : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                  formData.mouComfortable === mou.id
                                    ? 'border-[#8AC53F] bg-[#8AC53F]'
                                    : 'border-white/30'
                                }`}
                              >
                                {formData.mouComfortable === mou.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#060D0B]" />
                                )}
                              </div>
                              <span className="text-sm leading-relaxed">{mou.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Review & Submit */}
                {step === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#8AC53F]" />
                        5. Review & Final Confirmation
                      </h2>
                      <p className="text-xs text-[#94A3B8] mt-1">
                        Please verify your application details before final submission.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Summary Section 1 */}
                      <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-[#8AC53F] uppercase">Founder Details</span>
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-xs text-[#94A3B8] hover:text-[#8AC53F] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#64748B] block">Founder Name:</span>
                            <span className="text-white font-medium">{formData.founderName}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Email:</span>
                            <span className="text-white font-medium">{formData.email}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Mobile / WhatsApp:</span>
                            <span className="text-white font-medium">{formData.phone}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">LinkedIn:</span>
                            <a
                              href={formData.founderLinkedIn}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8AC53F] hover:underline flex items-center gap-1 truncate"
                            >
                              {formData.founderLinkedIn}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Summary Section 2 */}
                      <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-[#8AC53F] uppercase">Startup Profile</span>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="text-xs text-[#94A3B8] hover:text-[#8AC53F] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#64748B] block">Startup Name:</span>
                            <span className="text-white font-medium">{formData.startupName}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Sector:</span>
                            <span className="text-white font-medium">{formData.sector}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Current Stage:</span>
                            <span className="text-white font-medium">{formData.stage}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Website:</span>
                            <span className="text-white font-medium">{formData.websiteUrl || 'N/A'}</span>
                          </div>
                          {formData.dpiitNumber && (
                            <div>
                              <span className="text-[#64748B] block">DPIIT Number:</span>
                              <span className="text-white font-medium">{formData.dpiitNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary Section 3 */}
                      <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-[#8AC53F] uppercase">
                            Financials & Ask
                          </span>
                          <button
                            type="button"
                            onClick={() => setStep(3)}
                            className="text-xs text-[#94A3B8] hover:text-[#8AC53F] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[#64748B] block">Revenue Stage:</span>
                            <span className="text-white font-medium">{formData.revenueStage}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Total Raised to Date:</span>
                            <span className="text-white font-medium">{formData.totalFundingRaised}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Current Ask:</span>
                            <span className="text-white font-medium">{formData.currentAsk}</span>
                          </div>
                          <div>
                            <span className="text-[#64748B] block">Pre-Money Valuation:</span>
                            <span className="text-white font-medium">{formData.preMoneyValuation || 'N/A'}</span>
                          </div>
                          {formData.committedCapital && (
                            <div>
                              <span className="text-[#64748B] block">Capital Committed:</span>
                              <span className="text-white font-medium">{formData.committedCapital}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary Section 4 */}
                      <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-mono font-bold text-[#8AC53F] uppercase">Pitch Deck & MoU</span>
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="text-xs text-[#94A3B8] hover:text-[#8AC53F] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[#64748B] block">Pitch Deck Link:</span>
                            <a
                              href={formData.pitchDeckUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#8AC53F] hover:underline flex items-center gap-1 truncate"
                            >
                              {formData.pitchDeckUrl}
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>
                          {formData.demoVideoUrl && (
                            <div>
                              <span className="text-[#64748B] block">Demo Video URL:</span>
                              <a
                                href={formData.demoVideoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#8AC53F] hover:underline flex items-center gap-1 truncate"
                              >
                                {formData.demoVideoUrl}
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            </div>
                          )}
                          <div>
                            <span className="text-[#64748B] block">MoU Readiness:</span>
                            <span className="text-white font-medium">{formData.mouComfortable}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm border border-white/10 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-[#8AC53F] hover:bg-[#A8EE4A] text-[#060D0B] font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_var(--border-glow)]"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl bg-[#8AC53F] hover:bg-[#A8EE4A] disabled:opacity-50 text-[#060D0B] font-bold text-sm transition-colors flex items-center gap-2 shadow-[0_0_25px_var(--border-glow)]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#060D0B] border-t-transparent rounded-full animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm & Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
