'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import PassesSection from '@/components/Passes'

export default function PassesUnifiedView() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      const currentUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : '/passes'
      router.replace(`/login?redirect=${encodeURIComponent(currentUrl)}`)
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 border-2 border-mint border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono-data uppercase tracking-wider text-muted">
          Verifying Attendee Access...
        </p>
      </div>
    )
  }

  return <PassesSection isStandalonePage={true} />
}


