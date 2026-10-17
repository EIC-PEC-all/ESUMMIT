'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Ticket,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { TOAST_STYLE } from '@/lib/constants'
import {
  getLocalRegistrations,
  saveLocalRegistrations,
  RegistrationRecord,
} from '@/lib/registrations'

interface AuthCardProps {
  callbackUrl?: string
  onSuccess?: () => void
  title?: string
  subtitle?: string
}

export default function AuthCard({
  callbackUrl = '/profile',
  onSuccess,
  title = 'Attendee Pass Portal',
  subtitle = 'Sign in to access your official PEC E-Summit 2026 passes, entry QR badges, and startup applications.',
}: AuthCardProps) {
  const router = useRouter()
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // ── 1. Google 1-Tap Sign In ──
  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const res = await loginWithGoogle()
      if (res.success) {
        toast.success('Signed in with Google successfully!', TOAST_STYLE)
        window.dispatchEvent(new Event('pec_auth_changed'))
        window.dispatchEvent(new Event('storage'))
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(callbackUrl)
        }
      } else {
        toast.error(res.error || 'Google sign-in was cancelled.', TOAST_STYLE)
      }
    } catch {
      toast.error('Failed to sign in with Google.', TOAST_STYLE)
    } finally {
      setLoading(false)
    }
  }

  // ── 2. Email + Password Sign In / Sign Up ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter a valid email address.', TOAST_STYLE)
      return
    }

    setLoading(true)

    try {
      if (mode === 'signin') {
        const res = await loginWithEmail(email.trim(), password)
        if (res.success) {
          toast.success('Signed in successfully!', TOAST_STYLE)
          window.dispatchEvent(new Event('pec_auth_changed'))
          window.dispatchEvent(new Event('storage'))
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(callbackUrl)
          }
        } else {
          toast.error(res.error || 'Invalid email or password.', TOAST_STYLE)
        }
      } else if (mode === 'signup') {
        if (!name.trim()) {
          toast.error('Please enter your full name.', TOAST_STYLE)
          setLoading(false)
          return
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters.', TOAST_STYLE)
          setLoading(false)
          return
        }
        const res = await registerWithEmail(email.trim(), password, name.trim())
        if (res.success) {
          toast.success('Account created successfully!', TOAST_STYLE)
          window.dispatchEvent(new Event('pec_auth_changed'))
          window.dispatchEvent(new Event('storage'))
          if (onSuccess) {
            onSuccess()
          } else {
            router.push(callbackUrl)
          }
        } else {
          toast.error(res.error || 'Failed to create account.', TOAST_STYLE)
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email.trim())
        if (res.success) {
          toast.success('Password reset link sent to your email.', TOAST_STYLE)
          setMode('signin')
        } else {
          toast.error(res.error || 'Failed to send reset link.', TOAST_STYLE)
        }
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.', TOAST_STYLE)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-panel border border-border-panel shadow-2xl text-left">
      {/* Brand Icon & Heading */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full btn-mint-gradient flex items-center justify-center text-void mx-auto mb-4 shadow-lg">
          <Ticket size={24} className="stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-display text-white">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ── Option 1: 1-Tap Google Sign In ── */}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleSignIn}
        className="w-full py-3.5 px-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-mint text-white font-mono-data text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md disabled:opacity-50"
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

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono font-bold">
          OR WITH EMAIL
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* ── Mode Selector Tabs (Sign In vs Create Account) ── */}
      {mode !== 'forgot' && (
        <div className="flex items-center p-1 rounded-full bg-panel-alt border border-border-subtle mb-4">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
              mode === 'signin'
                ? 'btn-mint-gradient text-void shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
              mode === 'signup'
                ? 'btn-mint-gradient text-void shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>
      )}

      {/* ── Form Inputs ── */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === 'signup' && (
          <div className="space-y-1">
            <label className="text-[11px] font-mono-data text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <UserIcon size={12} className="text-mint" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aryan Sharma"
              className="w-full px-4 py-2.5 rounded-xl bg-panel-alt border border-border-subtle text-white placeholder-neutral-500 font-mono text-xs focus:outline-none focus:border-mint transition-colors"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-mono-data text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Mail size={12} className="text-mint" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@college.edu or gmail.com"
            className="w-full px-4 py-2.5 rounded-xl bg-panel-alt border border-border-subtle text-white placeholder-neutral-500 font-mono text-xs focus:outline-none focus:border-mint transition-colors"
          />
        </div>

        {mode !== 'forgot' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono-data text-neutral-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Lock size={12} className="text-mint" />
                <span>Password</span>
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[10px] font-mono text-mint hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-panel-alt border border-border-subtle text-white placeholder-neutral-500 font-mono text-xs focus:outline-none focus:border-mint transition-colors"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-6 rounded-full btn-mint-gradient text-void font-mono-data font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            'Processing...'
          ) : mode === 'signin' ? (
            'Sign In & Access Passes'
          ) : mode === 'signup' ? (
            'Create Account & Continue'
          ) : (
            'Send Reset Link'
          )}
        </button>

        {mode === 'forgot' && (
          <button
            type="button"
            onClick={() => setMode('signin')}
            className="text-center text-xs font-mono text-neutral-400 hover:text-white mt-1"
          >
            ← Back to Sign In
          </button>
        )}
      </form>
    </div>
  )
}
