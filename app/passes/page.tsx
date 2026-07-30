'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, Sparkles, Star, Users, ArrowRight, Ticket, ArrowLeft } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
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
    tagline: 'Full 2-day access for college students & innovators.',
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
    accentColor: '#3DD9FF',
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
    accentColor: '#FF4D3D',
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
    accentColor: '#9B5CFF',
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
    accentColor: '#FF8C42',
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
    accentColor: '#3DD9FF',
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

    // Store dummy order in localStorage
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
      style: { background: 'var(--bg-panel)', color: 'var(--text-primary)' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-[#8A90A6]/10">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FF4D3D_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-signal transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ignite/10 border border-ignite/30 mb-6">
              <Sparkles size={14} className="text-ignite" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-ignite">
                Official E-Summit 2025 Passes
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              CHOOSE YOUR <br />
              <span style={{ color: 'var(--accent-ignite)' }}>IGNITION PASS</span>
            </h1>

            <p className="font-body text-lg text-muted max-w-xl leading-relaxed mb-8">
              Whether you are pitching your startup to top VCs, hacking overnight for prize pools, or attending high-impact keynotes, grab your pass now before early-bird pricing ends.
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
                  className="px-5 py-2.5 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all duration-200"
                  style={{
                    background: filter === item.id ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.08)',
                    color: filter === item.id ? '#F5F3EE' : 'var(--text-muted)',
                    border: `1px solid ${filter === item.id ? 'transparent' : 'rgba(138,144,166,0.12)'}`,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pass Cards Grid */}
      <section className="py-20 bg-panel/30">
        <div className="section-container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPasses.map((pass) => (
              <motion.div
                key={pass.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  pass.popular ? 'glow-ignite' : ''
                }`}
                style={{
                  background: 'var(--bg-panel)',
                  border: `1px solid ${pass.popular ? 'var(--accent-ignite)' : 'rgba(138,144,166,0.12)'}`,
                }}
              >
                {/* Badge */}
                {pass.badge && (
                  <div
                    className="absolute -top-3.5 right-6 px-3 py-1 rounded-full font-mono-data text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      background: pass.popular ? 'var(--accent-ignite)' : 'rgba(61,217,255,0.15)',
                      color: pass.popular ? '#fff' : 'var(--accent-signal)',
                      border: `1px solid ${pass.popular ? 'transparent' : 'rgba(61,217,255,0.3)'}`,
                    }}
                  >
                    {pass.badge}
                  </div>
                )}

                <div>
                  <h3 className="font-display text-3xl mb-2 text-primary">{pass.name}</h3>
                  <p className="font-body text-sm text-muted mb-6 leading-relaxed">{pass.tagline}</p>

                  <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-[#8A90A6]/10">
                    <span
                      className="font-mono-data text-4xl font-bold"
                      style={{ color: pass.accentColor }}
                    >
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
                  <ul className="space-y-3.5 mb-8">
                    {pass.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3 font-body text-sm text-primary/90">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${pass.accentColor}20` }}
                        >
                          <Check size={12} style={{ color: pass.accentColor }} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPass(pass)}
                  className="w-full py-4 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: pass.popular ? 'var(--accent-ignite)' : 'transparent',
                    color: '#F5F3EE',
                    border: `1px solid ${pass.popular ? 'transparent' : 'rgba(245,243,238,0.2)'}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!pass.popular) {
                      e.currentTarget.style.borderColor = pass.accentColor
                      e.currentTarget.style.color = pass.accentColor
                      e.currentTarget.style.background = `${pass.accentColor}10`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!pass.popular) {
                      e.currentTarget.style.borderColor = 'rgba(245,243,238,0.2)'
                      e.currentTarget.style.color = '#F5F3EE'
                      e.currentTarget.style.background = 'transparent'
                    }
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
      <section className="py-16 border-t border-b border-[#8A90A6]/10 bg-void">
        <div className="section-container grid sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck size={28} className="text-signal mb-3" />
            <h4 className="font-body font-semibold text-base mb-1">100% Instant E-Badge</h4>
            <p className="font-body text-xs text-muted">Receive your digital pass & QR code instantly on booking.</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket size={28} className="text-ignite mb-3" />
            <h4 className="font-body font-semibold text-base mb-1">Hostel & Stay Assistance</h4>
            <p className="font-body text-xs text-muted">Outstation attendees get priority hostel accommodation guidance.</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={28} className="text-signal mb-3" />
            <h4 className="font-body font-semibold text-base mb-1">Investor Matchmaking</h4>
            <p className="font-body text-xs text-muted">Pass holders get access to the E-Summit digital networking portal.</p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl p-8 bg-panel border border-[#8A90A6]/20 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute top-6 right-6 text-muted hover:text-primary font-mono-data text-sm"
              >
                ✕
              </button>

              {checkoutStep === 'form' ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-signal">
                      Pass Checkout Demo
                    </span>
                    <h3 className="font-display text-3xl text-primary mt-1">
                      Reserve {selectedPass.name}
                    </h3>
                    <p className="font-body text-sm text-muted mt-1">
                      Total: <span className="text-primary font-semibold">{selectedPass.price}</span> (Early Bird Rate)
                    </p>
                  </div>

                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-data text-xs text-muted uppercase mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                        />
                      </div>
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1.5">
                          College / Org
                        </label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="PEC Chandigarh"
                          className="w-full px-4 py-3 rounded-lg bg-void border border-[#8A90A6]/20 text-primary font-body text-sm outline-none focus:border-signal"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 btn-ignite justify-center py-3.5 text-base"
                    >
                      Confirm Booking ({selectedPass.price})
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-signal/20 border border-signal text-signal flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-primary mb-2">Booking Reserved!</h3>
                  <p className="font-body text-sm text-muted mb-6 leading-relaxed">
                    Congratulations <span className="text-primary font-semibold">{formData.name}</span>! Your pass reservation for <strong className="text-signal">{selectedPass.name}</strong> is confirmed. A confirmation has been saved to your session.
                  </p>
                  <button
                    onClick={() => setSelectedPass(null)}
                    className="btn-ignite justify-center py-3 px-8"
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
