'use client'
// app/register/page.tsx
// Executive Bento Registration Portal with Story Badge Exporter

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
  ChevronRight,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react'
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
    title: 'Student Pass',
    desc: 'Access to all keynote addresses, panel discussions, and open startup expo floor for 2 full days.',
    fee: 'FREE',
    badge: 'GENERAL DELEGATE',
    icon: User,
  },
  {
    id: 'founder',
    title: 'Startup Founder & Pitcher',
    desc: 'Pitch directly to VCs & angel networks, physical expo stall, and VC matchmaking lounge.',
    fee: '₹799 / Team',
    badge: 'PITCH DELEGATE',
    icon: Zap,
  },
  {
    id: 'hackathon',
    title: 'Hackathon Builder',
    desc: '24-hour hackathon entry with overnight developer arena, meals, and cloud credits.',
    fee: '₹199 / Hacker',
    badge: 'HACKER DELEGATE',
    icon: Sparkles,
  },
  {
    id: 'ambassador',
    title: 'Campus Ambassador',
    desc: 'Represent PEC Summit at your institution & unlock VIP delegate networking perks.',
    fee: 'FREE',
    badge: 'CA LEADER',
    icon: ShieldCheck,
  },
]

const INTEREST_TRACKS = [
  'Artificial Intelligence & ML',
  'Fintech & Financial Systems',
  'Pitch Competition (₹7.5L Pool)',
  '24-Hour Hackathon (₹5.0L Pool)',
  'DeepTech & Hardware',
  'Web3 & Open Source',
]

const STEPS = [
  { num: 1, label: 'Select Pass' },
  { num: 2, label: 'Delegate Details' },
  { num: 3, label: 'Track Preferences' },
  { num: 4, label: 'Digital E-Badge' },
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
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pec_summit_registrations')
      if (saved) {
        const parsed = JSON.parse(saved)
        setMyRegistrations(parsed)
        if (parsed.length > 0) setActiveTab('dashboard')
      }
    } catch (e) {
      console.warn('Failed to load registrations:', e)
    }
  }, [])

  const handleTrackToggle = (track: string) => {
    setSelectedTracks((prev) =>
      prev.includes(track) ? prev.filter((t) => t !== track) : [...prev, track]
    )
  }

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) {
      toast.error('Please enter your full name and email address.')
      return
    }

    const newRecord: RegistrationRecord = {
      id: `PEC-${Math.floor(100000 + Math.random() * 900000)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98765 43210',
      college: formData.college || 'Punjab Engineering College',
      category: REGISTRATION_TYPES.find((t) => t.id === selectedType)?.title || 'Student Pass',
      tracks: selectedTracks.length > 0 ? selectedTracks : ['General Keynotes'],
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      qrCodeData: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PEC-SUMMIT-2026-${encodeURIComponent(formData.email)}`,
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
    toast.success('Registration Confirmed! E-Badge Issued.', {
      style: { background: '#07130F', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.15)' },
      iconTheme: { primary: '#7ED321', secondary: '#040605' },
    })
  }

  const handleExportInstagramStory = () => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1080
      canvas.height = 1920
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Dark Background Gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 1920)
      bgGradient.addColorStop(0, '#060B08')
      bgGradient.addColorStop(0.5, '#0B1D15')
      bgGradient.addColorStop(1, '#050907')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, 1080, 1920)

      // Ambient Mint Glow
      const glow = ctx.createRadialGradient(540, 960, 0, 540, 960, 600)
      glow.addColorStop(0, 'rgba(126, 211, 33, 0.12)')
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, 1080, 1920)

      // Header Text
      ctx.textAlign = 'center'
      ctx.fillStyle = '#7ED321'
      ctx.font = 'bold 36px monospace'
      ctx.fillText('PEC E-SUMMIT 2026', 540, 220)

      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 84px sans-serif'
      ctx.fillText('OFFICIAL DELEGATE', 540, 320)

      ctx.fillStyle = '#7ED321'
      ctx.font = '900 84px sans-serif'
      ctx.fillText('ACCESS PASS', 540, 410)

      // Glass Ticket Card
      const cardX = 100
      const cardY = 490
      const cardW = 880
      const cardH = 1080

      ctx.save()
      ctx.beginPath()
      ctx.rect(cardX, cardY, cardW, cardH)
      ctx.fillStyle = 'rgba(10, 24, 19, 0.85)'
      ctx.fill()
      ctx.lineWidth = 3
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.stroke()
      ctx.restore()

      // Category Pill
      const categoryText = currentBadge?.category || 'DELEGATE PASS'
      ctx.fillStyle = 'rgba(126, 211, 33, 0.15)'
      ctx.strokeStyle = '#7ED321'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(540 - 180, cardY + 60, 360, 60)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#7ED321'
      ctx.font = 'bold 26px monospace'
      ctx.fillText(categoryText.toUpperCase(), 540, cardY + 100)

      // Name & College
      const nameText = (currentBadge?.name || formData.name || 'DELEGATE NAME').toUpperCase()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = '900 68px sans-serif'
      ctx.fillText(nameText, 540, cardY + 230)

      const collegeText = (currentBadge?.college || formData.college || 'PUNJAB ENGINEERING COLLEGE').toUpperCase()
      ctx.fillStyle = '#A3A3A3'
      ctx.font = 'bold 28px monospace'
      ctx.fillText(collegeText, 540, cardY + 290)

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(160, cardY + 340)
      ctx.lineTo(920, cardY + 340)
      ctx.stroke()

      // QR Code Image
      const qrImg = new Image()
      qrImg.crossOrigin = 'anonymous'
      qrImg.src = currentBadge?.qrCodeData || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PEC-SUMMIT-${formData.email}`
      qrImg.onload = () => {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(540 - 160, cardY + 390, 320, 320)
        ctx.drawImage(qrImg, 540 - 140, cardY + 410, 280, 280)

        ctx.fillStyle = '#7ED321'
        ctx.font = 'bold 32px monospace'
        ctx.fillText(currentBadge?.id || 'PEC-849201', 540, cardY + 760)

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 28px sans-serif'
        ctx.fillText('MARCH 15-16, 2026 • PEC CHANDIGARH', 540, cardY + 840)

        ctx.fillStyle = '#7ED321'
        ctx.font = 'bold 32px sans-serif'
        ctx.fillText("I'M ATTENDING PEC E-SUMMIT '26!", 540, 1680)

        ctx.fillStyle = '#A3A3A3'
        ctx.font = 'bold 24px monospace'
        ctx.fillText('JOIN ME AT ESUMMIT.PEC.AC.IN', 540, 1740)

        const link = document.createElement('a')
        link.download = `PEC_Summit_Story_Badge_${(currentBadge?.name || 'Delegate').replace(/\s+/g, '_')}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()

        toast.success('Instagram Story Badge (1080x1920) Downloaded!', {
          style: { background: '#07130F', color: '#FFFFFF', border: '1px solid #7ED321' },
          iconTheme: { primary: '#7ED321', secondary: '#040605' },
        })
      }
    } catch (err) {
      console.error('Failed to generate story badge:', err)
      toast.error('Failed to generate image. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-[#060B08] text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <Toaster position="top-center" />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] bg-mint/[0.05] rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#3DD9FF]/[0.04] rounded-full blur-[140px]" />
      </div>

      {/* Large Full-Width Bento Modal Window with Subtle Border */}
      <div className="relative z-10 w-full max-w-[96%] xl:max-w-7xl 2xl:max-w-[1500px] rounded-3xl border border-white/10 bg-[#0A1813]/90 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden my-auto">
        
        {/* Top Header: Nav Back & Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono-data text-xs sm:text-sm uppercase tracking-widest text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Return to Main Website</span>
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 p-1.5">
            <button
              onClick={() => { setActiveTab('new'); setStep(1) }}
              className={`rounded-full px-5 py-2 font-mono-data text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'new'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              + New Registration
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 rounded-full px-5 py-2 font-mono-data text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Ticket size={14} />
              <span>My Saved Passes ({myRegistrations.length})</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            /* ── MY PASSES DASHBOARD ── */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
                    YOUR VERIFIED PASSES
                  </h2>
                </div>
                <button
                  onClick={() => { setActiveTab('new'); setStep(1) }}
                  className="rounded-full bg-mint px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-white transition-colors"
                >
                  + Issue Another Pass
                </button>
              </div>

              {myRegistrations.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-16 text-center max-w-md mx-auto">
                  <Ticket size={48} className="mx-auto mb-4 text-neutral-500" />
                  <h3 className="font-display text-2xl font-black uppercase text-white mb-2">No Active Passes</h3>
                  <p className="font-body text-xs text-neutral-400 mb-6">
                    Register below to generate your digital E-Badge with QR check-in credentials.
                  </p>
                  <button
                    onClick={() => setActiveTab('new')}
                    className="rounded-full bg-mint px-8 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-white transition-colors"
                  >
                    Start Registration
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myRegistrations.map((rec) => (
                    <div
                      key={rec.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col justify-between hover:border-white/20 transition-colors shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono-data text-[10px] font-bold uppercase tracking-wider text-white">
                            {rec.category}
                          </span>
                          <span className="font-mono-data text-xs font-bold text-neutral-400">{rec.id}</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white mb-1">{rec.name}</h3>
                        <p className="font-mono-data text-xs text-neutral-400">{rec.college}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono-data text-xs font-bold text-mint">● Confirmed Delegate</span>
                        <button
                          onClick={() => { setCurrentBadge(rec); setActiveTab('new'); setStep(4) }}
                          className="font-mono-data text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          View E-Badge <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* ── SPLIT BENTO REGISTRATION FLOW ── */
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch"
            >
              {/* LEFT COLUMN: Main Branding & Stepper (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8 pr-0 lg:pr-4 border-r-0 lg:border-r border-white/10">
                <div>
                  <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
                    DELEGATE <br />
                    <span className="text-mint">REGISTRATION</span>
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
                    Complete your registration in 3 simple steps to instantly issue your official digital delegate pass with check-in QR code.
                  </p>
                </div>

                {/* Vertical Stepper List with Clean Left Accent */}
                <div className="space-y-3 py-2">
                  {STEPS.map((s) => {
                    const isActive = step === s.num
                    const isDone = step > s.num
                    return (
                      <div
                        key={s.num}
                        className={`flex items-center gap-4 p-3.5 sm:p-4 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-white/[0.08] text-white font-bold border-l-2 border-mint'
                            : isDone
                            ? 'text-neutral-300'
                            : 'text-neutral-500'
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-xl flex items-center justify-center font-mono-data text-xs font-bold shrink-0 ${
                            isActive
                              ? 'bg-mint text-black'
                              : isDone
                              ? 'bg-white/10 text-white'
                              : 'bg-white/5 text-neutral-500'
                          }`}
                        >
                          {isDone ? <Check size={14} /> : s.num}
                        </div>
                        <span className="font-mono-data text-xs sm:text-sm font-bold uppercase tracking-wider">
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {/* Summit Venue Info */}
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 font-mono-data text-xs space-y-2 text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-white shrink-0" />
                    <span>March 15–16, 2026 (2-Day Summit)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-white shrink-0" />
                    <span>Punjab Engineering College, Sector 12</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Dynamic Step Panel (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between min-h-[460px]">
                <AnimatePresence mode="wait">
                  {/* ── STEP 1: PASS SELECTION ── */}
                  {step === 1 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <div className="mb-4">
                          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                            Choose Pass Category
                          </h2>
                          <p className="font-body text-xs sm:text-sm text-neutral-400 mt-1">
                            Select your primary pass tier to continue.
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {REGISTRATION_TYPES.map((type) => {
                            const isSelected = selectedType === type.id
                            const Icon = type.icon
                            return (
                              <div
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all flex flex-col justify-between min-h-[160px] ${
                                  isSelected
                                    ? 'border-white/20 bg-mint/[0.06] shadow-md'
                                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <div
                                      className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                                        isSelected
                                          ? 'border-white/20 bg-mint/20 text-mint'
                                          : 'border-white/10 bg-white/5 text-neutral-400'
                                      }`}
                                    >
                                      <Icon size={18} />
                                    </div>
                                    <span
                                      className={`font-mono-data text-xs sm:text-sm font-bold ${
                                        isSelected ? 'text-white' : 'text-neutral-400'
                                      }`}
                                    >
                                      {type.fee}
                                    </span>
                                  </div>
                                  <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white mb-1">
                                    {type.title}
                                  </h3>
                                  <p className="font-body text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                    {type.desc}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex justify-end">
                        <button
                          onClick={() => setStep(2)}
                          className="rounded-full bg-mint px-9 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <span>Continue to Personal Info</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 2: DELEGATE DETAILS ── */}
                  {step === 2 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mb-1">
                          Delegate Information
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-neutral-400 mb-6">
                          Enter your details exactly as they should be printed on your pass.
                        </p>

                        <form
                          id="reg-form"
                          onSubmit={(e) => {
                            e.preventDefault()
                            setStep(3)
                          }}
                          className="space-y-4"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block font-mono-data text-xs font-bold uppercase text-neutral-400 mb-1.5">
                                Full Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Ananya Sharma"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-sm text-white outline-none focus:border-white/30 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block font-mono-data text-xs font-bold uppercase text-neutral-400 mb-1.5">
                                Email Address *
                              </label>
                              <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ananya@example.com"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-sm text-white outline-none focus:border-white/30 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block font-mono-data text-xs font-bold uppercase text-neutral-400 mb-1.5">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98765 43210"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-sm text-white outline-none focus:border-white/30 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block font-mono-data text-xs font-bold uppercase text-neutral-400 mb-1.5">
                                College / Institution
                              </label>
                              <input
                                type="text"
                                value={formData.college}
                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                placeholder="Punjab Engineering College"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-body text-sm text-white outline-none focus:border-white/30 transition-colors"
                              />
                            </div>
                          </div>
                        </form>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="rounded-full border border-white/15 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 hover:border-white transition-colors"
                        >
                          &larr; Back
                        </button>
                        <button
                          type="submit"
                          form="reg-form"
                          className="rounded-full bg-mint px-9 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <span>Next: Select Tracks</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 3: TRACK SELECTION ── */}
                  {step === 3 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mb-1">
                          Track Preferences
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-neutral-400 mb-6">
                          Select the event tracks you plan to participate in.
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {INTEREST_TRACKS.map((t) => {
                            const isSelected = selectedTracks.includes(t)
                            return (
                              <div
                                key={t}
                                onClick={() => handleTrackToggle(t)}
                                className={`cursor-pointer rounded-2xl border p-4 flex items-center justify-between text-xs sm:text-sm font-body transition-all ${
                                  isSelected
                                    ? 'border-white/20 bg-mint/[0.06] text-white font-bold shadow-md'
                                    : 'border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/20'
                                }`}
                              >
                                <span>{t}</span>
                                <div
                                  className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                    isSelected ? 'border-white/20 bg-mint text-black' : 'border-white/20'
                                  }`}
                                >
                                  {isSelected && <Check size={12} />}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => setStep(2)}
                          className="rounded-full border border-white/15 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 hover:border-white transition-colors"
                        >
                          &larr; Back
                        </button>
                        <button
                          onClick={handleCompleteRegistration}
                          className="rounded-full bg-mint px-9 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <span>Issue Digital E-Badge</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: DIGITAL E-BADGE ISSUED ── */}
                  {step === 4 && (
                    <motion.div
                      key="s4"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6 flex-1 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-12 w-12 rounded-full bg-mint/20 border border-mint/40 text-mint flex items-center justify-center shrink-0">
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                              E-Badge Confirmed
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-neutral-400">
                              Your official delegate pass has been issued for PEC E-Summit 2026.
                            </p>
                          </div>
                        </div>

                        {/* Digital Badge Ticket Container */}
                        <div className="rounded-3xl border border-white/15 bg-black/60 p-6 sm:p-8 shadow-2xl space-y-6">
                          <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                              <Zap size={18} className="fill-mint text-mint" />
                              <span className="font-display text-lg font-black text-white">PEC SUMMIT 2026</span>
                            </div>
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono-data text-xs font-bold uppercase text-white">
                              {currentBadge?.category || 'DELEGATE'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-6">
                            <div>
                              <span className="font-mono-data text-xs text-neutral-400 uppercase tracking-widest block mb-1">
                                DELEGATE NAME
                              </span>
                              <h3 className="font-display text-3xl font-black text-white">
                                {currentBadge?.name || formData.name}
                              </h3>
                              <p className="font-mono-data text-xs text-mint font-bold mt-1">
                                {currentBadge?.college || formData.college || 'PEC Chandigarh'}
                              </p>
                            </div>
                            <div className="h-24 w-24 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center">
                              <img
                                src={currentBadge?.qrCodeData || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PEC-SUMMIT-${formData.email}`}
                                alt="Check-in QR"
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
                        <button
                          onClick={handleExportInstagramStory}
                          className="rounded-full bg-mint px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:bg-white transition-colors flex items-center gap-2 shadow-lg"
                        >
                          <Sparkles size={16} /> Export Story Badge (1080x1920)
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:border-white transition-colors flex items-center gap-2"
                        >
                          <Download size={16} /> Print Pass
                        </button>
                        <button
                          onClick={() => { setActiveTab('dashboard'); setStep(1) }}
                          className="rounded-full border border-white/15 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-300 hover:border-white transition-colors"
                        >
                          View Saved Passes
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
