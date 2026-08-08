'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ShieldCheck, Zap, Users, ArrowRight, Ticket, ArrowLeft, X, QrCode, Sparkles, Download } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import Link from 'next/link'
import TicketPassCard, { PassTier } from '@/components/Common/TicketPassCard'

const PASSES: PassTier[] = [
  {
    id: 'student-general',
    name: 'STUDENT PASS',
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
    ],
    gradient: 'linear-gradient(165deg, #0284C7 0%, #2563EB 30%, #7C3AED 65%, #EC4899 100%)',
    code: 'STU-88742',
    passengerType: 'STUDENT DELEGATE',
    cabinClass: 'GENERAL ACCESS',
    ctaText: 'Claim Student Pass',
  },
  {
    id: 'pitch-competition',
    name: 'PITCH PASS',
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
    ],
    gradient: 'linear-gradient(165deg, #7C3AED 0%, #C026D3 30%, #F43F5E 65%, #F97316 85%, #FBBF24 100%)',
    code: 'PITCH-087636',
    passengerType: 'STARTUP FOUNDER',
    cabinClass: 'PITCH ARENA',
    ctaText: 'Register Startup Team',
  },
  {
    id: 'hackathon-pass',
    name: 'HACKATHON PASS',
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
    ],
    gradient: 'linear-gradient(165deg, #059669 0%, #10B981 30%, #06B6D4 65%, #3B82F6 100%)',
    code: 'HACK-24790',
    passengerType: 'HACKER / BUILDER',
    cabinClass: '24-HR ARENA',
    ctaText: 'Register Hackathon Team',
  },
  {
    id: 'vip-pass',
    name: 'VIP PASS',
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
    ],
    gradient: 'linear-gradient(165deg, #D97706 0%, #F59E0B 35%, #F43F5E 70%, #9333EA 100%)',
    code: 'VIP-00109',
    passengerType: 'VIP INVESTOR',
    cabinClass: 'EXECUTIVE LOUNGE',
    ctaText: 'Get VIP Pass',
  },
  {
    id: 'group-pass',
    name: 'DELEGATION PASS',
    tagline: 'Group discount for college societies & e-cells (5+ Passes).',
    price: '₹249',
    originalPrice: '₹499',
    badge: 'BULK DISCOUNT',
    category: 'group',
    features: [
      'Discounted rate per attendee (Min 5 passes)',
      'Reserved group seating for major panels',
      'Custom Delegation Certificate for college',
      'Dedicated Student Ambassador point-of-contact',
    ],
    gradient: 'linear-gradient(165deg, #4F46E5 0%, #7C3AED 35%, #DB2777 75%, #F43F5E 100%)',
    code: 'GRP-55421',
    passengerType: 'COLLEGE DELEGATION',
    cabinClass: 'GROUP RESERVED',
    ctaText: 'Get Group Pass',
  },
]

export default function PassesPage() {
  const [filter, setFilter] = useState<'all' | 'student' | 'founder' | 'group'>('all')
  const [selectedPass, setSelectedPass] = useState<PassTier | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' })
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>('')

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

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    setConfirmedOrderId(orderId)

    const existingOrders = JSON.parse(localStorage.getItem('pec_summit_orders') || '[]')
    const newOrder = {
      id: orderId,
      passId: selectedPass?.id,
      passName: selectedPass?.name,
      price: selectedPass?.price,
      customer: formData,
      date: new Date().toISOString(),
    }
    existingOrders.push(newOrder)
    localStorage.setItem('pec_summit_orders', JSON.stringify(existingOrders))

    setCheckoutStep('success')
    toast.success(`Ticket Reserved for ${formData.name}!`, {
      style: { background: '#09120E', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)' },
      iconTheme: { primary: '#7ED321', secondary: '#040605' },
    })
  }

  return (
    <main className="relative min-h-screen bg-[#040705] text-white overflow-hidden">
      <Toaster position="top-center" />
      <Nav />

      {/* ── Ambient Mesh Glows ────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-[600px] w-[600px] rounded-full bg-purple-600/15 blur-[160px]" />
      <div className="pointer-events-none absolute right-1/4 top-96 h-[600px] w-[600px] rounded-full bg-pink-600/15 blur-[160px]" />

      {/* Hero Section */}
      <section className="relative bg-[#040705] pt-32 pb-4">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-gray-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1 backdrop-blur-md">
              <Sparkles size={13} className="text-yellow-400" />
              <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-white">
                1,420+ TICKETS ISSUED
              </span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-4 font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase leading-[0.98] tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              SELECT YOUR <br />
              <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                SUMMIT TICKET
              </span>
            </h1>

            <p className="mb-6 max-w-xl font-body text-base sm:text-lg leading-relaxed text-gray-300">
              Whether you are pitching your startup to top VCs, hacking overnight for ₹15L+ prize pools,
              or attending high-impact keynotes, claim your festival ticket pass now.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: 'All Tickets' },
                { id: 'student', label: 'Student & Hackers' },
                { id: 'founder', label: 'Founders & Pitch' },
                { id: 'group', label: 'Group Delegation' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setFilter(item.id as any)}
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
        </div>
      </section>

      {/* Scalloped Barcode Ticket Pass Cards Grid */}
      <section className="bg-[#040705] pt-6 pb-20">
        <div className="section-container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPasses.map((pass) => (
              <TicketPassCard key={pass.id} pass={pass} onSelectPass={handleSelectPass} />
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Banner */}
      <section className="border-t border-b border-white/10 bg-void py-16">
        <div className="section-container grid gap-8 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center">
            <ShieldCheck size={32} className="mb-3 text-cyan-400" />
            <h4 className="mb-1 font-body text-base font-bold text-white">Instant Digital E-Ticket</h4>
            <p className="font-body text-xs text-gray-400 max-w-xs">
              Receive your personalized scalloped barcode ticket &amp; QR code instantly upon booking.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Ticket size={32} className="mb-3 text-fuchsia-400" />
            <h4 className="mb-1 font-body text-base font-bold text-white">Hostel &amp; Stay Assistance</h4>
            <p className="font-body text-xs text-gray-400 max-w-xs">
              Outstation attendees get priority hostel accommodation guidance on PEC campus.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Users size={32} className="mb-3 text-amber-400" />
            <h4 className="mb-1 font-body text-base font-bold text-white">VC Matchmaking Portal</h4>
            <p className="font-body text-xs text-gray-400 max-w-xs">
              All pass holders get exclusive early access to the EIC digital networking portal.
            </p>
          </div>
        </div>
      </section>

      {/* Booking / Receipt Modal */}
      <AnimatePresence>
        {selectedPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-void/85">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-[#09120E] p-6 sm:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPass(null)}
                className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-gray-300 hover:text-white"
              >
                <X size={18} />
              </button>

              {checkoutStep === 'form' ? (
                <>
                  <div className="mb-6">
                    <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      ⚡ TICKET RESERVATION
                    </span>
                    <h3 className="mt-1 font-display text-2xl sm:text-3xl font-black text-white">
                      Reserve {selectedPass.name}
                    </h3>
                    <p className="mt-1 font-mono-data text-xs text-gray-400">
                      Pass Price:{' '}
                      <span className="font-bold text-white">{selectedPass.price}</span> (Early Bird Rate)
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
                      className="mt-6 w-full rounded-xl bg-white py-3.5 font-mono-data text-xs font-black uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-[1.02]"
                    >
                      Confirm Booking ({selectedPass.price})
                    </button>
                  </form>
                </>
              ) : (
                /* ── E-TICKET CONFIRMATION RECEIPT ───────────────────────────────────── */
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 font-mono-data text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
                    <Check size={12} /> CONFIRMED DELEGATE TICKET
                  </div>

                  {/* Scalloped Digital E-Ticket Pass Display */}
                  <div
                    className="relative w-full rounded-2xl p-5 text-black my-4 text-left shadow-2xl border overflow-hidden"
                    style={{ background: selectedPass.gradient }}
                  >
                    {/* Top Header */}
                    <div className="flex items-center justify-between border-b border-black/20 pb-2 mb-3">
                      <span className="font-display text-xs font-black text-white bg-black px-2 py-0.5 rounded">
                        PEC SUMMIT 2026
                      </span>
                      <span className="font-mono-data text-[9px] font-bold text-black">
                        #{confirmedOrderId}
                      </span>
                    </div>

                    {/* Passenger & Ticket Title */}
                    <span className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-black/70 block">
                      PASSENGER
                    </span>
                    <h4 className="font-display text-2xl font-black text-black uppercase leading-tight mb-2">
                      {formData.name}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 font-mono-data text-[10px] font-bold border-y border-black/20 py-2 my-2">
                      <div>
                        <span className="text-black/60 block text-[8px]">TICKET TYPE</span>
                        <span>{selectedPass.name}</span>
                      </div>
                      <div>
                        <span className="text-black/60 block text-[8px]">PRICE</span>
                        <span>{selectedPass.price}</span>
                      </div>
                    </div>

                    {/* QR Code & Barcode */}
                    <div className="flex items-center justify-between pt-2">
                      <QrCode size={36} className="text-black" />
                      <div className="flex h-8 gap-0.5 bg-white/90 p-1 rounded border border-black/20">
                        {[2, 1, 3, 1, 2, 1, 4, 1, 3, 2, 1].map((w, idx) => (
                          <div key={idx} className="h-full bg-black" style={{ width: `${w}px` }} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-xs text-gray-300 mb-6">
                    A copy of your ticket and QR code has been saved locally and sent to{' '}
                    <span className="text-white font-semibold">{formData.email}</span>.
                  </p>

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => {
                        toast.success('Ticket PDF saved to downloads!')
                      }}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 py-3 font-mono-data text-xs font-bold text-white hover:bg-white/20"
                    >
                      <Download size={14} /> Save E-Ticket
                    </button>
                    <button
                      onClick={() => setSelectedPass(null)}
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

      <Footer />
      <Concierge />
    </main>
  )
}
