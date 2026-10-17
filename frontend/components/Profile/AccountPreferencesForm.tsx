'use client'

import React from 'react'
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Save,
  MapPin,
  AlertCircle,
  Check,
} from 'lucide-react'
import type { AttendeeProfile } from '@/app/profile/ProfileClient'
import { STATE_NAMES, getCitiesForState } from '@/data/indiaLocations'
import {
  GRADUATION_YEARS,
  normalizeGradYear,
  isValid10DigitPhone,
  normalizePhoneNumber,
} from '@/lib/onboarding'

interface AccountPreferencesFormProps {
  profile: AttendeeProfile
  setProfile: React.Dispatch<React.SetStateAction<AttendeeProfile>>
  onSave: (e: React.FormEvent) => Promise<void>
  isSaving: boolean
  userDisplayName?: string | null
}

export default function AccountPreferencesForm({
  profile,
  setProfile,
  onSave,
  isSaving,
  userDisplayName,
}: AccountPreferencesFormProps) {
  const initials = (profile.name || userDisplayName || 'D').slice(0, 2).toUpperCase()

  return (
    <div className="w-full space-y-5">
      {/* Delegate Overview Ribbon */}
      <div className="p-4 sm:p-5 rounded-2xl bg-panel border border-border-subtle flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-mint/15 border border-mint/30 flex items-center justify-center text-mint font-display font-black text-lg shadow-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-base sm:text-lg font-bold text-primary uppercase tracking-wide font-display">
                {profile.name || userDisplayName || 'E-Summit Delegate'}
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-mint/10 border border-mint/20 text-mint text-[9px] font-mono font-bold uppercase tracking-wider">
                Verified
              </span>
            </div>
            <p className="text-xs text-secondary font-mono mt-0.5">
              {profile.college || 'Punjab Engineering College (PEC)'}
              {profile.city && profile.state ? ` • ${profile.city}, ${profile.state}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-secondary bg-panel-alt border border-border-subtle px-3 py-1.5 rounded-md">
          <ShieldCheck size={14} className="text-mint shrink-0" />
          <span>PEC E-Summit 2026 Attendee</span>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        {/* Personal & Academic Details Card */}
        <div className="p-5 sm:p-7 rounded-[24px] bg-panel border border-border-panel backdrop-blur-xl space-y-5 shadow-xl">
          <div className="border-b border-border-subtle pb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-primary uppercase tracking-wider font-display flex items-center gap-2">
              <User size={17} className="text-mint" />
              <span>Personal & Academic Details</span>
            </h3>
            <p className="text-xs text-secondary mt-1">
              Keep your college, contact, and academic credentials updated for summit badging and certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                Full Name <span className="text-mint font-bold">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={100}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Ananay Dubey"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[9px] font-mono text-muted uppercase">Primary Auth</span>
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt/50 pl-10 pr-3.5 py-2.5 text-sm text-muted cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* WhatsApp Number (Compulsory) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                  WhatsApp Number <span className="text-mint font-bold">*</span>
                </label>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider font-bold bg-mint/10 text-mint border border-mint/20">
                  Compulsory
                </span>
              </div>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  required
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  maxLength={16}
                  className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-primary placeholder:text-muted outline-none transition-colors ${
                    profile.phone && !isValid10DigitPhone(profile.phone)
                      ? 'border-amber-500/50 bg-panel-alt focus:border-amber-400'
                      : profile.phone && isValid10DigitPhone(profile.phone)
                      ? 'border-mint/50 bg-panel-alt focus:border-mint'
                      : 'border-border-subtle bg-panel-alt focus:border-mint'
                  }`}
                />
                {profile.phone && isValid10DigitPhone(profile.phone) && (
                  <Check size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mint" />
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono">
                {profile.phone && !isValid10DigitPhone(profile.phone) ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Please enter a valid 10-digit mobile number</span>
                  </span>
                ) : (
                  <span className="text-muted">Required: 10-digit number for badges &amp; alerts</span>
                )}
                {profile.phone && (
                  <span className="text-muted text-[10px]">
                    {normalizePhoneNumber(profile.phone).length}/10 digits
                  </span>
                )}
              </div>
            </div>

            {/* College Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                College / Institution Name <span className="text-mint font-bold">*</span>
              </label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={150}
                  value={profile.college}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  placeholder="e.g. Punjab Engineering College (PEC)"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* State & City */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                State / UT <span className="text-mint font-bold">*</span>
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  required
                  value={profile.state || ''}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value, city: '' })}
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

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                City / District <span className="text-mint font-bold">*</span>
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  required
                  disabled={!profile.state}
                  value={
                    profile.city && !getCitiesForState(profile.state || '').includes(profile.city)
                      ? 'Other'
                      : profile.city || ''
                  }
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setProfile({ ...profile, city: '' })
                    } else {
                      setProfile({ ...profile, city: e.target.value })
                    }
                  }}
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-8 py-2.5 text-sm text-primary outline-none focus:border-mint transition-colors appearance-none cursor-pointer disabled:opacity-40"
                >
                  <option value="" disabled className="bg-panel text-muted">
                    {profile.state ? `Select City in ${profile.state}` : 'Select State / UT first'}
                  </option>
                  {getCitiesForState(profile.state || '').map((ct) => (
                    <option key={ct} value={ct} className="bg-panel text-primary">
                      {ct}
                    </option>
                  ))}
                  <option value="Other" className="bg-panel text-mint">
                    + Other (Specify City)
                  </option>
                </select>
              </div>

              {profile.state && (!profile.city || !getCitiesForState(profile.state || '').includes(profile.city)) && (
                <div className="pt-1.5 space-y-1">
                  <label className="block text-[10px] font-mono text-mint uppercase font-semibold">
                    Specify City / Town Name <span className="text-mint font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={60}
                    value={profile.city || ''}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="e.g. Pilani, Abohar, Manipal, etc."
                    className="w-full rounded-xl border border-mint/40 bg-panel-alt px-3.5 py-2 text-xs text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Branch / Department */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                Branch / Specialization
              </label>
              <div className="relative">
                <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  maxLength={80}
                  value={profile.branch || ''}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  placeholder="e.g. Computer Science, Mechanical, MBA"
                  className="w-full rounded-xl border border-border-subtle bg-panel-alt pl-10 pr-3.5 py-2.5 text-sm text-primary placeholder:text-muted outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-secondary uppercase tracking-wider">
                Year of Study / Graduation <span className="text-mint font-bold">*</span>
              </label>
              <div className="relative">
                <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <select
                  required
                  value={normalizeGradYear(profile.gradYear)}
                  onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })}
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
          </div>
        </div>

        {/* Form Submit Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-secondary font-mono flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-mint shrink-0" />
            <span>Updates sync instantly across your summit badges and passes.</span>
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-mint-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-void font-mono-data font-black text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} className="stroke-[2.5]" />
            <span>{isSaving ? 'Saving Details...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
