'use client'

import React, { useState, useEffect, useId, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  CheckCircle2,
  Gem,
  Crown,
  Shield,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  DollarSign,
  FileText,
  User,
  Copy,
  RotateCcw,
  ExternalLink,
  Info,
  ShieldCheck,
  AlertCircle,
  LogIn,
  KeyRound,
  GraduationCap,
  Lock,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import OnboardingModal from '@/components/Onboarding/OnboardingModal'
import {
  AttendeeProfile,
  getStoredProfile,
  isOnboardingComplete,
  PROFILE_UPDATED_EVENT,
} from '@/lib/onboarding'
import { STARTUP_PACKAGES, StartupPassPackage } from '@/components/Passes/passesData'

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

const STORAGE_KEY = 'pec_startup_pass_draft'

export default function PassesClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Pre-select pass tier based on URL query (?tier=silver|gold|diamond)
  const tierParam = searchParams.get('tier')?.toLowerCase()
  const initialTier = useMemo(() => {
    if (tierParam === 'silver' || tierParam === 'gold' || tierParam === 'diamond') {
      return tierParam
    }
    return 'gold' // Default recommended tier
  }, [tierParam])

  const [selectedTier, setSelectedTier] = useState<string>(initialTier)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [formStep, setFormStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submittedData, setSubmittedData] = useState<{ applicationId: string; passName: string; passPrice: string } | null>(null)
  const [copiedId, setCopiedId] = useState<boolean>(false)
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false)

  // Auth and Onboarding Integration
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<AttendeeProfile | null>(null)
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false)
  const [authEmail, setAuthEmail] = useState<string>('')
  const [authPassword, setAuthPassword] = useState<string>('')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isAuthSubmitting, setIsAuthSubmitting] = useState<boolean>(false)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
    const p = getStoredProfile()
    setProfile(p)

    const handleProfileUpdate = () => {
      setProfile(getStoredProfile())
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
    window.addEventListener('storage', handleProfileUpdate)

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
      window.removeEventListener('storage', handleProfileUpdate)
    }
  }, [])

  // Auto-fill founder details from verified attendee profile
  useEffect(() => {
    if (profile || user) {
      setFormData((prev) => ({
        ...prev,
        founderName: prev.founderName || profile?.name || user?.displayName || '',
        email: prev.email || profile?.email || user?.email || '',
        phone: prev.phone || profile?.phone || '',
      }))
    }
  }, [profile, user])

  const isUserAuthenticated = Boolean(user)
  const isAttendeeOnboarded = Boolean(user) && isOnboardingComplete(profile)

  const handleGoogleSignIn = async () => {
    setIsAuthSubmitting(true)
    const res = await loginWithGoogle()
    setIsAuthSubmitting(false)
    if (res.success) {
      toast.success('Signed in with Google!')
      const p = getStoredProfile()
      if (!isOnboardingComplete(p)) {
        setShowOnboardingModal(true)
      }
    } else {
      toast.error(res.error || 'Google sign-in was cancelled.')
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authEmail.trim() || !authPassword.trim()) {
      toast.error('Please enter email and password.')
      return
    }
    setIsAuthSubmitting(true)
    const res =
      authMode === 'signup'
        ? await registerWithEmail(authEmail.trim(), authPassword)
        : await loginWithEmail(authEmail.trim(), authPassword)
    setIsAuthSubmitting(false)
    if (res.success) {
      toast.success(authMode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!')
      const p = getStoredProfile()
      if (!isOnboardingComplete(p)) {
        setShowOnboardingModal(true)
      }
    } else {
      toast.error(res.error || 'Authentication failed. Please check credentials.')
    }
  }

  // Unique IDs for form inputs
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

  // Keep state synced with URL param if it changes
  useEffect(() => {
    if (tierParam && (tierParam === 'silver' || tierParam === 'gold' || tierParam === 'diamond')) {
      setSelectedTier(tierParam)
    }
  }, [tierParam])

  // Restore draft from localStorage
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
      // Ignored
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

  const selectedPackage = useMemo(() => {
    return STARTUP_PACKAGES.find((p) => p.tier === selectedTier) || STARTUP_PACKAGES[1]
  }, [selectedTier])

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier)
    router.replace(`/passes?tier=${tier}`, { scroll: false })
    toast.success(`Selected ${tier.toUpperCase()} PASS`)
  }

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY)
    setFormData(INITIAL_FORM_DATA)
    setHasRestoredDraft(false)
    setFormStep(1)
    toast.success('Form draft reset')
  }

  // Strict Validation Rules
  const validateCurrentStep = (stepNumber: number): boolean => {
    if (stepNumber === 1) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!formData.email || !emailRegex.test(formData.email.trim())) {
        toast.error('Please enter a valid email address (e.g., name@domain.com)')
        return false
      }
      if (!formData.founderName.trim() || formData.founderName.trim().length < 2) {
        toast.error('Founder name must be at least 2 characters')
        return false
      }
      const digitsOnly = formData.phone.replace(/\D/g, '')
      if (digitsOnly.length < 10) {
        toast.error('Mobile / WhatsApp number must be at least 10 digits')
        return false
      }
      if (!formData.founderLinkedIn.trim() || !formData.founderLinkedIn.includes('linkedin.com/')) {
        toast.error('Please provide a valid LinkedIn profile URL (containing linkedin.com/)')
        return false
      }
    }

    if (stepNumber === 2) {
      if (!formData.startupName.trim() || formData.startupName.trim().length < 2) {
        toast.error('Startup name is required (min 2 characters)')
        return false
      }
      if (formData.websiteUrl.trim() && !formData.websiteUrl.startsWith('http://') && !formData.websiteUrl.startsWith('https://')) {
        toast.error('Website URL must start with http:// or https://')
        return false
      }
      if (!formData.stage) {
        toast.error('Please select the current stage of your startup')
        return false
      }
      if (!formData.sector.trim()) {
        toast.error('Primary industry sector is required')
        return false
      }
    }

    if (stepNumber === 3) {
      if (!formData.revenueStage) {
        toast.error('Please select your current annual revenue stage')
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

    if (stepNumber === 4) {
      if (!formData.pitchDeckUrl.trim() || (!formData.pitchDeckUrl.startsWith('http://') && !formData.pitchDeckUrl.startsWith('https://'))) {
        toast.error('Please provide a valid pitch deck URL starting with http:// or https://')
        return false
      }
      if (!formData.mouComfortable) {
        toast.error('Please answer the participation fee and MoU readiness question')
        return false
      }
    }

    return true
  }

  const handleNextStep = () => {
    if (validateCurrentStep(formStep)) {
      setFormStep((prev) => Math.min(prev + 1, 5))
      const formEl = document.getElementById('startup-pass-form')
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handlePrevStep = () => {
    setFormStep((prev) => Math.max(prev - 1, 1))
    const formEl = document.getElementById('startup-pass-form')
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Submission directly to CMS without Razorpay
  const handleSubmitApplication = async () => {
    if (!isUserAuthenticated || !isAttendeeOnboarded) {
      toast.error('You must sign in and complete attendee onboarding before applying for passes.')
      if (isUserAuthenticated && !isAttendeeOnboarded) {
        setShowOnboardingModal(true)
      }
      return
    }

    if (!validateCurrentStep(4)) return

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        passTier: selectedPackage.tier,
        passTierName: selectedPackage.name,
        passPrice: `${selectedPackage.price} ${selectedPackage.gstText}`,
      }

      const res = await fetch('/api/funding-conclave/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application')
      }

      setSubmittedData({
        applicationId: data.applicationId,
        passName: selectedPackage.name,
        passPrice: `${selectedPackage.price} ${selectedPackage.gstText}`,
      })
      localStorage.removeItem(STORAGE_KEY)
      toast.success('Application submitted! We will contact you ASAP for further processing.', {
        duration: 6000,
      })
      window.scrollTo({ top: 100, behavior: 'smooth' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Submission failed'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyAppId = () => {
    if (submittedData?.applicationId) {
      navigator.clipboard.writeText(submittedData.applicationId)
      setCopiedId(true)
      toast.success('Application ID copied')
      setTimeout(() => setCopiedId(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#060D0B] text-white pt-24 pb-20 px-4 sm:px-6 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#00F5D4]/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00F5D4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {hasRestoredDraft && !submittedData && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#00F5D4] flex items-center gap-1.5 bg-[#00F5D4]/10 border border-[#00F5D4]/20 px-2.5 py-1 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
                Draft restored
              </span>
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-[#64748B] hover:text-[#FF4D3D] transition-colors flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F5D4]/10 border border-[#00F5D4]/30 text-[#00F5D4] font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            STARTUP PASS PACKAGES
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Choose Your Startup Pass &amp; Apply
          </h1>
          <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Passes are exclusively for startup founders and teams. Select your preferred tier below to begin your
            application. Once screened, our team will issue an official MoU and provide direct payment details.
          </p>
        </div>

        {/* ── 1. PASSES OPTIONS GRID (ABOVE) ── */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8] font-bold">
              1. Available Pass Tiers (Click to select)
            </span>
            <span className="text-xs font-mono text-[#00F5D4] font-semibold">
              Currently Selected: {selectedPackage.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STARTUP_PACKAGES.map((pkg) => {
              const isSelected = selectedTier === pkg.tier
              const IconComp = pkg.tier === 'diamond' ? Gem : pkg.tier === 'gold' ? Crown : Shield

              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectTier(pkg.tier)}
                  className={`relative cursor-pointer rounded-3xl p-6 sm:p-7 transition-all duration-300 border-2 flex flex-col justify-between ${
                    isSelected
                      ? `${pkg.accentColor.cardBg} ${pkg.accentColor.border} scale-[1.02] shadow-[0_0_30px_rgba(0,245,212,0.15)] ring-2 ring-[#00F5D4]/40`
                      : 'bg-[#081310] border-white/10 hover:border-white/20 hover:-translate-y-1 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Selected Pill Badge */}
                  {isSelected && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00F5D4] text-[#060D0B] font-mono text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Selected Pass
                    </div>
                  )}

                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${pkg.accentColor.iconBg}`}
                      >
                        <IconComp size={20} className={pkg.accentColor.iconColor} strokeWidth={2.4} />
                      </div>

                      <span
                        className={`font-mono text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${pkg.accentColor.badgeBg}`}
                      >
                        {pkg.badgeText}
                      </span>
                    </div>

                    <h3 className={`font-black text-2xl uppercase tracking-tight mb-2 ${pkg.accentColor.titleColor}`}>
                      {pkg.name}
                    </h3>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`font-black text-4xl sm:text-5xl tracking-tight ${pkg.accentColor.priceColor}`}>
                        {pkg.price}
                      </span>
                      <span className="font-mono text-xs text-gray-300 font-bold uppercase tracking-wider">
                        {pkg.gstText}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-5">
                      {pkg.tagline}
                    </p>

                    {/* Deliverables summary */}
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8] block mb-1">
                        Key Deliverables Included:
                      </span>
                      {pkg.deliverables.slice(0, 4).map((d, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#00F5D4] shrink-0 mt-0.5" />
                          <span className="leading-tight">{d.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selection Button */}
                  <div className="pt-6">
                    <button
                      type="button"
                      className={`w-full py-3 rounded-full font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-transform ${
                        isSelected ? pkg.accentColor.buttonBg : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span>{isSelected ? `Active: ${pkg.name.split(' ')[0]}` : `Select ${pkg.name.split(' ')[0]}`}</span>
                      <ArrowRight size={14} className="stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── 2. PROCESS & DIRECT PAYMENT NOTICE ── */}
        <div className="p-5 rounded-2xl bg-[#081310] border border-[#00F5D4]/20 mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00F5D4]/10 text-[#00F5D4] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Direct CMS Screening Flow — No Third-Party Payment Gateway
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                Your application is saved directly to the PEC CMS. Once screened by the investor committee, shortlisted
                founders receive an official MoU with verified bank details for direct transfer.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-[#00F5D4] bg-[#00F5D4]/10 px-3 py-1.5 rounded-lg border border-[#00F5D4]/20 whitespace-nowrap">
            Selected Tier: {selectedPackage.name} ({selectedPackage.price})
          </div>
        </div>

        {/* ── 3. APPLICATION FORM OR SUCCESS SCREEN ── */}
        <div id="startup-pass-form">
          {submittedData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 rounded-3xl bg-[#081310] border border-[#00F5D4]/30 text-center relative overflow-hidden shadow-2xl max-w-3xl mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-[#00F5D4]/20 text-[#00F5D4] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] block mb-2">
                Application Received Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                We will contact you ASAP for further processing
              </h2>
              <p className="text-[#94A3B8] text-sm max-w-lg mx-auto mb-6">
                Thank you for applying for the <span className="text-white font-bold">{submittedData.passName}</span> ({submittedData.passPrice}). Your submission has been securely recorded in our system. Our team will contact you ASAP for further processing and payment steps.
              </p>

              <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#0D1C18] border border-white/10 mb-8 text-left">
                <span className="text-xs text-[#94A3B8] block mb-1">Your Application Reference ID:</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-[#00F5D4]">
                    {submittedData.applicationId}
                  </span>
                  <button
                    type="button"
                    onClick={copyAppId}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-[#00F5D4]" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="p-4 rounded-xl bg-[#060D0B] border border-white/10 text-left max-w-md mx-auto text-xs text-[#94A3B8] mb-8 space-y-2.5 font-mono">
                <div className="text-white font-bold uppercase text-[11px] mb-1">What Happens Next:</div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00F5D4] font-bold">1.</span>
                  <span>Our organizing team will contact you ASAP on your phone/WhatsApp and email.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00F5D4] font-bold">2.</span>
                  <span>We will share the official MoU and guide you through the direct payment process.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#00F5D4] font-bold">3.</span>
                  <span>Once confirmed, your official pass credentials and summit perks are activated.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00F5D4] text-[#060D0B] font-bold text-sm hover:bg-[#00DFBA] transition-colors"
                >
                  Return to Home
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedData(null)
                    setFormData(INITIAL_FORM_DATA)
                    setFormStep(1)
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 text-white font-medium text-sm hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            </motion.div>
          ) : !isClient || authLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#00F5D4] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs font-mono text-[#94A3B8]">Verifying attendee onboarding status...</span>
            </div>
          ) : !isUserAuthenticated ? (
            /* ── AUTHENTICATION REQUIRED CARD ── */
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#081310] border border-white/10 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#00F5D4]/10 text-[#00F5D4] flex items-center justify-center mx-auto mb-5 border border-[#00F5D4]/20">
                <LogIn className="w-7 h-7 stroke-[2.2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F5D4] font-bold block mb-1">
                Step 1: Sign In Required
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign In to Apply for Startup Passes
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-6 max-w-md mx-auto">
                To prevent spam and ensure verified founder profiles, attendees must sign in with their summit account before applying for passes.
              </p>

              {/* Quick Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthSubmitting}
                className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-neutral-100 text-[#060D0B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-[10px] font-mono text-[#64748B] uppercase">Or with Email</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="founder@startup.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1C18] border border-white/10 text-white text-xs outline-none focus:border-[#00F5D4]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#94A3B8] uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1C18] border border-white/10 text-white text-xs outline-none focus:border-[#00F5D4]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthSubmitting}
                    className="w-full py-3 rounded-xl bg-[#00F5D4] text-[#060D0B] font-bold text-xs uppercase tracking-wider hover:bg-[#00DFBA] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isAuthSubmitting ? (
                      <div className="w-4 h-4 border-2 border-[#060D0B] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <KeyRound className="w-3.5 h-3.5" />
                    )}
                    <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  </button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode((prev) => (prev === 'signin' ? 'signup' : 'signin'))}
                    className="text-xs text-[#94A3B8] hover:text-[#00F5D4] transition-colors cursor-pointer"
                  >
                    {authMode === 'signin'
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </div>
          ) : !isAttendeeOnboarded ? (
            /* ── ONBOARDING REQUIRED CARD ── */
            <div className="max-w-xl mx-auto p-8 rounded-3xl bg-[#081310] border border-amber-500/30 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/20">
                <GraduationCap className="w-7 h-7 stroke-[2.2]" />
              </div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                Profile Onboarding Required
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">
                Complete Your Attendee Onboarding
              </h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-6 max-w-md mx-auto">
                Welcome, <span className="text-white font-semibold">{user?.displayName || user?.email}</span>! Pass applications require a completed attendee profile with your institution/organization, location, and graduation batch.
              </p>

              <button
                type="button"
                onClick={() => setShowOnboardingModal(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer shadow-lg active:scale-[0.98]"
              >
                <span>Complete Onboarding Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {/* Verified Attendee Badge */}
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Attendee Onboarding Verified: {profile?.name || user?.displayName}
                    </span>
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      {profile?.college || 'PEC'} • {profile?.city ? `${profile.city}, ` : ''}{profile?.state || ''} • {profile?.gradYear || ''}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(true)}
                  className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                >
                  Edit Profile
                </button>
              </div>

              {/* Form Step Progress Bar */}
              <div className="mb-8 p-4 rounded-2xl bg-[#081310] border border-white/10">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-[#00F5D4] font-semibold">
                    FORM STEP {formStep} OF 5: {formStep === 1 && 'FOUNDER & CONTACT'}
                    {formStep === 2 && 'STARTUP PROFILE'}
                    {formStep === 3 && 'FINANCIALS & ASK'}
                    {formStep === 4 && 'PITCH DECK & MOU'}
                    {formStep === 5 && 'REVIEW & CMS SUBMISSION'}
                  </span>
                  <span className="text-[#94A3B8]">{Math.round((formStep / 5) * 100)}% COMPLETE</span>
                </div>

                <div className="w-full h-1.5 bg-[#0D1C18] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00F5D4] transition-all duration-300"
                    style={{ width: `${(formStep / 5) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-2 mt-4 text-center text-[11px] font-mono">
                  {[
                    { num: 1, label: 'Founder' },
                    { num: 2, label: 'Startup' },
                    { num: 3, label: 'Financials' },
                    { num: 4, label: 'Pitch Deck' },
                    { num: 5, label: 'Review' },
                  ].map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => {
                        if (s.num < formStep) setFormStep(s.num)
                      }}
                      className={`py-1.5 rounded transition-colors ${
                        formStep === s.num
                          ? 'text-[#00F5D4] font-bold bg-[#00F5D4]/10'
                          : formStep > s.num
                          ? 'text-white'
                          : 'text-[#64748B]'
                      }`}
                    >
                      {s.num}. {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Card */}
              <div className="p-6 sm:p-10 rounded-3xl bg-[#081310] border border-white/10 shadow-2xl">
                {/* Active Package Banner */}
                <div className="mb-8 p-4 rounded-xl bg-[#0D1C18] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F5D4]/10 text-[#00F5D4] flex items-center justify-center font-bold">
                      ✓
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Selected Tier</span>
                      <span className="text-sm font-bold text-white">{selectedPackage.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">Price</span>
                    <span className="text-sm font-bold text-[#00F5D4]">
                      {selectedPackage.price} {selectedPackage.gstText}
                    </span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: Founder and Contact Details */}
                  {formStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <User className="w-5 h-5 text-[#00F5D4]" />
                          1. Founder and Contact Details
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Primary founder details for coordination and official MoU delivery.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label htmlFor={emailId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Email Address <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={emailId}
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="founder@yourstartup.com"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
                          />
                        </div>

                        <div>
                          <label htmlFor={founderNameId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Primary Founder Full Name <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={founderNameId}
                            type="text"
                            required
                            value={formData.founderName}
                            onChange={(e) => updateField('founderName', e.target.value)}
                            placeholder="e.g. Manan Gupta"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
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
                            placeholder="+91 98765 43210 (10 digits)"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
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
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Startup Profile */}
                  {formStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#00F5D4]" />
                          2. Startup Profile
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Product positioning, category, and stage of venture development.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div>
                          <label htmlFor={startupNameId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Startup Name <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={startupNameId}
                            type="text"
                            required
                            value={formData.startupName}
                            onChange={(e) => updateField('startupName', e.target.value)}
                            placeholder="e.g. Apex AI Systems"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={websiteUrlId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                              Website URL <span className="text-[#64748B]">(optional)</span>
                            </label>
                            <input
                              id={websiteUrlId}
                              type="url"
                              value={formData.websiteUrl}
                              onChange={(e) => updateField('websiteUrl', e.target.value)}
                              placeholder="https://apexai.io"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
                            />
                          </div>

                          <div>
                            <label htmlFor={dpiitId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                              DPIIT Recognition Number <span className="text-[#64748B]">(if applicable)</span>
                            </label>
                            <input
                              id={dpiitId}
                              type="text"
                              value={formData.dpiitNumber}
                              onChange={(e) => updateField('dpiitNumber', e.target.value)}
                              placeholder="e.g. DIPP12345"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                            Current Stage of the Startup <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {STAGE_OPTIONS.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => updateField('stage', opt.id)}
                                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                                  formData.stage === opt.id
                                    ? 'bg-[#00F5D4]/10 border-[#00F5D4] text-white shadow-[0_0_15px_rgba(0,245,212,0.15)]'
                                    : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                    formData.stage === opt.id ? 'border-[#00F5D4] bg-[#00F5D4]' : 'border-white/30'
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
                            Primary Sector / Industry <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={sectorId}
                            type="text"
                            required
                            value={formData.sector}
                            onChange={(e) => updateField('sector', e.target.value)}
                            placeholder="e.g. AI / DeepTech, SaaS, FinTech, CleanTech"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Financials and Fundraise */}
                  {formStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-[#00F5D4]" />
                          3. Financials and Fundraise
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Key commercial numbers to help investors evaluate ticket sizes and valuation fit.
                        </p>
                      </div>

                      <div className="space-y-5 pt-2">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-2">
                            Current Revenue Stage <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <div className="space-y-2">
                            {REVENUE_OPTIONS.map((rev) => (
                              <button
                                key={rev}
                                type="button"
                                onClick={() => updateField('revenueStage', rev)}
                                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                                  formData.revenueStage === rev
                                    ? 'bg-[#00F5D4]/10 border-[#00F5D4] text-white'
                                    : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    formData.revenueStage === rev ? 'border-[#00F5D4] bg-[#00F5D4]' : 'border-white/30'
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
                              Total External Funding Raised (INR) <span className="text-[#FF4D3D]">*</span>
                            </label>
                            <input
                              id={totalFundingId}
                              type="text"
                              required
                              value={formData.totalFundingRaised}
                              onChange={(e) => updateField('totalFundingRaised', e.target.value)}
                              placeholder="in INR (enter 0 if bootstrapped)"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                            />
                          </div>

                          <div>
                            <label htmlFor={currentAskId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                              Current Fundraise Ask (INR) <span className="text-[#FF4D3D]">*</span>
                            </label>
                            <input
                              id={currentAskId}
                              type="text"
                              required
                              value={formData.currentAsk}
                              onChange={(e) => updateField('currentAsk', e.target.value)}
                              placeholder="in INR (enter NA if not raising)"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={valuationId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                              Expected Pre-Money Valuation (INR) <span className="text-[#64748B]">(if decided)</span>
                            </label>
                            <input
                              id={valuationId}
                              type="text"
                              value={formData.preMoneyValuation}
                              onChange={(e) => updateField('preMoneyValuation', e.target.value)}
                              placeholder="e.g. ₹10 Crore"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                            />
                          </div>

                          <div>
                            <label htmlFor={committedCapitalId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                              Capital Already Committed <span className="text-[#64748B]">(if any)</span>
                            </label>
                            <input
                              id={committedCapitalId}
                              type="text"
                              value={formData.committedCapital}
                              onChange={(e) => updateField('committedCapital', e.target.value)}
                              placeholder="e.g. ₹20 Lakhs"
                              className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Pitch Deck and Event Participation */}
                  {formStep === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#00F5D4]" />
                          4. Pitch Deck and Participation Terms
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Share your deck link and confirm participation readiness.
                        </p>
                      </div>

                      <div className="space-y-5 pt-2">
                        <div>
                          <label htmlFor={pitchDeckId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Pitch Deck Link <span className="text-[#FF4D3D]">*</span>
                          </label>
                          <input
                            id={pitchDeckId}
                            type="url"
                            required
                            value={formData.pitchDeckUrl}
                            onChange={(e) => updateField('pitchDeckUrl', e.target.value)}
                            placeholder="https://drive.google.com/file/... or DocSend link"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
                          />
                          <p className="text-[11px] text-[#94A3B8] mt-1.5 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-[#00F5D4]" />
                            Required for screening. Please ensure the link is publicly accessible (Anyone with link can view).
                          </p>
                        </div>

                        <div>
                          <label htmlFor={demoVideoId} className="block text-xs font-mono uppercase tracking-wider text-[#94A3B8] mb-1.5">
                            Product Demo / Video Link <span className="text-[#64748B]">(if available)</span>
                          </label>
                          <input
                            id={demoVideoId}
                            type="url"
                            value={formData.demoVideoUrl}
                            onChange={(e) => updateField('demoVideoUrl', e.target.value)}
                            placeholder="https://youtube.com/... or Loom video"
                            className="w-full px-4 py-3 rounded-xl bg-[#0D1C18] border border-white/10 text-white placeholder-[#64748B] focus:outline-none focus:border-[#00F5D4] transition-colors text-sm font-mono"
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
                                    ? 'bg-[#00F5D4]/10 border-[#00F5D4] text-white shadow-[0_0_15px_rgba(0,245,212,0.1)]'
                                    : 'bg-[#0D1C18] border-white/10 text-[#94A3B8] hover:border-white/20 hover:text-white'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                                    formData.mouComfortable === mou.id
                                      ? 'border-[#00F5D4] bg-[#00F5D4]'
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

                  {/* STEP 5: Review & Confirm */}
                  {formStep === 5 && (
                    <motion.div
                      key="step-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-[#00F5D4]" />
                          5. Final Review &amp; CMS Submission
                        </h3>
                        <p className="text-xs text-[#94A3B8] mt-1">
                          Review all entered information before logging your startup into our CMS.
                        </p>
                      </div>

                      <div className="space-y-4 text-xs">
                        {/* Selected Pass Summary */}
                        <div className="p-4 rounded-xl bg-[#00F5D4]/10 border border-[#00F5D4]/30 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#00F5D4] block font-bold">
                              Chosen Pass Package
                            </span>
                            <span className="text-base font-extrabold text-white">{selectedPackage.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-mono font-bold text-[#00F5D4]">
                              {selectedPackage.price} {selectedPackage.gstText}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] block">Payable after MoU review</span>
                          </div>
                        </div>

                        {/* Founder Summary */}
                        <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-[#00F5D4] uppercase">Founder &amp; Contact</span>
                            <button
                              type="button"
                              onClick={() => setFormStep(1)}
                              className="text-[#94A3B8] hover:text-[#00F5D4] transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#94A3B8]">
                            <div>Name: <span className="text-white font-medium">{formData.founderName}</span></div>
                            <div>Email: <span className="text-white font-medium">{formData.email}</span></div>
                            <div>Phone: <span className="text-white font-medium font-mono">{formData.phone}</span></div>
                            <div>LinkedIn: <a href={formData.founderLinkedIn} target="_blank" rel="noopener noreferrer" className="text-[#00F5D4] hover:underline truncate inline-block max-w-[200px]">Link</a></div>
                          </div>
                        </div>

                        {/* Startup Summary */}
                        <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-[#00F5D4] uppercase">Startup Profile</span>
                            <button
                              type="button"
                              onClick={() => setFormStep(2)}
                              className="text-[#94A3B8] hover:text-[#00F5D4] transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#94A3B8]">
                            <div>Name: <span className="text-white font-medium">{formData.startupName}</span></div>
                            <div>Stage: <span className="text-white font-medium">{formData.stage}</span></div>
                            <div>Sector: <span className="text-white font-medium">{formData.sector}</span></div>
                            <div>Website: <span className="text-white font-medium">{formData.websiteUrl || 'N/A'}</span></div>
                          </div>
                        </div>

                        {/* Financials Summary */}
                        <div className="p-4 rounded-xl bg-[#0D1C18] border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono font-bold text-[#00F5D4] uppercase">Financials &amp; Deck</span>
                            <button
                              type="button"
                              onClick={() => setFormStep(3)}
                              className="text-[#94A3B8] hover:text-[#00F5D4] transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#94A3B8]">
                            <div>Revenue: <span className="text-white font-medium">{formData.revenueStage}</span></div>
                            <div>Ask: <span className="text-[#00F5D4] font-medium font-mono">{formData.currentAsk}</span></div>
                            <div>Raised: <span className="text-white font-medium font-mono">{formData.totalFundingRaised}</span></div>
                            <div>Deck: <a href={formData.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-[#00F5D4] hover:underline">View Link</a></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Navigation Buttons */}
                <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
                  {formStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm border border-white/10 transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {formStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2.5 rounded-xl bg-[#00F5D4] hover:bg-[#00DFBA] text-[#060D0B] font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitApplication}
                      className="px-8 py-3.5 rounded-xl bg-[#00F5D4] hover:bg-[#00DFBA] disabled:opacity-50 text-[#060D0B] font-bold text-sm transition-colors flex items-center gap-2 shadow-[0_0_25px_rgba(0,245,212,0.3)]"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#060D0B] border-t-transparent rounded-full animate-spin" />
                          Logging Application into CMS...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Application to CMS
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

      {/* Attendee Profile Onboarding Modal */}
      {user && (
        <OnboardingModal
          isOpen={showOnboardingModal}
          userDisplayName={user.displayName}
          userEmail={user.email}
          initialProfile={profile}
          onCompleted={(saved) => {
            setProfile(saved)
            setShowOnboardingModal(false)
            toast.success('Attendee profile onboarded! You can now complete your pass application.')
          }}
        />
      )}
    </div>
  )
}
