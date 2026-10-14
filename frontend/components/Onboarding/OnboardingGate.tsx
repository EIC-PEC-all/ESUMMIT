'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import OnboardingModal from './OnboardingModal'
import {
  AttendeeProfile,
  getStoredProfile,
  isOnboardingComplete,
  PROFILE_UPDATED_EVENT,
} from '@/lib/onboarding'

export default function OnboardingGate() {
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<AttendeeProfile | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Target routes where onboarding is strictly required
  const isGatedRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/passes') ||
    pathname.startsWith('/register')

  const refreshProfile = useCallback(() => {
    const p = getStoredProfile()
    setProfile(p)
  }, [])

  useEffect(() => {
    setIsClient(true)
    refreshProfile()

    const handleProfileUpdate = () => {
      refreshProfile()
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
    window.addEventListener('storage', handleProfileUpdate)

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
      window.removeEventListener('storage', handleProfileUpdate)
    }
  }, [refreshProfile])

  // Hydration safety: do not render anything on server
  if (!isClient || authLoading) return null

  // Check if logged in and profile is missing required onboarding fields
  const needsOnboarding = Boolean(user) && isGatedRoute && !isOnboardingComplete(profile)

  return (
    <OnboardingModal
      isOpen={needsOnboarding}
      userDisplayName={user?.displayName}
      userEmail={user?.email}
      initialProfile={profile}
      onCompleted={(saved) => {
        setProfile(saved)
      }}
    />
  )
}
