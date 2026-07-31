'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, Sparkles, Users, ArrowRight, Ticket, ArrowLeft, X } from 'lucide-react'
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
    accentColor: '#F5D400',
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
    accentColor: '#F5D400',
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
    accentColor: '#F5D400',
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
    accentColor: '#F5D400',
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
    accentColor: '#F5D400',
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
      style: { background: '#151515', color: '#F2F2ED', border: '1px solid #F5D400' },
      iconTheme: { primary: '#F5D400', secondary: '#0A0A0A' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden border-b border-volt-dim/30">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#F5D400_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-volt transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 mb-6">
              <Zap size={14} className="text-volt fill-volt" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-volt">
                Official E-Summit 2025 Passes
              </span>
            </div>

            <h1
              className="font-display leading-none mb-6"
              style={{ fontSize: 'clamp(52px, 8vw, 110px)' }}
            >
              CHOOSE YOUR <br />
              <span className="text-volt">HIGH-VOLTAGE PASS</span>
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
                    background: filter === item.id ? 'var(--accent-volt)' : 'rgba(21,21,21,0.8)',
                    color: filter === item.id ? '#0A0A0A' : 'var(--text-muted)',
                    fontWeight: filter === item.id ? 700 : 400,
                    border: `1px solid ${filter === item.id ? 'transparent' : 'rgba(138,118,0,0.3)'}`,
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
                  pass.popular ? 'glow-volt' : ''
                }`}
                style={{
                  background: 'var(--bg-panel)',
                  border: `1px solid ${pass.popular ? 'var(--accent-volt)' : 'rgba(138,118,0,0.2)'}`,
                }}
              >
                {/* Badge */}
                {pass.badge && (
                  <div
                    className="absolute -top-3.5 right-6 px-3 py-1 rounded-full font-mono-data text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      background: pass.popular ? 'var(--accent-volt)' : 'rgba(245,212,0,0.15)',
                      color: pass.popular ? '#0A0A0A' : 'var(--accent-volt)',
                      border: `1px solid ${pass.popular ? 'transparent' : 'rgba(245,212,0,0.4)'}`,
                    }}
                  >
                    {pass.badge}
                  </div>
                )}

                <div>
                  <h3 className="font-display text-3xl mb-2 text-primary">{pass.name}</h3>
                  <p className="font-body text-sm text-muted mb-6 leading-relaxed">{pass.tagline}</p>

                  <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-[#8C8C86]/10">
                    <span
                      className="font-mono-data text-4xl font-bold text-volt"
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
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-volt/20 text-volt"
                        >
                          <Check size={12} />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPass(pass)}
                  className="w-full py-4 rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200"
                  style={{
                    background: pass.popular ? 'var(--accent-volt)' : 'transparent',
                    color: pass.popular ? '#0A0A0A' : 'var(--text-primary)',
                    border: `1px solid ${pass.popular ? 'transparent' : 'rgba(138,118,0,0.4)'}`,
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
      <section className="py-16 border-t border-b border-volt-dim/30 bg-void">
        <div className="section-container grid sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <ShieldCheck size={28} className="text-volt mb-3" />
            <h4 className="font-body font-semibold text-base mb-1">100% Instant E-Badge</h4>
            <p className="font-body text-xs text-muted">Receive your digital pass & QR code instantly on booking.</p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket size={28} className="text-volt mb-3" />
            <h4 className="font-body font-semibold text-base mb-1">Hostel & Stay Assistance</h4>
            <p className="font-body text-xs text-muted">Outstation attendees get priority hostel accommodation guidance.</p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={28} className="text-volt mb-3" />
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
              className="w-full max-w-lg rounded-2xl p-8 bg-panel border border-volt-dim/40 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute top-6 right-6 text-muted hover:text-primary font-mono-data text-sm"
              >
                <X size={18} />
              </button>

              {checkoutStep === 'form' ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-xs uppercase tracking-widest text-volt">
                      ⚡ Pass Checkout Demo
                    </span>
                    <h3 className="font-display text-3xl text-primary mt-1">
                      Reserve {selectedPass.name}
                    </h3>
                    <p className="font-body text-sm text-muted mt-1">
                      Total: <span className="text-volt font-semibold">{selectedPass.price}</span> (Early Bird Rate)
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
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
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
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
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
                          className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
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
                          className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-6 btn-volt justify-center py-3.5 text-base"
                    >
                      Confirm Booking ({selectedPass.price})
                    </button>
                  </form>
                </>
              ) : (
                <div className="py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-volt/20 border border-volt text-volt flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                  </div>
                  <h3 className="font-display text-3xl text-primary mb-2">Booking Reserved!</h3>
                  <p className="font-body text-sm text-muted mb-6 leading-relaxed">
                    Congratulations <span className="text-primary font-semibold">{formData.name}</span>! Your pass reservation for <strong className="text-volt">{selectedPass.name}</strong> is confirmed. A confirmation has been saved to your session.
                  </p>
                  <button
                    onClick={() => setSelectedPass(null)}
                    className="btn-volt justify-center py-3 px-8"
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
