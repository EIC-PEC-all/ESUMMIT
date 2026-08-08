'use client'
// app/register/page.tsx
// Standalone Dedicated Registration Dashboard & Digital E-Badge Generator (Money/Fintech Theme)

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Check,
  ArrowLeft,
  ArrowRight,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  QrCode,
  ShieldCheck,
  Ticket,
  Download,
  Sparkles,
  CheckCircle2,
  Bookmark,
} from 'lucide-react'
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
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
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

            {/* Dashboard Tab Switcher */}
            <div className="flex items-center gap-2 rounded-xl border border-border-subtle bg-panel p-1">
              <button
                onClick={() => setActiveTab('new')}
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
                <Ticket size={13} /> My E-Badges ({myRegistrations.length})
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
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

      {/* Main Content Area */}
      <section className="bg-void py-16">
        <div className="section-container">
          {activeTab === 'dashboard' ? (
            /* ── MY REGISTRATIONS DASHBOARD TAB ── */
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="font-display text-3xl text-white">Your Booked E-Badges</h2>
                <button
                  onClick={() => {
                    setActiveTab('new')
                    setStep(1)
                  }}
                  className="btn-green px-4 py-2.5 text-xs font-bold"
                >
                  + Register Another Pass
                </button>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="border-[var(--accent-mint)]/30 rounded-2xl border bg-panel p-16 text-center">
                  <Ticket size={48} className="mx-auto mb-4 text-[var(--accent-mint)] opacity-40" />
                  <h3 className="mb-2 font-display text-2xl text-white">No Registrations Found</h3>
                  <p className="mb-6 font-body text-sm text-muted">
                    You haven&apos;t completed any registrations yet. Fill out the registration form
                    to generate your digital badge.
                  </p>
                  <button onClick={() => setActiveTab('new')} className="btn-green font-bold">
                    Start Registration
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {myRegistrations.map((rec) => (
                    <div
                      key={rec.id}
                      className="border-[var(--accent-mint)]/30 group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-panel p-6 shadow-xl"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="bg-[var(--accent-mint)]/15 border-[var(--accent-mint)]/30 rounded border px-2.5 py-1 font-mono-data text-[10px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                          {rec.category}
                        </span>
                        <span className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">
                          {rec.id}
                        </span>
                      </div>

                      <div className="mb-6">
                        <h3 className="mb-1 font-body text-2xl font-bold text-white">{rec.name}</h3>
                        <p className="mb-2 font-mono-data text-xs text-muted">{rec.college}</p>
                        <p className="font-mono-data text-xs text-muted">{rec.email}</p>
                      </div>

                      {/* QR Code */}
                      <div className="border-[var(--accent-mint)]/20 flex items-center justify-between border-t pt-4">
                        <div className="font-mono-data text-xs text-muted">
                          <span>Registered: {rec.date}</span>
                          <span className="mt-1 block font-bold text-[var(--accent-mint)]">
                            Status: Confirmed
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentBadge(rec)
                            setActiveTab('new')
                            setStep(4)
                          }}
                          className="border-[var(--accent-mint)]/40 rounded-lg border bg-void px-3 py-1.5 font-mono-data text-xs font-bold text-[var(--accent-mint)] transition-all hover:bg-[var(--accent-mint)] hover:text-void"
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
            <div className="mx-auto max-w-3xl">
              {/* Stepper Header */}
              <div className="border-[var(--accent-mint)]/20 mb-10 flex items-center justify-between border-b pb-6">
                {[
                  { num: 1, label: 'Select Pass' },
                  { num: 2, label: 'Personal Info' },
                  { num: 3, label: 'Track Interests' },
                  { num: 4, label: 'Digital E-Badge' },
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

              {/* Step 1: Select Type */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                  <h2 className="mb-2 font-display text-3xl text-white">
                    Step 1: Choose Delegate Category
                  </h2>
                  <p className="mb-8 font-body text-sm text-muted">
                    Select your primary registration pass type for PEC Summit 2026.
                  </p>

                  <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    {REGISTRATION_TYPES.map((type) => {
                      const isSelected = selectedType === type.id
                      const Icon = type.icon
                      return (
                        <div
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
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
                                {type.fee}
                              </span>
                            </div>

                            <h3 className="mb-1 font-body text-lg font-bold text-white">
                              {type.title}
                            </h3>
                            <p className="mb-4 font-body text-xs leading-relaxed text-muted">
                              {type.desc}
                            </p>
                          </div>

                          <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                            Badge: {type.badge}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="btn-green w-full justify-center py-4 font-bold"
                  >
                    Continue to Personal Info &rarr;
                  </button>
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
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

              {/* Step 3: Select Tracks */}
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
                      className="btn-green flex-1 justify-center py-4 font-bold"
                    >
                      Generate Digital E-Badge &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Digital E-Badge Card */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="mb-8 text-center">
                    <div className="bg-[var(--accent-mint)]/20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-mint)] text-[var(--accent-mint)]">
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="font-display text-4xl text-white">E-Badge Generated!</h2>
                    <p className="font-body text-sm text-muted">
                      Your official PEC Summit 2026 digital delegate pass is active.
                    </p>
                  </div>

                  {/* Digital Badge Ticket Container */}
                  <div className="relative mx-auto mb-8 max-w-md overflow-hidden rounded-3xl border-2 border-[var(--accent-mint)] bg-panel p-8 shadow-[0_0_40px_rgba(126,211,33,0.3)]">
                    <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-[var(--accent-mint)] via-[#3DD9FF] to-[var(--accent-mint)]" />

                    {/* Badge Top Header */}
                    <div className="border-[var(--accent-mint)]/20 mb-6 flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-2">
                        <Zap
                          size={18}
                          className="fill-[var(--accent-mint)] text-[var(--accent-mint)]"
                        />
                        <span className="font-display text-xl text-white">PEC SUMMIT 2026</span>
                      </div>
                      <span className="bg-[var(--accent-mint)]/20 border-[var(--accent-mint)]/40 rounded border px-2.5 py-1 font-mono-data text-[10px] font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                        {currentBadge?.category || 'DELEGATE'}
                      </span>
                    </div>

                    {/* Delegate Main Details */}
                    <div className="mb-6">
                      <p className="mb-1 font-mono-data text-xs uppercase text-muted">
                        Delegate Name
                      </p>
                      <h3 className="mb-2 font-body text-3xl font-extrabold text-white">
                        {currentBadge?.name || formData.name}
                      </h3>
                      <p className="font-mono-data text-xs font-bold text-[var(--accent-mint)]">
                        {currentBadge?.college || formData.college}
                      </p>
                    </div>

                    {/* QR Code Section */}
                    <div className="border-[var(--accent-mint)]/30 mb-6 flex items-center justify-between gap-4 rounded-2xl border bg-void p-4">
                      <div>
                        <p className="mb-1 font-mono-data text-[10px] uppercase text-muted">
                          Pass ID
                        </p>
                        <p className="mb-2 font-mono-data text-sm font-bold text-white">
                          {currentBadge?.id || 'PEC-984210'}
                        </p>
                        <p className="font-mono-data text-[10px] text-[var(--accent-mint)]">
                          Valid for March 15–16, 2026
                        </p>
                      </div>

                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
                        {/* QR Code graphic */}
                        <img
                          src={
                            currentBadge?.qrCodeData ||
                            `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=PEC-SUMMIT-${formData.email}`
                          }
                          alt="Delegate QR Check-in Code"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Track Badges */}
                    <div className="border-[var(--accent-mint)]/20 flex items-center justify-between border-t pt-4 font-mono-data text-xs text-muted">
                      <span>Venue: PEC Sector 12</span>
                      <span className="font-bold text-[var(--accent-mint)]">Status: Active</span>
                    </div>
                  </div>

                  <div className="mx-auto flex max-w-md flex-wrap gap-4">
                    <button
                      onClick={() => window.print()}
                      className="btn-green flex-1 justify-center py-3.5 text-sm font-bold"
                    >
                      <Download size={16} /> Print / Save E-Badge
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard')
                        setStep(1)
                      }}
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
