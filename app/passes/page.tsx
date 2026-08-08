'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, Users, ArrowRight, Ticket, ArrowLeft, X } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import Link from 'next/link'

interface PassTier {
  id: string
  name: string
  tagline: string
  price: string
  originalPrice?: string
  badge?: string
  popular?: boolean
  category: 'student' | 'founder' | 'group'
  features: string[]
  accentColor: string
  ctaText: string
}

const PASSES: PassTier[] = [
  {
    id: 'student-general',
    name: 'Student Pass',
    tagline: 'Full 2-day access for college students & campus innovators.',
    price: '₹299',
    originalPrice: '₹499',
    badge: 'EARLY BIRD',
    category: 'student',
    features: [
      'Access to all Keynotes & Panels',
      'Startup Expo floor pass (Both Days)',
      'E-Certificate of Participation',
      'Summit Delegate Kit & Swag',
      'Access to General Networking Zone',
    ],
    accentColor: 'var(--accent-mint)',
    ctaText: 'Claim Student Pass',
  },
  {
    id: 'pitch-competition',
    name: 'Founder & Pitch Pass',
    tagline: 'For startup teams ready to pitch to VCs & Angels.',
    price: '₹799',
    originalPrice: '₹1,299',
    badge: 'MOST POPULAR',
    popular: true,
    category: 'founder',
    features: [
      'Pitch Competition entry (Up to 4 members)',
      '1-on-1 Investor Deck Review',
      'Priority application for Investor Open Hours',
      'Startup Expo booth discount eligibility',
      'All perks included in Student Pass',
    ],
    accentColor: 'var(--accent-mint)',
    ctaText: 'Register Startup Team',
  },
  {
    id: 'hackathon-pass',
    name: 'Hackathon Builder Pass',
    tagline: '24-hour sprint to build, hack, and win ₹15L+ pool.',
    price: '₹199',
    originalPrice: '₹399',
    badge: '24-HR HACK',
    category: 'student',
    features: [
      '24-Hour Hackathon Arena access (Team of 2-4)',
      'Midnight meals, Red Bull & snacks included',
      '$500+ cloud & API developer credits',
      'Mentorship from senior tech leads',
      'All-night Hacker Lounge access',
    ],
    accentColor: 'var(--accent-mint)',
    ctaText: 'Register Hackathon Team',
  },
  {
    id: 'vip-pass',
    name: 'VIP Founder & Investor Pass',
    tagline: 'Premium networking pass for founders, executives & angels.',
    price: '₹1,499',
    originalPrice: '₹2,499',
    badge: 'VIP ACCESS',
    category: 'founder',
    features: [
      'Exclusive VIP Networking Evening & Dinner',
      'Reserved Front-Row Seating at Keynotes',
      'Direct Investor Matchmaking Lounge access',
      'Exclusive PEC Summit Founder Swag Box',
      'Fast-track Badge & Dedicated Check-in',
    ],
    accentColor: 'var(--accent-mint)',
    ctaText: 'Get VIP Pass',
  },
  {
    id: 'group-pass',
    name: 'College Delegation (5+ Passes)',
    tagline: 'Group discount for college societies & e-cells.',
    price: '₹249',
    originalPrice: '₹499',
    badge: 'BULK DISCOUNT',
    category: 'group',
    features: [
      'Discounted rate per attendee (Min 5 passes)',
      'Reserved group seating for major panels',
      'Custom Delegation Certificate for college',
      'Dedicated Student Ambassador point-of-contact',
      'Complimentary Pass for Faculty / Lead',
    ],
    accentColor: 'var(--accent-mint)',
    ctaText: 'Get Group Pass',
  },
]

export default function PassesPage() {
  const [filter, setFilter] = useState<'all' | 'student' | 'founder' | 'group'>('all')
  const [selectedPass, setSelectedPass] = useState<PassTier | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' })

  const filteredPasses = PASSES.filter((p) => filter === 'all' || p.category === filter)

  const handleSelectPass = (pass: PassTier) => {
    setSelectedPass(pass)
    setCheckoutStep('form')
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter your name and email.')
      return
    }

    const existingOrders = JSON.parse(localStorage.getItem('pec_summit_orders') || '[]')
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      passId: selectedPass?.id,
      passName: selectedPass?.name,
      price: selectedPass?.price,
      customer: formData,
      date: new Date().toISOString(),
    }
    existingOrders.push(newOrder)
    localStorage.setItem('pec_summit_orders', JSON.stringify(existingOrders))

    setCheckoutStep('success')
    toast.success(`Pass reserved for ${formData.name}!`, {
      style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
    })
  }

  return (
    <main className="relative min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border-subtle bg-void pb-20 pt-36">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted transition-colors hover:text-mint"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-6 font-display text-3xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              CHOOSE YOUR <br />
              <span className="text-mint">SUMMIT PASS</span>
            </h1>

            <p className="mb-8 max-w-xl font-body text-lg leading-relaxed text-secondary">
              Whether you are pitching your startup to top VCs, hacking overnight for prize pools,
              or attending high-impact keynotes, grab your pass now before early-bird pricing ends.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'All Passes' },
                { id: 'student', label: 'Student & Hackers' },
                { id: 'founder', label: 'Founders & Pitch' },
                { id: 'group', label: 'Group Delegation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
                  className={`rounded-xl px-5 py-2.5 font-mono-data text-xs uppercase tracking-wider transition-all duration-200 ${
                    filter === item.id
                      ? 'bg-mint font-bold text-void shadow-[0_0_18px_rgba(126,211,33,0.4)]'
                      : 'hover:border-mint/40 border border-border-subtle bg-panel text-secondary hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pass Cards Grid */}
      <section className="bg-void py-20">
        <div className="section-container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPasses.map((pass) => (
              <motion.div
                key={pass.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`group relative flex flex-col justify-between rounded-2xl border bg-panel p-8 transition-all duration-300 ${
                  pass.popular
                    ? 'border-mint shadow-[0_0_28px_rgba(126,211,33,0.25)]'
                    : 'hover:border-mint/50 border-border-subtle'
                }`}
                whileHover={{ y: -6 }}
              >
                {/* Ribbon / Badge */}
                {pass.badge && (
                  <div
                    className="absolute -top-3.5 right-6 rounded-full px-3.5 py-1 font-mono-data text-[10px] font-bold uppercase tracking-widest shadow-md"
                    style={{
                      background: pass.popular ? 'var(--accent-mint)' : 'rgba(126,211,33,0.15)',
                      color: pass.popular ? '#040605' : 'var(--accent-mint)',
                      border: `1px solid ${pass.popular ? 'transparent' : 'rgba(126,211,33,0.4)'}`,
                    }}
                  >
                    {pass.badge}
                  </div>
                )}

                <div>
                  <h3 className="mb-2 font-display text-3xl text-white transition-colors group-hover:text-[var(--accent-mint)]">
                    {pass.name}
                  </h3>
                  <p className="mb-6 font-body text-sm leading-relaxed text-muted">
                    {pass.tagline}
                  </p>

                  <div className="border-[var(--accent-mint)]/15 mb-8 flex items-baseline gap-3 border-b pb-6">
                    <span className="font-mono-data text-4xl font-bold tabular-nums text-[var(--accent-mint)]">
                      {pass.price}
                    </span>
                    {pass.originalPrice && (
                      <span className="font-mono-data text-sm text-muted line-through">
                        {pass.originalPrice}
                      </span>
                    )}
                    <span className="font-mono-data text-xs text-muted">/ pass</span>
                  </div>

                  {/* Feature List */}
                  <ul className="mb-8 space-y-3.5">
                    {pass.features.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 font-body text-sm text-gray-200"
                      >
                        <div className="bg-[var(--accent-mint)]/20 border-[var(--accent-mint)]/40 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[var(--accent-mint)]">
                          <Check size={12} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPass(pass)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-body text-sm font-bold transition-all duration-200"
                  style={{
                    background: pass.popular ? 'var(--accent-mint)' : 'transparent',
                    color: pass.popular ? '#040605' : '#FFFFFF',
                    border: `1px solid ${pass.popular ? 'transparent' : 'rgba(126,211,33,0.4)'}`,
                  }}
                >
                  {pass.ctaText}
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="border-[var(--accent-mint)]/20 border-b border-t bg-void py-16">
        <div className="section-container grid gap-8 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <ShieldCheck size={28} className="mb-3 text-[var(--accent-mint)]" />
            <h4 className="mb-1 font-body text-base font-semibold">100% Instant E-Badge</h4>
            <p className="font-body text-xs text-muted">
              Receive your digital pass &amp; QR code instantly on booking.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket size={28} className="mb-3 text-[var(--accent-mint)]" />
            <h4 className="mb-1 font-body text-base font-semibold">Hostel &amp; Stay Assistance</h4>
            <p className="font-body text-xs text-muted">
              Outstation attendees get priority hostel accommodation guidance.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={28} className="mb-3 text-[var(--accent-mint)]" />
            <h4 className="mb-1 font-body text-base font-semibold">Investor Matchmaking</h4>
            <p className="font-body text-xs text-muted">
              Pass holders get access to the E-Summit digital networking portal.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPass && (
          <div className="bg-void/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-[var(--accent-mint)]/40 relative w-full max-w-lg rounded-2xl border bg-panel p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute right-6 top-6 font-mono-data text-sm text-muted hover:text-white"
              >
                <X size={18} />
              </button>

              {checkoutStep === 'form' ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                      ⚡ Pass Checkout
                    </span>
                    <h3 className="mt-1 font-display text-3xl text-white">
                      Reserve {selectedPass.name}
                    </h3>
                    <p className="mt-1 font-body text-sm text-muted">
                      Total:{' '}
                      <span className="font-semibold text-[var(--accent-mint)]">
                        {selectedPass.price}
                      </span>{' '}
                      (Early Bird Rate)
                    </p>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block font-mono-data text-xs font-bold uppercase text-muted">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block font-mono-data text-xs font-bold uppercase text-muted">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block font-mono-data text-xs font-bold uppercase text-muted">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-mono-data text-xs font-bold uppercase text-muted">
                          College / Org
                        </label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="PEC Chandigarh"
                          className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-void px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-green mt-6 w-full justify-center py-3.5 text-base font-bold"
                    >
                      Confirm Booking ({selectedPass.price})
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="bg-[var(--accent-mint)]/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-mint)] text-[var(--accent-mint)]">
                    <Check size={32} />
                  </div>
                  <h3 className="mb-2 font-display text-3xl text-white">Booking Reserved!</h3>
                  <p className="mb-6 font-body text-sm leading-relaxed text-muted">
                    Congratulations{' '}
                    <span className="font-semibold text-white">{formData.name}</span>! Your pass
                    reservation for{' '}
                    <strong className="text-[var(--accent-mint)]">{selectedPass.name}</strong> is
                    confirmed.
                  </p>
                  <button
                    onClick={() => setSelectedPass(null)}
                    className="btn-green justify-center px-8 py-3"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
      <Concierge />
    </main>
  )
}
