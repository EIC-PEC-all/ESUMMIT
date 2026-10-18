'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import AuthCard from '@/components/Account/AuthCard'

export default function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  const rawCallback = searchParams?.get('callbackUrl') || searchParams?.get('redirect')
  const callbackUrl = typeof rawCallback === 'string' && rawCallback.startsWith('/') ? rawCallback : '/profile'

  // If already authenticated, redirect straight to target page
  useEffect(() => {
    if (!loading && user) {
      router.replace(callbackUrl)
    }
  }, [user, loading, router, callbackUrl])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-mint border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-mint/10 blur-[140px] rounded-full pointer-events-none" />

      <AuthCard
        callbackUrl={callbackUrl}
        title="Attendee Portal"
        subtitle="Sign in with your Google account to view your passes, QR badges, and access the PEC E-Summit 2026."
      />
    </div>
  )
}
