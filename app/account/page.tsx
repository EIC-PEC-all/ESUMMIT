'use client'
// app/account/page.tsx
// Sign-in / sign-up entry point (also the next-auth `pages.signIn` redirect
// target — see lib/auth.ts). Once authenticated, renders the real passes list
// via MyPassesPanel (GET /registrations/my-passes).

import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LogOut, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Concierge from '@/components/Concierge'
import CircuitBoard from '@/components/Hero/CircuitBoard'
import MyPassesPanel from '@/components/Account/MyPassesPanel'
import MyTeamsPanel from '@/components/Account/MyTeamsPanel'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'

type Mode = 'login' | 'register'

const toastStyle = {
  style: { background: '#0A110E', color: '#FFFFFF', border: '1px solid var(--accent-mint)' },
  iconTheme: { primary: 'var(--accent-mint)', secondary: '#040605' },
}

function AuthForm() {
  const [mode, setMode] = useState<Mode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    college: '',
    gradYear: '',
    city: '',
    referralCode: '',
  })

  const update = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    try {
      // Only pass optional fields when actually filled — next-auth serializes
      // signIn() credentials through URLSearchParams, so an `undefined` value
      // would otherwise get stringified into the literal text "undefined"
      // and shipped to the backend register endpoint.
      const registerExtras: Record<string, string> = {}
      if (formData.phone) registerExtras.phone = formData.phone
      if (formData.college) registerExtras.college = formData.college
      if (formData.gradYear) registerExtras.gradYear = formData.gradYear
      if (formData.city) registerExtras.city = formData.city
      if (formData.referralCode) registerExtras.referralCode = formData.referralCode

      const result = await signIn(mode === 'login' ? 'credentials' : 'credentials-register', {
        redirect: false,
        email: formData.email,
        password: formData.password,
        ...(mode === 'register' ? { name: formData.name, ...registerExtras } : {}),
      })

      if (result?.error) {
        setFormError(result.error)
        toast.error(result.error, toastStyle)
        return
      }

      if (result?.ok) {
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created — you are signed in.', toastStyle)
      }
    } catch {
      setFormError('Something went wrong. Please try again.')
      toast.error('Something went wrong. Please try again.', toastStyle)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-8 flex items-center gap-2 rounded-xl border border-border-subtle bg-panel p-1">
        <button
          onClick={() => {
            setMode('login')
            setFormError(null)
          }}
          className={`flex-1 rounded-lg px-4 py-2.5 font-mono-data text-xs uppercase tracking-wider transition-all ${
            mode === 'login'
              ? 'bg-mint font-bold text-void shadow-[0_0_12px_rgba(126,211,33,0.3)]'
              : 'text-secondary hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setMode('register')
            setFormError(null)
          }}
          className={`flex-1 rounded-lg px-4 py-2.5 font-mono-data text-xs uppercase tracking-wider transition-all ${
            mode === 'register'
              ? 'bg-mint font-bold text-void shadow-[0_0_12px_rgba(126,211,33,0.3)]'
              : 'text-secondary hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.form
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {formError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
              {formError}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={update('name')}
                placeholder="e.g. Ananya Sharma"
                className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={update('email')}
              placeholder="ananya@example.com"
              className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
            />
          </div>

          <div>
            <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
              Password *
            </label>
            <input
              type="password"
              required
              minLength={mode === 'register' ? 8 : undefined}
              value={formData.password}
              onChange={update('password')}
              placeholder="••••••••"
              className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
            />
          </div>

          {mode === 'register' && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={update('phone')}
                  placeholder="+91 98765 43210"
                  className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  College
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={update('college')}
                  placeholder="Punjab Engineering College"
                  className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.gradYear}
                  onChange={update('gradYear')}
                  placeholder="2026"
                  className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                />
              </div>
              <div>
                <label className="mb-1 block font-mono-data text-xs font-bold uppercase text-muted">
                  Referral Code
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={update('referralCode')}
                  placeholder="Optional"
                  className="border-[var(--accent-mint)]/30 w-full rounded-lg border bg-panel px-4 py-3 font-body text-sm text-white outline-none focus:border-[var(--accent-mint)]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-green flex w-full items-center justify-center gap-2 py-3.5 font-bold disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="animate-spin" size={16} />}
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-muted flex items-center justify-center gap-1.5 pt-2 text-[11px]">
            <ShieldCheck className="h-3 w-3" />
            Authenticated against the PEC Summit backend — passwords never touch localStorage.
          </p>
        </motion.form>
      </AnimatePresence>
    </div>
  )
}

export default function AccountPage() {
  const { data: session, status } = useSession()

  return (
    <main className="min-h-screen bg-void text-white">
      <Toaster position="top-center" />
      <Nav />

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

            {status === 'authenticated' && (
              <button
                onClick={() => signOut({ redirect: false })}
                className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-panel px-4 py-2 font-mono-data text-xs uppercase tracking-wider text-secondary transition-colors hover:border-red-500/40 hover:text-red-400"
              >
                <LogOut size={13} /> Sign Out
              </button>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="mb-4 font-display text-3xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white">
              MY <span className="text-mint">ACCOUNT</span>
            </h1>
            <p className="max-w-xl font-body text-base leading-relaxed text-secondary">
              {status === 'authenticated'
                ? 'View your delegate passes and check-in QR codes below.'
                : 'Sign in or create an account to track your delegate passes across devices.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-void py-16">
        <div className="section-container">
          {status === 'loading' ? (
            <div className="flex items-center justify-center gap-2 py-24 text-muted">
              <Loader2 className="animate-spin" size={20} /> Loading your session…
            </div>
          ) : status === 'authenticated' ? (
            <div className="mx-auto max-w-2xl">
              <div className="border-[var(--accent-mint)]/20 mb-8 flex items-center gap-4 rounded-2xl border bg-panel p-6">
                <div className="bg-[var(--accent-mint)]/15 border-[var(--accent-mint)]/30 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-[var(--accent-mint)]">
                  <UserIcon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-body text-lg font-bold text-white">
                    {session?.user?.name || session?.user?.email}
                  </p>
                  <p className="text-muted truncate text-sm">{session?.user?.email}</p>
                </div>
              </div>

              <h2 className="mb-4 font-display text-2xl text-white">Your Passes</h2>
              <MyPassesPanel />

              <div className="mt-8 mb-12 border-t border-border-subtle pt-8">
                <MyTeamsPanel />
              </div>

              <div className="mt-8 text-center">
                <Link href="/passes" className="btn-green inline-flex px-6 py-2.5 text-xs font-bold">
                  + Get Another Pass
                </Link>
              </div>
            </div>
          ) : (
            <AuthForm />
          )}
        </div>
      </section>

      <Footer />
      <Concierge />
    </main>
  )
}
