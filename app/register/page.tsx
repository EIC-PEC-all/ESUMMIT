'use client'
// app/register/page.tsx
// Standalone Dedicated Registration Dashboard & Digital E-Badge Generator (Voltage Theme)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Check, ArrowLeft, ArrowRight, User, Mail, Phone, Building, Calendar, QrCode, ShieldCheck, Ticket, Download, Sparkles, CheckCircle2, Bookmark } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
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
      qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PEC-SUMMIT-2025-${formData.email}`,
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
      style: { background: '#151515', color: '#F2F2ED', border: '1px solid #F5D400' },
      iconTheme: { primary: '#F5D400', secondary: '#0A0A0A' },
    })
  }

  return (
    <main className="min-h-screen bg-void text-primary">
      <Toaster position="top-center" />
      <Nav />

      {/* Header Banner */}
      <section className="relative pt-36 pb-16 border-b border-volt-dim/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#F5D400_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="section-container relative z-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-widest text-muted hover:text-volt transition-colors"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            {/* Dashboard Tab Switcher */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-panel border border-volt-dim/30">
              <button
                onClick={() => setActiveTab('new')}
                className="px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all"
                style={{
                  background: activeTab === 'new' ? 'var(--accent-volt)' : 'transparent',
                  color: activeTab === 'new' ? '#0A0A0A' : 'var(--text-muted)',
                  fontWeight: activeTab === 'new' ? 700 : 400,
                }}
              >
                + New Registration
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 rounded-lg font-mono-data text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                style={{
                  background: activeTab === 'dashboard' ? 'var(--accent-volt)' : 'transparent',
                  color: activeTab === 'dashboard' ? '#0A0A0A' : 'var(--text-muted)',
                  fontWeight: activeTab === 'dashboard' ? 700 : 400,
                }}
              >
                <Ticket size={13} /> My E-Badges ({myRegistrations.length})
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 mb-6">
              <Zap size={14} className="text-volt fill-volt" />
              <span className="font-mono-data text-xs uppercase tracking-wider text-volt">
                Official Delegate Portal
              </span>
            </div>

            <h1
              className="font-display leading-none mb-4"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
            >
              REGISTRATION <br />
              <span className="text-volt">DASHBOARD</span>
            </h1>
            <p className="font-body text-base text-muted max-w-xl leading-relaxed">
              Complete your delegate pass registration, select your tracks, and instantly generate your digital E-Badge with check-in QR code.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-panel/30">
        <div className="section-container">
          {activeTab === 'dashboard' ? (
            /* ── MY REGISTRATIONS DASHBOARD TAB ── */
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-3xl text-primary">Your Booked E-Badges</h2>
                <button
                  onClick={() => { setActiveTab('new'); setStep(1) }}
                  className="btn-volt text-xs py-2.5 px-4"
                >
                  + Register Another Pass
                </button>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="p-16 rounded-2xl bg-panel border border-volt-dim/30 text-center">
                  <Ticket size={48} className="mx-auto mb-4 text-volt opacity-40" />
                  <h3 className="font-display text-2xl mb-2 text-primary">No Registrations Found</h3>
                  <p className="font-body text-sm text-muted mb-6">
                    You haven&apos;t completed any registrations yet. Fill out the registration form to generate your digital badge.
                  </p>
                  <button onClick={() => setActiveTab('new')} className="btn-volt">
                    Start Registration
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {myRegistrations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl p-6 bg-void border border-volt-dim/40 glow-volt shadow-2xl relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Bar */}
                      <div className="flex items-center justify-between border-b border-volt-dim/20 pb-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Zap size={16} className="text-volt fill-volt" />
                          <span className="font-display text-lg text-primary">PEC SUMMIT 2025</span>
                        </div>
                        <span className="font-mono-data text-xs text-volt font-bold">
                          {rec.id}
                        </span>
                      </div>

                      {/* Attendee Details */}
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="font-mono-data text-[10px] uppercase text-muted block">Delegate Name</span>
                          <h4 className="font-body font-bold text-xl text-primary">{rec.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-2 font-mono-data text-xs">
                          <div>
                            <span className="text-muted block text-[10px]">Pass Type</span>
                            <span className="text-volt font-semibold">{rec.category}</span>
                          </div>
                          <div>
                            <span className="text-muted block text-[10px]">College / Org</span>
                            <span className="text-primary truncate block">{rec.college}</span>
                          </div>
                        </div>

                        <div>
                          <span className="font-mono-data text-[10px] uppercase text-muted block mb-1">Selected Tracks</span>
                          <div className="flex flex-wrap gap-1">
                            {rec.tracks.map((t, idx) => (
                              <span key={idx} className="font-mono-data text-[9px] px-2 py-0.5 rounded bg-panel text-volt border border-volt/20">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* QR Code & Footer */}
                      <div className="pt-4 border-t border-volt-dim/20 flex items-center justify-between bg-panel/50 -mx-6 -mb-6 p-6 rounded-b-2xl">
                        <div>
                          <p className="font-mono-data text-[10px] text-muted">Status: Confirmed ✓</p>
                          <p className="font-mono-data text-[10px] text-muted">Venue: PEC Campus, Sect 12</p>
                        </div>
                        <img
                          src={rec.qrCodeData}
                          alt="Check-in QR Code"
                          className="w-16 h-16 rounded-lg bg-white p-1 border border-volt"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── NEW MULTI-STEP REGISTRATION FORM TAB ── */
            <div className="max-w-3xl mx-auto bg-panel border border-volt-dim/30 rounded-2xl p-8 shadow-2xl">
              {/* Stepper Progress */}
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-volt-dim/20 font-mono-data text-xs">
                {[
                  { s: 1, l: 'Category' },
                  { s: 2, l: 'Details' },
                  { s: 3, l: 'Tracks' },
                  { s: 4, l: 'E-Badge' },
                ].map(({ s, l }) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold transition-all ${
                        step === s
                          ? 'bg-volt text-black'
                          : step > s
                          ? 'bg-volt/20 text-volt border border-volt'
                          : 'bg-void text-muted border border-volt-dim/30'
                      }`}
                    >
                      {step > s ? <Check size={14} /> : s}
                    </div>
                    <span className={`hidden sm:inline ${step === s ? 'text-volt font-bold' : 'text-muted'}`}>
                      {l}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step 1: Select Type */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-display text-3xl mb-2 text-primary">1. Select Delegate Category</h3>
                  <p className="font-body text-sm text-muted mb-8">Choose the pass type that best describes your participation.</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    {REGISTRATION_TYPES.map((type) => {
                      const isSelected = selectedType === type.id
                      const IconComp = type.icon
                      return (
                        <div
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`cursor-pointer rounded-xl p-6 border transition-all ${
                            isSelected
                              ? 'bg-void border-volt glow-volt'
                              : 'bg-void/50 border-volt-dim/25 hover:border-volt/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <IconComp size={22} className={isSelected ? 'text-volt' : 'text-muted'} />
                            <span className={`font-mono-data text-[10px] font-bold px-2 py-0.5 rounded ${
                              isSelected ? 'bg-volt text-black' : 'bg-panel text-muted'
                            }`}>
                              {type.badge}
                            </span>
                          </div>
                          <h4 className="font-body font-bold text-base text-primary mb-1">{type.title}</h4>
                          <p className="font-body text-xs text-muted leading-relaxed mb-3">{type.desc}</p>
                          <span className="font-mono-data text-xs font-bold text-volt">{type.fee}</span>
                        </div>
                      )
                    })}
                  </div>

                  <button onClick={() => setStep(2)} className="btn-volt w-full justify-center py-3.5 text-base">
                    Next: Personal Details <ArrowRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Personal Details */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-display text-3xl mb-2 text-primary">2. Delegate Information</h3>
                  <p className="font-body text-sm text-muted mb-8">Enter your details to issue your official summit credentials.</p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block font-mono-data text-xs uppercase text-muted mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                      />
                    </div>

                    <div>
                      <label className="block font-mono-data text-xs uppercase text-muted mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ananya@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-mono-data text-xs uppercase text-muted mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                        />
                      </div>
                      <div>
                        <label className="block font-mono-data text-xs uppercase text-muted mb-1.5">College / Organization</label>
                        <input
                          type="text"
                          value={formData.college}
                          onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                          placeholder="Punjab Engineering College"
                          className="w-full px-4 py-3 rounded-lg bg-void border border-volt-dim/30 text-primary font-body text-sm outline-none focus:border-volt"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center py-3.5">
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (!formData.name || !formData.email) {
                          toast.error('Please enter your name and email.')
                          return
                        }
                        setStep(3)
                      }}
                      className="btn-volt flex-1 justify-center py-3.5"
                    >
                      Next: Select Tracks <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Track Selection */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="font-display text-3xl mb-2 text-primary">3. Track &amp; Session Interests</h3>
                  <p className="font-body text-sm text-muted mb-8">Select the primary tracks you plan to attend (helps us assign seating).</p>

                  <div className="space-y-3 mb-8">
                    {INTEREST_TRACKS.map((track) => {
                      const isChecked = selectedTracks.includes(track)
                      return (
                        <div
                          key={track}
                          onClick={() => handleTrackToggle(track)}
                          className={`cursor-pointer rounded-xl p-4 border flex items-center justify-between transition-all ${
                            isChecked ? 'bg-void border-volt text-volt font-bold' : 'bg-void/50 border-volt-dim/20 text-muted'
                          }`}
                        >
                          <span className="font-body text-sm">{track}</span>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                            isChecked ? 'bg-volt border-volt text-black' : 'border-volt-dim/40'
                          }`}>
                            {isChecked && <Check size={12} />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="btn-ghost flex-1 justify-center py-3.5">
                      Back
                    </button>
                    <button onClick={handleCompleteRegistration} className="btn-volt flex-1 justify-center py-3.5">
                      Complete Registration &amp; Get Badge <Zap size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Digital E-Badge Instant Result */}
              {step === 4 && currentBadge && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-4">
                  <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-volt/20 border border-volt text-volt flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-display text-3xl text-primary mb-1">Registration Complete!</h3>
                    <p className="font-body text-sm text-muted">Your digital summit pass is active and saved to your session.</p>
                  </div>

                  {/* Generated Badge Graphic */}
                  <div className="rounded-2xl p-6 bg-void border border-volt text-primary glow-volt shadow-2xl relative max-w-md mx-auto mb-8">
                    <div className="flex items-center justify-between border-b border-volt-dim/30 pb-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-volt fill-volt" />
                        <span className="font-display text-xl text-primary">PEC SUMMIT 2025</span>
                      </div>
                      <span className="font-mono-data text-xs text-volt font-bold">{currentBadge.id}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="font-mono-data text-[10px] uppercase text-muted block">Delegate</span>
                        <h4 className="font-body font-bold text-2xl text-primary">{currentBadge.name}</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2 font-mono-data text-xs">
                        <div>
                          <span className="text-muted block text-[10px]">Pass Type</span>
                          <span className="text-volt font-semibold">{currentBadge.category}</span>
                        </div>
                        <div>
                          <span className="text-muted block text-[10px]">College</span>
                          <span className="text-primary truncate block">{currentBadge.college}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-volt-dim/30 flex items-center justify-between bg-panel/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
                      <div>
                        <p className="font-mono-data text-[10px] text-muted">Status: Confirmed ✓</p>
                        <p className="font-mono-data text-[10px] text-muted">Issued: {currentBadge.date}</p>
                      </div>
                      <img
                        src={currentBadge.qrCodeData}
                        alt="Check-in QR Code"
                        className="w-16 h-16 rounded-lg bg-white p-1 border border-volt"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => window.print()}
                      className="btn-ghost flex-1 justify-center py-3 text-xs"
                    >
                      <Download size={14} /> Print / Save E-Badge
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="btn-volt flex-1 justify-center py-3 text-xs"
                    >
                      Go to My Registrations Dashboard &rarr;
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
