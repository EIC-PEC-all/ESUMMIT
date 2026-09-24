'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Ticket,
  CheckCircle2,
  Copy,
  Download,
  LogOut,
  LogIn,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  QrCode,
  Calendar,
  MapPin,
  Lock,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Terminal,
  Briefcase,
  Award,
  Check,
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import LimeEdgeMasks from '@/components/Common/LimeEdgeMasks'
import { useAuth } from '@/context/AuthContext'
import { getUserRegistrations, RegistrationRecord } from '@/lib/registrations'
import { TOAST_STYLE } from '@/lib/constants'

interface PassTierConfig {
  id: string
  title: string
  tagline: string
  desc: string
  fee: number
  feeLabel: string
  badge: string
  icon: any
}

const PASS_TIERS: PassTierConfig[] = [
  {
    id: 'student',
    title: 'Student Pass',
    tagline: 'General Access',
    desc: 'Keynotes, keynote panels, open startup expo, and all public workshops.',
    fee: 0,
    feeLabel: 'FREE',
    badge: 'STUDENT PASS',
    icon: GraduationCap,
  },
  {
    id: 'hackathon',
    title: 'Hackathon Pass',
    tagline: '24-Hour Sprint',
    desc: 'Overnight coding workspace, meals, mentorship, and ₹5L+ prize pool.',
    fee: 199,
    feeLabel: '₹199',
    badge: 'HACKATHON PASS',
    icon: Terminal,
  },
  {
    id: 'founder',
    title: 'Pitch Pass',
    tagline: 'Startup Dealroom',
    desc: 'Pitch to VCs, angel investors, expo showcase stall, and 1:1 meetings.',
    fee: 799,
    feeLabel: '₹799',
    badge: 'FOUNDER PASS',
    icon: Briefcase,
  },
  {
    id: 'ambassador',
    title: 'Ambassador',
    tagline: 'Campus Leader',
    desc: 'Represent your college, get VIP access, leadership certification, and goodies.',
    fee: 0,
    feeLabel: 'FREE',
    badge: 'AMBASSADOR PASS',
    icon: Award,
  },
]

export default function ProfileClient() {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, logout, loading: authLoading } = useAuth()
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([])
  const [loadingPasses, setLoadingPasses] = useState(true)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [submittingAuth, setSubmittingAuth] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadPasses = useCallback(async () => {
    setLoadingPasses(true)
    try {
      const records = await getUserRegistrations(user?.uid, user?.email || undefined)
      setRegistrations(records)
    } catch {
      setRegistrations([])
    } finally {
      setLoadingPasses(false)
    }
  }, [user])

  useEffect(() => {
    loadPasses()
  }, [loadPasses])

  // Helper: check if a specific pass tier has already been purchased/claimed
  const isTierOwned = useCallback(
    (tierId: string) => {
      const target = PASS_TIERS.find((p) => p.id === tierId)
      if (!target) return false

      return registrations.some((r) => {
        const cat = (r.category || '').toLowerCase()
        const tId = target.id.toLowerCase()
        const tTitle = target.title.toLowerCase()
        return (
          cat === tId ||
          cat === tTitle ||
          cat.includes(tId) ||
          cat.includes(tTitle) ||
          (tId === 'student' && (cat.includes('general') || cat.includes('student'))) ||
          (tId === 'hackathon' && cat.includes('hack')) ||
          (tId === 'founder' && (cat.includes('pitch') || cat.includes('founder'))) ||
          (tId === 'ambassador' && cat.includes('ambassador'))
        )
      })
    },
    [registrations]
  )

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    toast.success(`Ticket ID ${id} copied!`, TOAST_STYLE)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingAuth(true)
    try {
      if (authMode === 'login') {
        const res = await loginWithEmail(emailInput, passwordInput)
        if (!res.success) {
          toast.error(res.error || 'Failed to sign in', TOAST_STYLE)
        } else {
          toast.success('Signed in successfully!', TOAST_STYLE)
        }
      } else {
        const res = await registerWithEmail(emailInput, passwordInput, nameInput)
        if (!res.success) {
          toast.error(res.error || 'Registration failed', TOAST_STYLE)
        } else {
          toast.success('Account created successfully!', TOAST_STYLE)
        }
      }
    } finally {
      setSubmittingAuth(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setSubmittingAuth(true)
    try {
      const res = await loginWithGoogle()
      if (!res.success) {
        toast.error(res.error || 'Google sign-in failed', TOAST_STYLE)
      } else {
        toast.success('Signed in with Google!', TOAST_STYLE)
      }
    } finally {
      setSubmittingAuth(false)
    }
  }

  return (
    <main
      id="main-content"
      className="bg-void min-h-screen text-white flex flex-col justify-between overflow-x-clip"
      suppressHydrationWarning
    >
      <LimeEdgeMasks />
      <Toaster position="top-center" gutter={8} toastOptions={{ duration: 4000, style: TOAST_STYLE.style }} />
      <Nav />

      {/* Main Container */}
      <div className="relative z-10 flex-1 pt-28 sm:pt-36 pb-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        {/* If user is not signed in: Authentication Prompt */}
        {!user && !authLoading ? (
          <div className="max-w-md mx-auto py-12">
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#0E1F18] border border-white/10 shadow-2xl text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-mint/10 border border-mint/30 flex items-center justify-center mx-auto text-mint">
                <Lock size={28} />
              </div>

              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                  Delegate Portal
                </h1>
                <p className="mt-2 font-body text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Sign in to view your purchased summit passes, check-in QR codes, and registered competition tracks.
                </p>
              </div>

              {/* Google 1-Click Auth */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submittingAuth}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-100 text-void font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0E1F18] px-3 font-mono-data text-[10px] text-gray-500 uppercase tracking-widest absolute">
                  or email
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3 text-left">
                {authMode === 'signup' && (
                  <div>
                    <label className="block font-mono-data text-[10px] uppercase font-bold text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-gray-500 outline-none focus:border-mint transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-mono-data text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. name@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-gray-500 outline-none focus:border-mint transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono-data text-[10px] uppercase font-bold text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder:text-gray-500 outline-none focus:border-mint transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full py-2.5 rounded-xl bg-mint text-void font-bold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer disabled:opacity-50 mt-2"
                >
                  {submittingAuth ? 'Processing...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              <div className="text-xs text-gray-400">
                {authMode === 'login' ? (
                  <p>
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-mint font-semibold hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-mint font-semibold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* User is Signed In: Full Profile & Passes Experience */
          <div className="space-y-12">
            {/* ── 1. User Identity & Overview Card ── */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-[#0F241C] via-[#0B1713] to-void border border-mint/20 shadow-2xl relative overflow-hidden">
              <div
                className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(181,242,61,0.12) 0%, transparent 70%)' }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left: Avatar & User Info */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-mint/15 border-2 border-mint/40 flex items-center justify-center font-display font-black text-2xl sm:text-3xl text-mint shadow-inner overflow-hidden shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <span>{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>

                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mint/10 border border-mint/30 text-mint font-mono-data text-[10px] font-bold uppercase tracking-wider mb-1.5">
                      <ShieldCheck size={11} className="text-mint" />
                      <span>OFFICIAL DELEGATE</span>
                    </div>

                    <h1 className="font-display text-xl sm:text-3xl font-black text-white leading-tight">
                      {user?.displayName || 'Registered Delegate'}
                    </h1>

                    <p className="font-body text-xs sm:text-sm text-gray-300 mt-0.5">{user?.email}</p>
                  </div>
                </div>

                {/* Right: Actions & Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                    <span className="block font-mono-data text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                      Passes Claimed
                    </span>
                    <span className="font-display text-xl font-black text-mint">
                      {registrations.length} / {PASS_TIERS.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => logout()}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 font-mono-data text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── 2. Active Passes Owned Section ── */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-2.5">
                    <Ticket className="text-mint" size={24} />
                    <span>My Summit Passes</span>
                  </h2>
                  <p className="font-body text-xs text-gray-400 mt-1">
                    Present your digital QR check-in badge at the PEC Campus Gate 1 &amp; Main Auditorium registration desk.
                  </p>
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 font-mono-data text-xs font-bold text-mint hover:underline self-start sm:self-auto"
                >
                  <span>Claim Another Tier</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {loadingPasses ? (
                <div className="p-12 text-center text-xs font-mono-data text-gray-400">Loading your passes...</div>
              ) : registrations.length === 0 ? (
                /* Empty state */
                <div className="p-10 rounded-[28px] bg-white/[0.02] border border-dashed border-white/15 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white uppercase">No Active Passes Found</h3>
                    <p className="font-body text-xs text-gray-400 max-w-sm mx-auto mt-1">
                      You haven&apos;t claimed a delegate pass yet. Choose a pass tier below to get instant digital QR check-in credentials.
                    </p>
                  </div>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-mint text-void font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    <span>Claim Your Free Pass</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                /* Passes Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registrations.map((pass) => (
                    <div
                      key={pass.id}
                      className="group relative rounded-[28px] bg-gradient-to-br from-[#0F221A] to-[#08120E] border-2 border-mint/30 p-6 shadow-2xl flex flex-col justify-between gap-6 overflow-hidden"
                    >
                      {/* Top Pass Title & Badge */}
                      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <span className="font-mono-data text-[10px] uppercase font-bold text-mint tracking-widest block mb-1">
                            PEC E-SUMMIT 2026 DELEGATE
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            {pass.category || 'Summit Pass'}
                          </h3>
                          <p className="font-body text-xs text-gray-400 mt-0.5">
                            {pass.college || 'Punjab Engineering College'}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono-data text-[10px] font-bold uppercase tracking-wider">
                            <CheckCircle2 size={11} />
                            <span>CONFIRMED</span>
                          </span>
                        </div>
                      </div>

                      {/* Center: QR Code & Ticket ID */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-black/40 border border-white/10">
                        {/* QR Code */}
                        <div className="w-28 h-28 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center shadow-lg">
                          {pass.qrCodeData ? (
                            <img
                              src={pass.qrCodeData}
                              alt={`QR for ${pass.id}`}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <QrCode size={64} className="text-black" />
                          )}
                        </div>

                        {/* ID Details */}
                        <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
                          <span className="font-mono-data text-[10px] uppercase text-gray-500 font-bold block">
                            TICKET ID / CREDENTIAL
                          </span>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="font-mono-data text-lg font-black text-mint tracking-wider truncate">
                              {pass.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTicket(pass.id)}
                              className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              title="Copy Ticket ID"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                          <p className="font-body text-[11px] text-gray-400">
                            Registered on {pass.date || 'September 2026'}
                          </p>
                        </div>
                      </div>

                      {/* Tracks & Bottom info */}
                      {pass.tracks && pass.tracks.length > 0 && (
                        <div>
                          <span className="font-mono-data text-[10px] uppercase text-gray-500 font-bold block mb-1.5">
                            REGISTERED TRACKS
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pass.tracks.map((track) => (
                              <span
                                key={track}
                                className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[10px] font-mono-data text-gray-300 font-medium"
                              >
                                {track}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Card Bottom: Quick Actions */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono-data text-gray-400">
                        <span>Status: <strong className="text-white">Active (1 of 1 Claimed)</strong></span>
                        <button
                          type="button"
                          onClick={() => {
                            if (pass.qrCodeData) {
                              const link = document.createElement('a')
                              link.download = `PEC_Pass_${pass.id}.png`
                              link.href = pass.qrCodeData
                              link.click()
                              toast.success('Downloaded Pass QR!', TOAST_STYLE)
                            }
                          }}
                          className="inline-flex items-center gap-1.5 text-mint hover:underline font-bold"
                        >
                          <Download size={12} />
                          <span>Save QR</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── 3. Pass Catalog & Purchase Enforcement (Rule: Can't buy already owned pass) ── */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-2.5">
                  <ShieldCheck className="text-mint" size={24} />
                  <span>Pass Tiers &amp; Eligibility</span>
                </h2>
                <p className="font-body text-xs text-gray-400 mt-1">
                  Each delegate is strictly limited to <strong>1 pass per tier</strong>. Already purchased tiers are locked to prevent accidental duplicate charges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {PASS_TIERS.map((tier) => {
                  const owned = isTierOwned(tier.id)
                  const TierIcon = tier.icon

                  return (
                    <div
                      key={tier.id}
                      className={`relative rounded-[24px] p-5 flex flex-col justify-between gap-4 transition-all ${
                        owned
                          ? 'bg-[#0B1E16] border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                          : 'bg-[#0F221A] border border-white/10 hover:border-mint/40 shadow-xl'
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            owned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-mint/10 text-mint'
                          }`}
                        >
                          <TierIcon size={20} />
                        </div>

                        {owned ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono-data text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Check size={10} strokeWidth={3} />
                            <span>PURCHASED</span>
                          </span>
                        ) : (
                          <span className="font-mono-data text-xs font-black text-white">
                            {tier.fee === 0 ? 'FREE' : tier.feeLabel}
                          </span>
                        )}
                      </div>

                      {/* Tier Info */}
                      <div>
                        <span className="font-mono-data text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                          {tier.tagline}
                        </span>
                        <h3 className="font-display text-lg font-black text-white leading-tight mt-0.5">
                          {tier.title}
                        </h3>
                        <p className="font-body text-xs text-gray-300 leading-relaxed mt-1.5">
                          {tier.desc}
                        </p>
                      </div>

                      {/* Action Button: Disabled if owned */}
                      <div className="pt-3 border-t border-white/10">
                        {owned ? (
                          <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-center font-mono-data text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed select-none">
                            <Check size={12} strokeWidth={3} />
                            <span>Owned (1 of 1 Limit)</span>
                          </div>
                        ) : (
                          <Link
                            href={`/register?pass=${tier.id}`}
                            className="w-full py-2.5 px-3 rounded-xl bg-mint hover:bg-white text-void text-center font-mono-data text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>Claim / Purchase</span>
                            <ArrowRight size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
