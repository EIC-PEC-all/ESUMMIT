'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import OnboardingModal from './OnboardingModal'
import {
  AttendeeProfile,
  getStoredProfile,
  isOnboardingComplete,
  fetchUserProfileFromDb,
  PROFILE_UPDATED_EVENT,
} from '@/lib/onboarding'

export default function OnboardingGate() {
  const pathname = usePathname()
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<AttendeeProfile | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isCheckingDb, setIsCheckingDb] = useState(false)

  // Target routes where onboarding is strictly required
  const isGatedRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/passes') ||
    pathname.startsWith('/register')

  const refreshProfile = useCallback(() => {
    const p = getStoredProfile(user?.email)
    setProfile(p)
  }, [user?.email])

  useEffect(() => {
    setIsClient(true)
    const localProf = getStoredProfile(user?.email)
    setProfile(localProf)

    if (user?.email) {
      if (!isOnboardingComplete(localProf)) {
        setIsCheckingDb(true)
        fetchUserProfileFromDb(user.email)
          .then((dbProf) => {
            if (dbProf) {
              setProfile(dbProf)
            }
          })
          .catch(() => {})
          .finally(() => {
            setIsCheckingDb(false)
          })
      } else {
        setIsCheckingDb(false)
      }
    } else {
      setIsCheckingDb(false)
    }

    const handleProfileUpdate = () => {
      refreshProfile()
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
    window.addEventListener('storage', handleProfileUpdate)

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate)
      window.removeEventListener('storage', handleProfileUpdate)
    }
  }, [user?.email, refreshProfile])

  // Hydration safety: do not render anything on server or while auth/db is checking
  if (!isClient || authLoading || isCheckingDb) return null

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

