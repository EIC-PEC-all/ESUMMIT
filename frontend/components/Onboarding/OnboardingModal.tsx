'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  GraduationCap,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  AttendeeProfile,
  GRADUATION_YEARS,
  normalizeGradYear,
  saveStoredProfile,
} from '@/lib/onboarding'
import { STATE_NAMES, getCitiesForState } from '@/data/indiaLocations'
import { TOAST_STYLE } from '@/lib/constants'

interface OnboardingModalProps {
  isOpen: boolean
  userDisplayName?: string | null
  userEmail?: string | null
  initialProfile?: AttendeeProfile | null
  onClose?: () => void
  onCompleted: (profile: AttendeeProfile) => void
}

export default function OnboardingModal({
  isOpen,
  userDisplayName,
  userEmail,
  initialProfile,
  onClose,
  onCompleted,
}: OnboardingModalProps) {
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [customCity, setCustomCity] = useState('')
  const [gradYear, setGradYear] = useState('1st Year (Class of 2030)')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableCities = getCitiesForState(selectedState)
  const finalCity = selectedCity === 'Other' ? customCity.trim() : selectedCity.trim()

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || userDisplayName || '')
      setCollege(initialProfile.college || '')
      setGradYear(normalizeGradYear(initialProfile.gradYear) || '1st Year (Class of 2030)')
      setPhone(initialProfile.phone || '')
      const st = initialProfile.state || ''
      setSelectedState(st)
      if (st) {
        const cities = getCitiesForState(st)
        const c = initialProfile.city || ''
        if (cities.includes(c)) {
          setSelectedCity(c)
          setCustomCity('')
        } else if (c) {
          setSelectedCity('Other')
          setCustomCity(c)
        } else {
          setSelectedCity('')
          setCustomCity('')
        }
      } else {
        setSelectedCity('')
        setCustomCity('')
      }
    } else {
      setName(userDisplayName || '')
    }
  }, [initialProfile, userDisplayName])

  if (!isOpen) return null

  const handleStateChange = (newState: string) => {
    setSelectedState(newState)
    setSelectedCity('')
    setCustomCity('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedName = name.trim()
    const trimmedCollege = college.trim()

    if (!trimmedName) {
      toast.error('Please enter your full name.', TOAST_STYLE)
      return
    }

    if (!trimmedCollege) {
      toast.error('Please enter your college or institution name.', TOAST_STYLE)
      return
    }

    if (!selectedState.trim()) {
      toast.error('Please select your state or UT.', TOAST_STYLE)
      return
    }

    if (!finalCity) {
      toast.error('Please select or specify your city.', TOAST_STYLE)
      return
    }

    if (!gradYear) {
      toast.error('Please select your graduation year.', TOAST_STYLE)
      return
    }

    setIsSubmitting(true)

    try {
      const saved = saveStoredProfile({
        name: trimmedName,
        email: userEmail || initialProfile?.email || '',
        college: trimmedCollege,
        state: selectedState,
        city: finalCity,
        gradYear,
        phone: phone.trim(),
        onboardingCompleted: true,
      })

      toast.success('Profile setup complete!', TOAST_STYLE)
      onCompleted(saved)
    } catch {
      toast.error('Could not save profile. Please try again.', TOAST_STYLE)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-backdrop backdrop-blur-md overflow-y-auto cursor-pointer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget && onClose) {
            onClose()
          }
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-lg my-8 rounded-3xl border border-border-panel bg-panel p-6 sm:p-8 shadow-2xl space-y-6 relative text-primary cursor-default"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-mint/10 border border-mint/20 text-mint text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheck size={12} className="text-mint shrink-0" />
              <span>Attendee Verification • Step 1 of 1</span>
            </div>

            <h2
              id="onboarding-modal-title"
              className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-primary leading-tight"
            >
              Complete Your Profile
            </h2>

            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Enter your college and graduation year to unlock official delegate passes, check-in badges, and summit features.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="onboarding-name"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
              >
                Full Name <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="onboarding-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aryan Sharma"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* College Name */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="onboarding-college"
                  className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
                >
                  College / Institute Name <span className="text-mint">*</span>
                </label>
                <span className="text-[10px] font-mono text-muted uppercase">Required</span>
              </div>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="onboarding-college"
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Punjab Engineering College (PEC)"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* State & City (Cascading Dropdowns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* State / UT */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="onboarding-state"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
                  >
                    State / UT <span className="text-mint">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-muted uppercase">36 Covered</span>
                </div>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <select
                    id="onboarding-state"
                    required
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-8 py-2.5 text-sm text-primary outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-panel text-muted">
                      Select State / UT
                    </option>
                    {STATE_NAMES.map((st) => (
                      <option key={st} value={st} className="bg-panel text-primary">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="onboarding-city"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
                  >
                    City / District <span className="text-mint">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-muted uppercase">
                    {selectedState ? `${availableCities.length} Cities` : 'Select State'}
                  </span>
                </div>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                  <select
                    id="onboarding-city"
                    required
                    disabled={!selectedState}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-8 py-2.5 text-sm text-primary outline-none focus:border-mint transition-colors appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled className="bg-panel text-muted">
                      {selectedState ? `Select City in ${selectedState}` : 'Select State / UT first'}
                    </option>
                    {availableCities.map((ct) => (
                      <option key={ct} value={ct} className="bg-panel text-primary">
                        {ct}
                      </option>
                    ))}
                    <option value="Other" className="bg-panel text-mint">
                      + Other (Specify City)
                    </option>
                  </select>
                </div>

                {/* If Other is selected, custom text input appears */}
                {selectedCity === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -4 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="pt-1.5 space-y-1"
                  >
                    <label
                      htmlFor="onboarding-custom-city"
                      className="block text-[11px] font-mono text-mint font-semibold uppercase"
                    >
                      Specify Your City / Town <span className="text-mint">*</span>
                    </label>
                    <input
                      id="onboarding-custom-city"
                      type="text"
                      required
                      autoFocus
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="e.g. Pilani, Abohar, Manipal, etc."
                      className="w-full rounded-xl border border-mint/40 bg-panel-alt px-3.5 py-2 text-xs text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Graduation Year */}
            <div className="space-y-1.5">
              <label
                htmlFor="onboarding-year"
                className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
              >
                Passing / Graduation Year <span className="text-mint">*</span>
              </label>
              <div className="relative">
                <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  id="onboarding-year"
                  required
                  value={normalizeGradYear(gradYear)}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-8 py-2.5 text-sm text-primary outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                >
                  {GRADUATION_YEARS.map((yr) => (
                    <option key={yr.value} value={yr.value} className="bg-panel text-primary">
                      {yr.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Phone / WhatsApp (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="onboarding-phone"
                  className="block text-xs font-mono font-bold uppercase tracking-wider text-secondary"
                >
                  WhatsApp / Phone Number
                </label>
                <span className="text-[10px] font-mono text-muted uppercase tracking-wide">
                  Optional
                </span>
              </div>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="onboarding-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
              <p className="text-[11px] text-muted">
                Optional for instant WhatsApp pass badges, schedule changes, and entry updates.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !college.trim() || !selectedState.trim() || !finalCity}
                className="btn-mint-gradient w-full py-4 px-6 rounded-full text-void font-mono-data font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-[1.01] active:scale-98"
              >
                {isSubmitting ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-void stroke-[2.5]" />
                    <span>Complete Profile &amp; Continue</span>
                    <ArrowRight size={14} className="text-void stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
