'use client'
// app/passes/page.tsx
// Real pass catalog from GET /registrations/types, real registration via
// POST /registrations/create, and the shared payment flow (see
// hooks/usePassPayment.ts) for tiers that carry a fee.

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  ShieldCheck,
  Users,
  Ticket,
  ArrowLeft,
  X,
  Sparkles,
  Download,
  Loader2,
  CreditCard,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import Link from 'next/link'
import TicketPassCard, { PassTier } from '@/components/Common/TicketPassCard'
import { api, ApiError } from '@/lib/api'
import { usePassPayment } from '@/hooks/usePassPayment'
import type { CreateRegistrationResponse, PassCatalogEntry, PassType } from '@/lib/api-types'

/** Decorative-only UI metadata the backend doesn't (and shouldn't) return —
 *  gradients, ticket copy. Real business data (price, fees, popularity,
 *  totals) always comes from the catalog entry itself. */
const PASS_UI_META: Record<
  PassType,
  { gradient: string; passengerType: string; cabinClass: string; ctaText: string }
> = {
  STUDENT_GENERAL: {
    gradient: 'linear-gradient(165deg, #0284C7 0%, #2563EB 30%, #7C3AED 65%, #EC4899 100%)',
    passengerType: 'STUDENT DELEGATE',
    cabinClass: 'GENERAL ACCESS',
    ctaText: 'Claim Student Pass',
  },
  FOUNDER_PITCH: {
    gradient: 'linear-gradient(165deg, #7C3AED 0%, #C026D3 30%, #F43F5E 65%, #F97316 85%, #FBBF24 100%)',
    passengerType: 'STARTUP FOUNDER',
    cabinClass: 'PITCH ARENA',
    ctaText: 'Register Startup Team',
  },
  HACKATHON_BUILDER: {
    gradient: 'linear-gradient(165deg, #059669 0%, #10B981 30%, #06B6D4 65%, #3B82F6 100%)',
    passengerType: 'HACKER / BUILDER',
    cabinClass: '24-HR ARENA',
    ctaText: 'Register Hackathon Team',
  },
  CAMPUS_AMBASSADOR: {
    gradient: 'linear-gradient(165deg, #4F46E5 0%, #7C3AED 35%, #DB2777 75%, #F43F5E 100%)',
    passengerType: 'CAMPUS AMBASSADOR',
    cabinClass: 'AMBASSADOR TIER',
    ctaText: 'Become an Ambassador',
  },
}

function toPassTier(entry: PassCatalogEntry): PassTier {
  const meta = PASS_UI_META[entry.enumType]
  return {
    id: entry.id,
    name: entry.title.toUpperCase(),
    tagline: entry.tagline,
    price: entry.feeAmount > 0 ? `₹${entry.feeAmount}` : 'FREE',
    badge: entry.popular ? 'MOST POPULAR' : undefined,
    popular: entry.popular,
    category: entry.category,
    features: entry.features,
    gradient: meta.gradient,
    code: entry.id.toUpperCase(),
    passengerType: meta.passengerType,
    cabinClass: meta.cabinClass,
    ctaText: meta.ctaText,
  }
}

const toastStyle = {
  style: { background: '#09120E', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' },
  iconTheme: { primary: '#7ED321', secondary: '#040605' },
}

export default function PassesPage() {
  const [filter, setFilter] = useState<'all' | 'student' | 'founder' | 'ambassador'>('all')
  const [catalog, setCatalog] = useState<PassCatalogEntry[] | null>(null)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const [selectedEntry, setSelectedEntry] = useState<PassCatalogEntry | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'payment' | 'success'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationResult, setRegistrationResult] = useState<CreateRegistrationResponse | null>(null)

  const payment = usePassPayment()

  useEffect(() => {
    let cancelled = false
    api
      .getPassTypes()
      .then((types) => {
        if (!cancelled) setCatalog(types)
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

  const passTiers = catalog?.map(toPassTier) ?? []
  const filteredPasses = passTiers.filter((p) => filter === 'all' || p.category === filter)
  const totalIssued = catalog?.reduce((sum, c) => sum + c.totalIssued, 0) ?? null

  const handleSelectPass = (pass: PassTier) => {
    const entry = catalog?.find((c) => c.id === pass.id) || null
    setSelectedEntry(entry)
    setCheckoutStep('form')
    setRegistrationResult(null)
    payment.reset()
  }

  const closeModal = () => {
    setSelectedEntry(null)
    setRegistrationResult(null)
    payment.reset()
  }

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter your name and email.')
      return
    }
    if (!selectedEntry) return

    setIsSubmitting(true)
    try {
      const res = await api.createRegistration({
        name: formData.name,
        email: formData.email,
        passType: selectedEntry.enumType,
        ...(formData.phone ? { phone: formData.phone } : {}),
        ...(formData.college ? { college: formData.college } : {}),
      })
      setRegistrationResult(res)

      if (res.isPaymentRequired) {
        setCheckoutStep('payment')
        await payment.createOrder(res.registration.passId)
      } else {
        setCheckoutStep('success')
        toast.success(`Ticket confirmed for ${formData.name}!`, toastStyle)
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not complete registration.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Move to the success screen once the payment hook reports success.
  useEffect(() => {
    if (payment.phase === 'success' && checkoutStep === 'payment') {
      setCheckoutStep('success')
      toast.success(`Payment confirmed for ${formData.name}!`, toastStyle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.phase])

  return (
    <main className="relative min-h-screen bg-[#040705] text-white overflow-hidden">
      <Toaster position="top-center" />
      <Nav />

      <div className="pointer-events-none absolute left-1/4 top-20 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[160px]" />
      <div className="pointer-events-none absolute right-1/4 top-96 h-[600px] w-[600px] rounded-full bg-pink-600/15 blur-[160px]" />

      <section className="relative bg-[#040705] pt-28 pb-16">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 backdrop-blur-md">
              <Sparkles size={13} className="text-yellow-400" />
              <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-white">
                {totalIssued !== null ? `${totalIssued.toLocaleString()}+ TICKETS ISSUED` : 'LIVE TICKET COUNTS'}
              </span>
            </div>
          </div>

          <div className="max-w-3xl mb-8">
            <h1 className="mb-3 font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.98] tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              SELECT YOUR <br />
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                SUMMIT TICKET
              </span>
            </h1>

            <p className="mb-5 max-w-xl font-body text-base sm:text-lg leading-relaxed text-gray-300">
              Whether you are pitching your startup to top VCs, hacking overnight for ₹15L+ prize pools,
              or attending high-impact keynotes, claim your festival ticket pass now.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'All Tickets' },
                { id: 'student', label: 'Student & Hackers' },
                { id: 'founder', label: 'Founders & Pitch' },
                { id: 'ambassador', label: 'Campus Ambassadors' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as typeof filter)}
                  className={`rounded-full px-6 py-2.5 font-mono-data text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    filter === item.id
                      ? 'bg-white font-black text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-105'
                      : 'border border-white/15 bg-white/5 text-gray-300 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {catalogError && (
            <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-400">
              {catalogError}
            </div>
          )}

          {!catalog && !catalogError && (
            <div className="flex items-center justify-center gap-2 py-24 text-gray-400">
              <Loader2 className="animate-spin" size={20} /> Loading pass catalog…
            </div>
          )}

          {catalog && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPasses.map((pass) => (
                <TicketPassCard key={pass.id} pass={pass} onSelectPass={handleSelectPass} />
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-white/10 pt-10 grid gap-8 text-center sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <ShieldCheck size={28} className="mb-2 text-cyan-400" />
              <h4 className="mb-1 font-body text-sm font-bold text-white">Instant Digital E-Ticket</h4>
              <p className="font-body text-xs text-gray-400 max-w-xs">
                Receive your personalized QR check-in code instantly, generated server-side upon booking.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Ticket size={28} className="mb-2 text-fuchsia-400" />
              <h4 className="mb-1 font-body text-sm font-bold text-white">Hostel &amp; Stay Assistance</h4>
              <p className="font-body text-xs text-gray-400 max-w-xs">
                Outstation attendees get priority hostel accommodation guidance on PEC campus.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Users size={28} className="mb-2 text-amber-400" />
              <h4 className="mb-1 font-body text-sm font-bold text-white">VC Matchmaking Portal</h4>
              <p className="font-body text-xs text-gray-400 max-w-xs">
                All pass holders get exclusive early access to the EIC digital networking portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-void/85">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#09120E] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={closeModal}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>

              {checkoutStep === 'form' && (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      ⚡ TICKET RESERVATION
                    </span>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black text-white">
                      Reserve {selectedEntry.title}
                    </h3>
                    <p className="mt-1 font-mono-data text-xs text-gray-400">
                      Pass Price: <span className="font-bold text-white">{selectedEntry.feeDisplay}</span>
                    </p>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="mb-1 block font-mono-data text-[10px] font-bold uppercase text-gray-300">
                        Passenger Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-white/15 bg-void px-4 py-3 font-body text-xs text-white outline-none focus:border-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block font-mono-data text-[10px] font-bold uppercase text-gray-300">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full rounded-xl border border-white/15 bg-void px-4 py-3 font-body text-xs text-white outline-none focus:border-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block font-mono-data text-[10px] font-bold uppercase text-gray-300">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-xl border border-white/15 bg-void px-3.5 py-3 font-body text-xs text-white outline-none focus:border-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block font-mono-data text-[10px] font-bold uppercase text-gray-300">
                          College / Org
                        </label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="PEC Chandigarh"
                          className="w-full rounded-xl border border-white/15 bg-void px-3.5 py-3 font-body text-xs text-white outline-none focus:border-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-mono-data text-xs font-black uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
                    >
                      {isSubmitting && <Loader2 className="animate-spin" size={14} />}
                      Confirm Booking ({selectedEntry.feeDisplay})
                    </button>
                  </form>
                </>
              )}

              {checkoutStep === 'payment' && registrationResult && (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
                      <CreditCard size={26} />
                    </div>
                    <h3 className="font-display text-2xl font-black text-white">Complete Payment</h3>
                    <p className="mt-1 font-mono-data text-xs text-gray-400">
                      Pass <span className="text-white">{registrationResult.registration.passId}</span> is
                      reserved — pay {selectedEntry.feeDisplay} to confirm.
                    </p>
                  </div>

                  <div className="space-y-4 text-left">
                    {payment.phase === 'creating-order' && (
                      <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                        <Loader2 className="animate-spin" size={18} /> Preparing checkout…
                      </div>
                    )}

                    {payment.error && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
                        {payment.error}
                      </div>
                    )}

                    {!payment.order && payment.phase !== 'creating-order' && (
                      <button
                        onClick={() => payment.createOrder(registrationResult.registration.passId)}
                        className="w-full rounded-xl bg-white py-3.5 font-mono-data text-xs font-black uppercase tracking-wider text-black"
                      >
                        Retry Checkout
                      </button>
                    )}

                    {payment.order && (
                      <>
                        {payment.isRealGatewayAvailable && (
                          <button
                            onClick={() =>
                              payment.payWithRazorpay({
                                name: formData.name,
                                email: formData.email,
                                phone: formData.phone,
                              })
                            }
                            disabled={payment.phase === 'processing'}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-mono-data text-xs font-black uppercase tracking-wider text-black disabled:opacity-60"
                          >
                            {payment.phase === 'processing' && <Loader2 className="animate-spin" size={14} />}
                            Pay {selectedEntry.feeDisplay} with Razorpay
                          </button>
                        )}

                        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
                          <p className="mb-2 font-mono-data text-[10px] font-bold uppercase tracking-widest text-amber-400">
                            {payment.isDemoMode ? 'Demo Mode — No Real Charge' : 'Gateway unavailable — Test Mode'}
                          </p>
                          <p className="mb-3 font-body text-xs text-gray-400">
                            No live Razorpay key is configured here. Confirming below hits the same
                            backend verification endpoint with a synthesized test transaction.
                          </p>
                          <button
                            onClick={() => payment.payDemo()}
                            disabled={payment.phase === 'processing'}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent py-3 font-mono-data text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 disabled:opacity-60"
                          >
                            {payment.phase === 'processing' && <Loader2 className="animate-spin" size={14} />}
                            Confirm Demo Payment
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {checkoutStep === 'success' && registrationResult && (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono-data text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                    <Check size={12} /> CONFIRMED DELEGATE TICKET
                  </div>

                  <div
                    className="relative w-full rounded-2xl p-5 text-black my-4 text-left shadow-2xl border overflow-hidden"
                    style={{ background: PASS_UI_META[registrationResult.registration.passType].gradient }}
                  >
                    <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-3">
                      <span className="font-display text-xs font-black text-white bg-black px-2 py-0.5 rounded">
                        PEC SUMMIT 2026
                      </span>
                      <span className="font-mono-data text-[9px] font-bold text-black">
                        #{registrationResult.registration.passId}
                      </span>
                    </div>

                    <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/70 block">
                      PASSENGER
                    </span>
                    <h4 className="font-display text-2xl font-black text-black uppercase leading-tight mb-2">
                      {registrationResult.registration.user.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 font-mono-data text-[10px] font-bold border-y border-black/20 py-2 my-2">
                      <div>
                        <span className="text-black/60 block text-[8px]">TICKET TYPE</span>
                        <span>{registrationResult.registration.categoryTitle}</span>
                      </div>
                      <div>
                        <span className="text-black/60 block text-[8px]">AMOUNT</span>
                        <span>
                          {registrationResult.registration.amountPaid > 0
                            ? `₹${registrationResult.registration.amountPaid}`
                            : 'FREE'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <img
                        src={registrationResult.registration.qrCodeDataUrl}
                        alt="Delegate QR check-in code"
                        className="h-16 w-16 rounded bg-white p-1"
                      />
                      <div className="flex h-8 gap-0.5 bg-white/90 p-1 rounded border border-black/20">
                        {[2, 1, 3, 1, 2, 1, 4, 1, 3, 2, 1].map((w, idx) => (
                          <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-xs text-gray-300 mb-6">
                    Your real check-in QR code is embedded above and linked to{' '}
                    <span className="text-white font-semibold">{formData.email}</span>.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => toast.success('Use "Print / Save" from your account dashboard for a PDF copy.')}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 font-mono-data text-xs font-bold text-white hover:bg-white/20"
                    >
                      <Download size={14} /> Save E-Ticket
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl bg-white py-3 font-mono-data text-xs font-black uppercase text-black"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer hideCTA={true} />
      <Concierge />
    </main>
  )
}
