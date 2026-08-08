'use client'
// app/register/page.tsx
// Standalone Dedicated Registration Dashboard & Digital E-Badge Generator (Money/Fintech Theme)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Check, ArrowLeft, ArrowRight, User, Mail, Phone, Building, Calendar, QrCode, ShieldCheck, Ticket, Download, Sparkles, CheckCircle2, Bookmark } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

interface RegistrationRecord {
  id: string
  name: string
  email: string
  phone: string
  college: string
  category: string
  tracks: string[]
  date: string
  qrCodeData: string
}

const REGISTRATION_TYPES = [
  {
    id: 'student',
    title: 'Student General Registration',
    desc: 'Access to keynotes, panels, and open expo floor for college students.',
    fee: 'FREE / ₹0',
    badge: 'GENERAL DELEGATE',
    icon: User,
  },
  {
    id: 'founder',
    title: 'Startup Founder & Pitcher',
    desc: 'Entry for early-stage founders to pitch to VCs and exhibit at Expo.',
    fee: '₹799 / Team',
    badge: 'PITCH DELEGATE',
    icon: Ticket,
  },
  {
    id: 'hackathon',
    title: 'Hackathon Builder',
    desc: '24-hour hackathon entry with all-night meals & developer credits.',
    fee: '₹199 / Hacker',
    badge: 'HACKER DELEGATE',
    icon: Zap,
  },
  {
    id: 'ambassador',
    title: 'Campus Ambassador',
    desc: 'Represent PEC Summit at your college & earn exclusive VIP perks.',
    fee: 'FREE / Ambassador',
    badge: 'CA LEADER',
    icon: Sparkles,
  },
]

const INTEREST_TRACKS = [
  'Artificial Intelligence & ML',
  'Fintech & Payments',
  'Pitch Competition (₹7.5L Pool)',
  '24-Hour Hackathon (₹5.0L Pool)',
  'DeepTech & Hardware',
  'Web3 & Open Source',
]

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [selectedType, setSelectedType] = useState('student')
  const [selectedTracks, setSelectedTracks] = useState<string[]>([])
  const [myRegistrations, setMyRegistrations] = useState<RegistrationRecord[]>([])
  const [activeTab, setActiveTab] = useState<'new' | 'dashboard'>('new')
  const [currentBadge, setCurrentBadge] = useState<RegistrationRecord | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    gradYear: '2026',
    city: 'Chandigarh',
  })

  // Load existing registrations from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pec_summit_registrations')
      if (saved) {
        const parsed = JSON.parse(saved)
        setMyRegistrations(parsed)
        if (parsed.length > 0) {
          setActiveTab('dashboard')
        }
      }
    } catch (e) {
      console.warn('Failed to load registrations:', e)
    }
  }, [])

  const handleTrackToggle = (track: string) => {
    if (selectedTracks.includes(track)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== track))
    } else {
      setSelectedTracks([...selectedTracks, track])
    }
  }

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email.')
      return
    }

    const newRecord: RegistrationRecord = {
      id: `PEC-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98765 43210',
      college: formData.college || 'Punjab Engineering College',
      category: REGISTRATION_TYPES.find((t) => t.id === selectedType)?.title || 'General Student',
      tracks: selectedTracks.length > 0 ? selectedTracks : ['General Keynotes'],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PEC-SUMMIT-2026-${formData.email}`,
    }

    const updated = [newRecord, ...myRegistrations]
    setMyRegistrations(updated)
    setCurrentBadge(newRecord)
    try {
      localStorage.setItem('pec_summit_registrations', JSON.stringify(updated))
    } catch (err) {
      console.warn('LocalStorage save failed:', err)
    }

    setStep(4)
    toast.success('Registration Complete! E-Badge Generated.', {
      style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
      iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

      {/* Header Banner */}
      <section className="relative pt-36 pb-16 border-b border-border-subtle overflow-hidden bg-void">
        <CircuitBoard prefersReduced={false} />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-mint transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Dashboard Tab Switcher */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-panel border border-border-subtle">
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all ${
                  activeTab === 'new'
                    ? 'bg-mint text-void font-bold shadow-[0_0_12px_rgba(126,211,33,0.3)]'
                    : 'text-secondary hover:text-white'
                }`}
              >
                + New Registration
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-mint text-void font-bold shadow-[0_0_12px_rgba(126,211,33,0.3)]'
                    : 'text-secondary hover:text-white'
                }`}
              >
                <Ticket size={13} /> My E-Badges ({myRegistrations.length})
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-4 leading-[1.05]">
              REGISTRATION <br />
              <span className="text-mint">DASHBOARD</span>
            </h1>
            <p className="font-body text-base text-secondary max-w-xl leading-relaxed">
              Complete your delegate pass registration, select your tracks, and instantly generate your digital E-Badge with check-in QR code.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-void">
        <div className="section-container">
          {activeTab === 'dashboard' ? (
            /* ── MY REGISTRATIONS DASHBOARD TAB ── */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl text-white">Your Booked E-Badges</h2>
                <button
                  onClick={() => { setActiveTab('new'); setStep(1) }}
                  className="btn-green text-xs py-2.5 px-4 font-bold"
                >
                  + Register Another Pass
                </button>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="p-16 rounded-2xl bg-panel border border-[var(--accent-mint)]/30 text-center">
                  <Ticket size={48} className="mx-auto mb-4 text-[var(--accent-mint)] opacity-40" />
                  <h3 className="font-display text-2xl mb-2 text-white">No Registrations Found</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    You haven&apos;t completed any registrations yet. Fill out the registration form to generate your digital badge.
                  </p>
                  <button onClick={() => setActiveTab('new')} className="btn-green font-bold">
                    Start Registration
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {myRegistrations.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-2xl p-6 bg-panel border border-[var(--accent-mint)]/30 flex flex-col justify-between shadow-xl relative overflow-hidden group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono-data text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[var(--accent-mint)]/15 text-[var(--accent-mint)] border border-[var(--accent-mint)]/30 font-bold">
                          {rec.category}
                        </span>
                        <span className="font-mono-data text-xs text-[var(--accent-mint)] font-bold">{rec.id}</span>
                      </div>

                      <div className="mb-6">
                        <h3 className="font-body font-bold text-2xl text-white mb-1">{rec.name}</h3>
                        <p className="font-mono-data text-xs text-muted mb-2">{rec.college}</p>
                        <p className="font-mono-data text-xs text-muted">{rec.email}</p>
                      </div>

                      {/* QR Code */}
                      <div className="flex items-center justify-between pt-4 border-t border-[var(--accent-mint)]/20">
                        <div className="text-xs font-mono-data text-muted">
                          <span>Registered: {rec.date}</span>
                          <span className="block text-[var(--accent-mint)] font-bold mt-1">Status: Confirmed</span>
                        </div>
                        <button
                          onClick={() => { setCurrentBadge(rec); setActiveTab('new'); setStep(4) }}
                          className="px-3 py-1.5 rounded-lg bg-void border border-[var(--accent-mint)]/40 text-[var(--accent-mint)] font-mono-data text-xs hover:bg-[var(--accent-mint)] hover:text-void transition-all font-bold"
                        >
                          View E-Badge &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── NEW REGISTRATION WIZARD TAB ── */
            <div className="max-w-3xl mx-auto">
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-[var(--accent-mint)]/20">
                {[
                  { num: 1, label: 'Select Pass' },
                  { num: 2, label: 'Personal Info' },
                  { num: 3, label: 'Track Interests' },
                  { num: 4, label: 'Digital E-Badge' },
                ].map((s) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-mono-data text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-[var(--accent-mint)] text-void shadow-[0_0_15px_rgba(126,211,33,0.5)]'
                          : step > s.num
                          ? 'bg-[var(--accent-mint)]/20 text-[var(--accent-mint)] border border-[var(--accent-mint)]'
                          : 'bg-panel text-muted border border-[var(--accent-mint)]/20'
                      }`}
                    >
                      {step > s.num ? <Check size={14} /> : s.num}
                    </div>
                    <span className="font-mono-data text-xs uppercase hidden sm:inline text-muted">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Select Type */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-display text-3xl text-white mb-2">Step 1: Choose Delegate Category</h2>
                  <p className="font-body text-sm text-muted mb-8">
                    Select your primary registration pass type for PEC Summit 2026.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {REGISTRATION_TYPES.map((type) => {
                      const isSelected = selectedType === type.id
                      const Icon = type.icon
                      return (
                        <div
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`p-6 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-panel border-[var(--accent-mint)] shadow-[0_0_20px_rgba(126,211,33,0.3)]'
                              : 'bg-panel border-[var(--accent-mint)]/20 hover:border-[var(--accent-mint)]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-void border border-[var(--accent-mint)]/30 text-[var(--accent-mint)]">
                                <Icon size={20} />
                              </div>
                              <span className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">{type.fee}</span>
                            </div>

                            <h3 className="font-body font-bold text-lg text-white mb-1">{type.title}</h3>
                            <p className="font-body text-xs text-muted leading-relaxed mb-4">{type.desc}</p>
                          </div>

                          <span className="font-mono-data text-[10px] uppercase tracking-widest text-[var(--accent-mint)] font-bold">
                            Badge: {type.badge}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <button onClick={() => setStep(2)} className="btn-green w-full justify-center py-4 font-bold">
                    Continue to Personal Info &rarr;
                  </button>
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-display text-3xl text-white mb-2">Step 2: Delegate Information</h2>
                  <p className="font-body text-sm text-muted mb-8">
                    Enter details to be printed on your official digital summit pass.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setStep(3)
                    }}
                    className="space-y-4 mb-8"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full px-4 py-3 rounded-lg bg-panel border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="ananya@example.com"
                          className="w-full px-4 py-3 rounded-lg bg-panel border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-lg bg-panel border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
                        />
                      </div>
                      <div>
                        <label className="block font-mono-data text-xs text-muted uppercase mb-1 font-bold">College / Institution</label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="Punjab Engineering College"
                          className="w-full px-4 py-3 rounded-lg bg-panel border border-[var(--accent-mint)]/30 text-white font-body text-sm outline-none focus:border-[var(--accent-mint)]"
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

              {/* Step 3: Select Tracks */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="font-display text-3xl text-white mb-2">Step 3: Track Interests</h2>
                  <p className="font-body text-sm text-muted mb-8">
                    Select sessions and competitions you plan to participate in.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {INTEREST_TRACKS.map((t) => {
                      const isSelected = selectedTracks.includes(t)
                      return (
                        <div
                          key={t}
                          onClick={() => handleTrackToggle(t)}
                          className={`p-4 rounded-xl cursor-pointer border font-body text-sm flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-panel border-[var(--accent-mint)] text-[var(--accent-mint)] font-bold'
                              : 'bg-panel border-[var(--accent-mint)]/20 text-gray-300'
                          }`}
                        >
                          <span>{t}</span>
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected ? 'bg-[var(--accent-mint)] border-[var(--accent-mint)] text-void' : 'border-[var(--accent-mint)]/30'
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
                      className="btn-green flex-1 justify-center py-4 font-bold"
                    >
                      Generate Digital E-Badge &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Digital E-Badge Card */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent-mint)]/20 border border-[var(--accent-mint)] text-[var(--accent-mint)] flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="font-display text-4xl text-white">E-Badge Generated!</h2>
                    <p className="font-body text-sm text-muted">
                      Your official PEC Summit 2026 digital delegate pass is active.
                    </p>
                  </div>

                  {/* Digital Badge Ticket Container */}
                  <div className="max-w-md mx-auto rounded-3xl p-8 bg-panel border-2 border-[var(--accent-mint)] shadow-[0_0_40px_rgba(126,211,33,0.3)] relative overflow-hidden mb-8">
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[var(--accent-mint)] via-[#3DD9FF] to-[var(--accent-mint)]" />

                    {/* Badge Top Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-[var(--accent-mint)]/20 pb-4">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-[var(--accent-mint)] fill-[var(--accent-mint)]" />
                        <span className="font-display text-xl text-white">PEC SUMMIT 2026</span>
                      </div>
                      <span className="font-mono-data text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[var(--accent-mint)]/20 text-[var(--accent-mint)] border border-[var(--accent-mint)]/40 font-bold">
                        {currentBadge?.category || 'DELEGATE'}
                      </span>
                    </div>

                    {/* Delegate Main Details */}
                    <div className="mb-6">
                      <p className="font-mono-data text-xs text-muted uppercase mb-1">Delegate Name</p>
                      <h3 className="font-body font-extrabold text-3xl text-white mb-2">
                        {currentBadge?.name || formData.name}
                      </h3>
                      <p className="font-mono-data text-xs text-[var(--accent-mint)] font-bold">
                        {currentBadge?.college || formData.college}
                      </p>
                    </div>

                    {/* QR Code Section */}
                    <div className="p-4 rounded-2xl bg-void border border-[var(--accent-mint)]/30 flex items-center justify-between gap-4 mb-6">
                      <div>
                        <p className="font-mono-data text-[10px] uppercase text-muted mb-1">Pass ID</p>
                        <p className="font-mono-data text-sm font-bold text-white mb-2">
                          {currentBadge?.id || 'PEC-984210'}
                        </p>
                        <p className="font-mono-data text-[10px] text-[var(--accent-mint)]">
                          Valid for March 15–16, 2026
                        </p>
                      </div>

                      <div className="w-24 h-24 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
                        {/* QR Code graphic */}
                        <img
                          src={
                            currentBadge?.qrCodeData ||
                            `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PEC-SUMMIT-${formData.email}`
                          }
                          alt="Delegate QR Check-in Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Track Badges */}
                    <div className="pt-4 border-t border-[var(--accent-mint)]/20 flex items-center justify-between font-mono-data text-xs text-muted">
                      <span>Venue: PEC Sector 12</span>
                      <span className="text-[var(--accent-mint)] font-bold">Status: Active</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 max-w-md mx-auto">
                    <button
                      onClick={() => window.print()}
                      className="btn-green flex-1 justify-center py-3.5 text-sm font-bold"
                    >
                      <Download size={16} /> Print / Save E-Badge
                    </button>
                    <button
                      onClick={() => { setActiveTab('dashboard'); setStep(1) }}
                      className="btn-ghost flex-1 justify-center"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </motion.div>
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
