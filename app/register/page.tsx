'use client'
// app/register/page.tsx
// Real registration wizard backed by E_Summit_Backend: GET /registrations/types
// for the catalog, POST /registrations/create to issue a pass, then the shared
// payment flow (see hooks/usePassPayment.ts) when a fee applies.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Check,
  ArrowLeft,
  User,
  Ticket,
  Download,
  Sparkles,
  CheckCircle2,
  Loader2,
  CreditCard,
  ShieldCheck,
} from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import MyPassesPanel from '@/components/Account/MyPassesPanel'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { api, ApiError } from '@/lib/api'
import { usePassPayment } from '@/hooks/usePassPayment'
import type {
  CreateRegistrationDto,
  CreateRegistrationResponse,
  FormattedRegistration,
  PassCatalogEntry,
  PassType,
} from '@/lib/api-types'

const TYPE_ICONS: Record<PassType, typeof User> = {
  STUDENT_GENERAL: User,
  FOUNDER_PITCH: Ticket,
  HACKATHON_BUILDER: Zap,
  CAMPUS_AMBASSADOR: Sparkles,
}

const INTEREST_TRACKS = [
  'Artificial Intelligence & ML',
  'Fintech & Payments',
  'Pitch Competition (₹7.5L Pool)',
  '24-Hour Hackathon (₹5.0L Pool)',
  'DeepTech & Hardware',
  'Web3 & Open Source',
]

const toastStyle = {
  style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
  iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
}

/** Real E-Badge — shared by the "just registered" flow and the "view an
 *  existing pass" flow off the dashboard tab. Renders the backend-generated
 *  QR code, not a client-side fabrication. */
function BadgeCard({
  registration,
  onDone,
}: {
  registration: FormattedRegistration
  onDone: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div className="mb-8 text-center">
        <div className="bg-[var(--accent-mint)]/20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-mint)] text-[var(--accent-mint)]">
          <CheckCircle2 size={36} />
        </div>
        <h2 className="font-display text-4xl text-white">E-Badge Generated!</h2>
        <p className="font-body text-sm text-muted">
          Your official PEC Summit 2026 digital delegate pass is active.
        </p>
      </div>

      <div className="relative mx-auto mb-8 max-w-md overflow-hidden rounded-3xl border-2 border-[var(--accent-mint)] bg-panel p-8 shadow-[0_0_40px_rgba(126,211,33,0.3)]">
        <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-[var(--accent-mint)] via-[#3DD9FF] to-[var(--accent-mint)]" />

        <div className="border-[var(--accent-mint)]/20 mb-6 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <Zap size={18} className="fill-[var(--accent-mint)] text-[var(--accent-mint)]" />
            <span className="font-display text-xl text-white">PEC SUMMIT 2026</span>
          </div>
          <span className="bg-[var(--accent-mint)]/20 border-[var(--accent-mint)]/40 rounded border px-2.5 py-1 font-mono-data text-[10px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
            {registration.badgeTitle}
          </span>
        </div>

        <div className="mb-6">
          <p className="mb-1 font-mono-data text-xs uppercase text-muted">Delegate Name</p>
          <h3 className="mb-2 font-body text-3xl font-extrabold text-white">
            {registration.user.name}
          </h3>
          {registration.user.college && (
            <p className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">
              {registration.user.college}
            </p>
          )}
        </div>

        <div className="border-[var(--accent-mint)]/30 mb-6 flex items-center justify-between gap-4 rounded-2xl border bg-void p-4">
          <div>
            <p className="mb-1 font-mono-data text-[10px] uppercase text-muted">Pass ID</p>
            <p className="mb-2 font-mono-data text-sm font-bold text-white">{registration.passId}</p>
            <p className="font-mono-data text-[10px] text-[var(--accent-mint)]">
              {registration.amountPaid > 0
                ? `Paid ₹${registration.amountPaid}`
                : 'Free pass'}
            </p>
          </div>

          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
            <img
              src={registration.qrCodeDataUrl}
              alt="Delegate QR Check-in Code"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="border-[var(--accent-mint)]/20 flex items-center justify-between border-t pt-4 font-mono-data text-xs text-muted">
          <span>Venue: PEC Sector 12</span>
          <span className="font-bold text-[var(--accent-mint)]">
            {registration.isCheckedIn ? 'Checked In' : 'Status: Active'}
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-md flex-wrap gap-4">
        <button onClick={() => window.print()} className="btn-green flex-1 justify-center py-3.5 text-sm font-bold">
          <Download size={16} /> Print / Save E-Badge
        </button>
        <button onClick={onDone} className="btn-ghost flex-1 justify-center">
          Go to Dashboard
        </button>
      </div>
    </motion.div>
  )
}

/** Payment gate rendered in place of the badge until a paid pass clears
 *  verification. Offers the real Razorpay Checkout.js flow when the backend
 *  hands back a usable key, and always offers the labeled demo bypass — the
 *  backend accepts it because RAZORPAY_KEY_SECRET is unset in this env. */
function PaymentGate({
  passId,
  amountDisplay,
  payment,
  customer,
}: {
  passId: string
  amountDisplay: string
  payment: ReturnType<typeof usePassPayment>
  customer: { name: string; email: string; phone: string }
}) {
  const { phase, order, error, isRealGatewayAvailable, isDemoMode, createOrder, payWithRazorpay, payDemo } = payment

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8 text-center">
        <div className="bg-[var(--accent-mint)]/20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-mint)] text-[var(--accent-mint)]">
          <CreditCard size={32} />
        </div>
        <h2 className="font-display text-4xl text-white">Complete Payment</h2>
        <p className="font-body text-sm text-muted">
          Pass <span className="font-mono-data text-[var(--accent-mint)]">{passId}</span> is reserved —
          pay <span className="font-bold text-white">{amountDisplay}</span> to confirm it.
        </p>
      </div>

      <div className="mx-auto max-w-md space-y-4">
        {phase === 'creating-order' && (
          <div className="flex items-center justify-center gap-2 py-6 text-muted">
            <Loader2 className="animate-spin" size={18} /> Preparing checkout…
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {!order && phase !== 'creating-order' && (
          <button onClick={() => createOrder(passId)} className="btn-green w-full justify-center py-3.5 font-bold">
            Retry Checkout
          </button>
        )}

        {order && (
          <>
            {isRealGatewayAvailable && (
              <button
                onClick={() => payWithRazorpay(customer)}
                disabled={phase === 'processing'}
                className="btn-green flex w-full items-center justify-center gap-2 py-3.5 font-bold disabled:opacity-60"
              >
                {phase === 'processing' && <Loader2 className="animate-spin" size={16} />}
                Pay {amountDisplay} with Razorpay
              </button>
            )}

            <div className="border-[var(--accent-mint)]/20 rounded-xl border border-dashed bg-panel p-4">
              <p className="mb-3 font-mono-data text-[10px] font-bold uppercase tracking-widest text-amber-400">
                {isDemoMode ? 'Demo Mode — No Real Charge' : 'Gateway unavailable — Test Mode'}
              </p>
              <p className="mb-3 font-body text-xs text-muted">
                This environment has no live Razorpay key configured. Confirming here calls the same
                backend verification endpoint with a synthesized test transaction — it will not charge
                any card.
              </p>
              <button
                onClick={payDemo}
                disabled={phase === 'processing'}
                className="btn-ghost flex w-full items-center justify-center gap-2 py-3 text-sm font-bold disabled:opacity-60"
              >
                {phase === 'processing' && <Loader2 className="animate-spin" size={16} />}
                Confirm Demo Payment
              </button>
            </div>
          </>
        )}

        <p className="text-muted flex items-center justify-center gap-1.5 pt-2 text-[11px]">
          <ShieldCheck className="h-3 w-3" /> Verified server-side via POST /payments/verify.
        </p>
      </div>
    </motion.div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [activeTab, setActiveTab] = useState<'new' | 'dashboard'>('new')

  const [catalog, setCatalog] = useState<PassCatalogEntry[] | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<PassType>('STUDENT_GENERAL')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    gradYear: '2026',
    city: 'Chandigarh',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<CreateRegistrationResponse | null>(null)
  const [viewedPass, setViewedPass] = useState<FormattedRegistration | null>(null)

  const payment = usePassPayment()

  useEffect(() => {
    let cancelled = false
    api
      .getPassTypes()
      .then((types) => {
        if (cancelled) return
        setCatalog(types)
        if (types.length > 0) setSelectedType(types[0].enumType)
      })
      .catch((err) => {
        if (!cancelled) {
          setCatalogError(err instanceof ApiError ? err.message : 'Could not load pass types.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleTrackToggle = (track: string) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track],
    )
  }

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email.')
      return
    }

    setIsSubmitting(true)
    try {
      const dto: CreateRegistrationDto = {
        name: formData.name,
        email: formData.email,
        passType: selectedType,
        ...(formData.phone ? { phone: formData.phone } : {}),
        ...(formData.college ? { college: formData.college } : {}),
        ...(formData.gradYear ? { gradYear: formData.gradYear } : {}),
        ...(formData.city ? { city: formData.city } : {}),
        ...(selectedTracks.length ? { tracks: selectedTracks } : {}),
      }

      const res = await api.createRegistration(dto)
      setRegistrationResult(res)
      setViewedPass(null)
      setStep(4)
      toast.success('Registration complete — E-Badge generated!', toastStyle)

      if (res.isPaymentRequired) {
        payment.createOrder(res.registration.passId).catch(() => {
          // Surfaced inline via payment.error on the payment gate.
        })
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const catalogEntry = catalog?.find((c) => c.enumType === selectedType)

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      <section className="relative overflow-hidden border-b border-border-subtle bg-void pb-16 pt-36">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted transition-colors hover:text-mint"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-panel p-1">
              <button
                onClick={() => {
                  setActiveTab('new')
                  setViewedPass(null)
                }}
                className={`rounded-lg px-4 py-2 font-mono-data text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'new'
                    ? 'bg-mint font-bold text-void shadow-[0_0_12px_rgba(126,211,33,0.3)]'
                    : 'text-secondary hover:text-white'
                }`}
              >
                + New Registration
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-mono-data text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-mint font-bold text-void shadow-[0_0_12px_rgba(126,211,33,0.3)]'
                    : 'text-secondary hover:text-white'
                }`}
              >
                <Ticket size={13} /> My E-Badges
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-4 font-display text-3xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              REGISTRATION <br />
              <span className="text-mint">DASHBOARD</span>
            </h1>
            <p className="max-w-xl font-body text-base leading-relaxed text-secondary">
              Complete your delegate pass registration, select your tracks, and instantly generate
              your digital E-Badge with check-in QR code.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-void py-16">
        <div className="section-container">
          {activeTab === 'dashboard' ? (
            <div className="mx-auto max-w-3xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display text-3xl text-white">Your Booked E-Badges</h2>
                <button
                  onClick={() => {
                    setActiveTab('new')
                    setStep(1)
                    setRegistrationResult(null)
                  }}
                  className="btn-green px-4 py-2.5 text-xs font-bold"
                >
                  + Register Another Pass
                </button>
              </div>

              <MyPassesPanel
                onViewBadge={(pass) => {
                  setViewedPass(pass)
                  setActiveTab('new')
                }}
                signedOutSlot={
                  <div className="border-line rounded-2xl border border-dashed p-10 text-center">
                    <Ticket className="text-muted mx-auto mb-3 h-8 w-8" />
                    <p className="text-muted mb-4 text-sm">
                      Sign in to view passes linked to your account. Passes registered without
                      signing in are shown right here immediately after you create them.
                    </p>
                    <Link href="/account" className="btn-green inline-flex px-6 py-2.5 text-xs font-bold">
                      Sign In / Create Account
                    </Link>
                  </div>
                }
              />
            </div>
          ) : viewedPass ? (
            <div className="mx-auto max-w-3xl">
              <BadgeCard
                registration={viewedPass}
                onDone={() => {
                  setViewedPass(null)
                  setActiveTab('dashboard')
                }}
              />
            </div>
          ) : (
            <div className="mx-auto max-w-3xl">
              <div className="border-[var(--accent-mint)]/20 mb-10 flex items-center justify-between border-b pb-6">
                {[
                  { num: 1, label: 'Select Pass' },
                  { num: 2, label: 'Personal Info' },
                  { num: 3, label: 'Track Interests' },
                  { num: 4, label: registrationResult?.isPaymentRequired && payment.phase !== 'success' ? 'Payment' : 'Digital E-Badge' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-mono-data text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-[var(--accent-mint)] text-void shadow-[0_0_15px_rgba(126,211,33,0.5)]'
                          : step > s.num
                            ? 'bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)] text-[var(--accent-mint)]'
                            : 'border-[var(--accent-mint)]/20 border bg-panel text-muted'
                      }`}
                    >
                      {step > s.num ? <Check size={14} /> : s.num}
                    </div>
                    <span className="hidden font-mono-data text-xs uppercase text-muted sm:inline">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="mb-2 font-display text-3xl text-white">
                    Step 1: Choose Delegate Category
                  </h2>
                  <p className="mb-8 font-body text-sm text-muted">
                    Select your primary registration pass type for PEC Summit 2026.
                  </p>

                  {catalogError && (
                    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
                      {catalogError}
                    </div>
                  )}

                  {!catalog && !catalogError && (
                    <div className="mb-8 flex items-center justify-center gap-2 py-12 text-muted">
                      <Loader2 className="animate-spin" size={18} /> Loading pass catalog…
                    </div>
                  )}

                  {catalog && (
                    <div className="mb-8 grid gap-4 sm:grid-cols-2">
                      {catalog.map((type) => {
                        const isSelected = selectedType === type.enumType
                        const Icon = TYPE_ICONS[type.enumType] || User
                        return (
                          <div
                            key={type.id}
                            onClick={() => setSelectedType(type.enumType)}
                            className={`flex cursor-pointer flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
                              isSelected
                                ? 'border-[var(--accent-mint)] bg-panel shadow-[0_0_20px_rgba(126,211,33,0.3)]'
                                : 'border-[var(--accent-mint)]/20 hover:border-[var(--accent-mint)]/50 bg-panel'
                            }`}
                          >
                            <div>
                              <div className="mb-4 flex items-center justify-between">
                                <div className="border-[var(--accent-mint)]/30 flex h-10 w-10 items-center justify-center rounded-xl border bg-void text-[var(--accent-mint)]">
                                  <Icon size={20} />
                                </div>
                                <span className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">
                                  {type.feeDisplay}
                                </span>
                              </div>

                              <h3 className="mb-1 font-body text-lg font-bold text-white">
                                {type.title}
                              </h3>
                              <p className="mb-4 font-body text-xs leading-relaxed text-muted">
                                {type.tagline}
                              </p>
                            </div>

                            <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                              Badge: {type.badgeTitle} · {type.totalIssued} issued
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <button
                    onClick={() => setStep(2)}
                    disabled={!catalog}
                    className="btn-green w-full justify-center py-4 font-bold disabled:opacity-50"
                  >
                    Continue to Personal Info &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="mb-2 font-display text-3xl text-white">
                    Step 2: Delegate Information
                  </h2>
                  <p className="mb-8 font-body text-sm text-muted">
                    Enter details to be printed on your official digital summit pass.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setStep(3)
                    }}
                    className="mb-8 space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ananya Sharma"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ananya@example.com"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                          College / Institution
                        </label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="Punjab Engineering College"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-ghost flex-1 justify-center"
                      >
                        &larr; Back
                      </button>
                      <button type="submit" className="btn-green flex-1 justify-center font-bold">
                        Continue to Tracks &rarr;
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="mb-2 font-display text-3xl text-white">Step 3: Track Interests</h2>
                  <p className="mb-8 font-body text-sm text-muted">
                    Select sessions and competitions you plan to participate in.
                  </p>

                  <div className="mb-8 grid gap-3 sm:grid-cols-2">
                    {INTEREST_TRACKS.map((t) => {
                      const isSelected = selectedTracks.includes(t)
                      return (
                        <div
                          key={t}
                          onClick={() => handleTrackToggle(t)}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 font-body text-sm transition-all ${
                            isSelected
                              ? 'border-[var(--accent-mint)] bg-panel font-bold text-[var(--accent-mint)]'
                              : 'border-[var(--accent-mint)]/20 bg-panel text-gray-300'
                          }`}
                        >
                          <span>{t}</span>
                          <div
                            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                              isSelected
                                ? 'border-[var(--accent-mint)] bg-[var(--accent-mint)] text-void'
                                : 'border-[var(--accent-mint)]/30'
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-ghost flex-1 justify-center">
                      &larr; Back
                    </button>
                    <button
                      onClick={handleCompleteRegistration}
                      disabled={isSubmitting}
                      className="btn-green flex flex-1 items-center justify-center gap-2 py-4 font-bold disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                      Generate Digital E-Badge &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && registrationResult && (
                registrationResult.isPaymentRequired && payment.phase !== 'success' ? (
                  <PaymentGate
                    passId={registrationResult.registration.passId}
                    amountDisplay={catalogEntry?.feeDisplay || `₹${registrationResult.registration.amountPaid}`}
                    payment={payment}
                    customer={{ name: formData.name, email: formData.email, phone: formData.phone }}
                  />
                ) : (
                  <BadgeCard
                    registration={registrationResult.registration}
                    onDone={() => setActiveTab('dashboard')}
                  />
                )
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <Concierge />
    </main>
  )
}
