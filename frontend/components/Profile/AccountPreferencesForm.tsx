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
} from 'lucide-react'
import type { AttendeeProfile } from '@/app/profile/ProfileClient'

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
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1611] border border-white/10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-full bg-mint/15 border border-mint/30 flex items-center justify-center text-mint font-display font-black text-lg shadow-[0_0_15px_rgba(0,242,178,0.2)] shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wide font-display">
                {profile.name || userDisplayName || 'E-Summit Delegate'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-mint/10 border border-mint/20 text-mint text-[9px] font-mono font-bold uppercase tracking-wider">
                Verified
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-0.5">
              {profile.college || 'Punjab Engineering College (PEC)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} className="text-mint shrink-0" />
          <span>PEC E-Summit 2026 Attendee</span>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-5">
        {/* Personal & Academic Details Card */}
        <div className="p-5 sm:p-7 rounded-[24px] bg-[#0C1914]/90 border border-white/10 backdrop-blur-xl space-y-5 shadow-xl">
          <div className="border-b border-white/10 pb-3.5">
            <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
              <User size={17} className="text-mint" />
              <span>Personal & Academic Details</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Keep your college, contact, and academic credentials updated for summit badging and certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Ananay Dubey"
                  className="w-full rounded-xl border border-white/10 bg-[#07130F] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* Email Address (Read-only) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                  Email Address
                </label>
                <span className="text-[9px] font-mono text-neutral-500 uppercase">Primary Auth</span>
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full rounded-xl border border-white/5 bg-[#050D0A] pl-10 pr-3.5 py-2.5 text-sm text-neutral-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Phone / WhatsApp Number
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-[#07130F] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* College Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                College / Institution Name
              </label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={profile.college}
                  onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  placeholder="e.g. Punjab Engineering College (PEC)"
                  className="w-full rounded-xl border border-white/10 bg-[#07130F] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* Branch / Department */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Branch / Specialization
              </label>
              <div className="relative">
                <BookOpen size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={profile.branch}
                  onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
                  placeholder="e.g. Computer Science, Mechanical, MBA"
                  className="w-full rounded-xl border border-white/10 bg-[#07130F] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-mint transition-colors"
                />
              </div>
            </div>

            {/* Academic Year */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Year of Study / Graduation
              </label>
              <div className="relative">
                <GraduationCap size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                <select
                  value={profile.gradYear}
                  onChange={(e) => setProfile({ ...profile, gradYear: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#07130F] pl-10 pr-8 py-2.5 text-sm text-white outline-none focus:border-mint transition-colors appearance-none cursor-pointer"
                >
                  <option value="1st Year (Class of 2029)" className="bg-[#0B1410] text-white">1st Year (Class of 2029)</option>
                  <option value="2nd Year (Class of 2028)" className="bg-[#0B1410] text-white">2nd Year (Class of 2028)</option>
                  <option value="3rd Year (Class of 2027)" className="bg-[#0B1410] text-white">3rd Year (Class of 2027)</option>
                  <option value="Final Year (Class of 2026)" className="bg-[#0B1410] text-white">Final Year (Class of 2026)</option>
                  <option value="Postgraduate / Research" className="bg-[#0B1410] text-white">Postgraduate / Research Scholar</option>
                  <option value="Alumni / Founder / Professional" className="bg-[#0B1410] text-white">Alumni / Founder / Working Professional</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Form Submit Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-neutral-400 font-mono flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-mint shrink-0" />
            <span>Updates sync instantly across your summit badges and passes.</span>
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-mint text-void font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(0,242,178,0.3)] transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{isSaving ? 'Saving Details...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
