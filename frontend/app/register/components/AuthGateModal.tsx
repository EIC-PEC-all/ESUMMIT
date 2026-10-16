'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface AuthGateModalProps {
  authMode: 'login' | 'signup' | 'forgot'
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void
  authEmail: string
  setAuthEmail: (email: string) => void
  authPassword: string
  setAuthPassword: (pwd: string) => void
  authName: string
  setAuthName: (name: string) => void
  authLoading: boolean
  handleAuthSubmit: (e: React.FormEvent) => void
  handleGoogleSignIn: () => void
  onCancel?: () => void
}

export const AuthGateModal: React.FC<AuthGateModalProps> = ({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  authLoading,
  handleAuthSubmit,
  handleGoogleSignIn,
}) => {
  return (
    <motion.div
      key="auth-view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="max-w-sm mx-auto space-y-5 pt-6"
    >
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-[10px] font-bold tracking-wider uppercase font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse" />
          Step 1 of 2: Sign In
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {authMode === 'login' && 'Sign in to PEC E-Summit'}
          {authMode === 'signup' && 'Create Attendee Account'}
          {authMode === 'forgot' && 'Reset Password'}
        </h1>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          {authMode === 'login' &&
            'Sign in with Google to claim, personalize, and link your official summit pass.'}
          {authMode === 'signup' &&
            'Register your account to book passes and unlock hackathon tracks.'}
          {authMode === 'forgot' && 'Enter your email to receive a password reset link.'}
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#13221C] p-5 space-y-3.5 shadow-xl">
        {/* Google Sign-in option */}
        {authMode !== 'forgot' && (
          <>
            <button
              type="button"
              disabled={authLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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

            <div className="flex items-center gap-2 py-0.5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold font-mono">
                or
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          </>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-3">
          {authMode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-neutral-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-mint focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-medium text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              required
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-mint focus:outline-none"
            />
          </div>

          {authMode !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-medium text-neutral-300">
                  Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[10px] text-mint hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:border-mint focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 px-4 rounded-full btn-mint-gradient text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-md"
          >
            {authLoading ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-void border-t-transparent" />
            ) : (
              <span>
                {authMode === 'login' && 'Sign In'}
                {authMode === 'signup' && 'Create Account'}
                {authMode === 'forgot' && 'Send Reset Link'}
              </span>
            )}
          </button>
        </form>

        <div className="text-center pt-1 border-t border-white/10 text-[11px] text-neutral-400">
          {authMode === 'login' && (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-mint font-semibold hover:underline"
              >
                Sign up
              </button>
            </>
          )}
          {authMode === 'signup' && (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-mint font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
          {authMode === 'forgot' && (
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="text-mint font-semibold hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
