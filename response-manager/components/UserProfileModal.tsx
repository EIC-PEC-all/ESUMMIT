'use client'

import React, { useState } from 'react'
import { UserProfile } from '@/lib/types'
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  Clock,
  Radio,
  Laptop,
  Ticket,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Shield,
  Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserProfileModalProps {
  user: UserProfile | null
  onClose: () => void
}

export function UserProfileModal({ user, onClose }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'sessions' | 'passes'>('profile')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!user) return null

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(label)
    toast.success(`Copied ${label} to clipboard`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '')
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`
    : null

  const activeSessions = user.sessions.filter((s) => s.isActive)
  const pastSessions = user.sessions.filter((s) => !s.isActive)

  const getRoleBadgeClass = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30'
      case 'ORGANIZER':
        return 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30'
      case 'GATE':
      case 'VOLUNTEER_CHECKIN':
        return 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-500/20 dark:text-mint dark:border-emerald-500/30'
    }
  }

  // Get user initials
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="bg-white dark:bg-[#0D1C18] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-start justify-between gap-4 bg-slate-50/70 dark:bg-[#12241F]/80">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-display font-black text-xl shadow-md border border-white/20 shrink-0">
              {initials}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-display text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-black tracking-wider uppercase border ${getRoleBadgeClass(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>

                {user.isLoggedIn ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-black tracking-wider uppercase bg-emerald-500/15 text-emerald-700 dark:text-mint border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LOGGED IN ({user.activeSessionsCount})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-bold tracking-wider uppercase bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>OFFLINE</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono-data">
                <span className="flex items-center gap-1">
                  <Mail size={12} className="text-emerald-700 dark:text-mint" />
                  <span>{user.email}</span>
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-emerald-700 dark:text-mint" />
                    <span>{user.phone}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Tabs Navigation ── */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0D1C18]">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 font-mono-data text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-emerald-600 dark:border-mint text-emerald-700 dark:text-mint'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <User size={14} />
            <span>PROFILE DETAILS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 px-2 font-mono-data text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'sessions'
                ? 'border-emerald-600 dark:border-mint text-emerald-700 dark:text-mint'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Radio size={14} />
            <span>ACTIVE SESSIONS</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                user.isLoggedIn
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-mint'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
              }`}
            >
              {activeSessions.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('passes')}
            className={`pb-3 px-2 font-mono-data text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'passes'
                ? 'border-emerald-600 dark:border-mint text-emerald-700 dark:text-mint'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket size={14} />
            <span>REGISTRATIONS &amp; PASSES</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400">
              {user.registrations.length}
            </span>
          </button>
        </div>

        {/* ── Modal Body Content ── */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-body">
          {/* TAB 1: Profile Details */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Quick Contact & Action Bar */}
              <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10">
                <span className="font-mono-data text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                  ACTIONS:
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(user.email, 'Email')}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-[#0D1C18] border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-mono-data text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedField === 'Email' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>Copy Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(user._id, 'User ID')}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-[#0D1C18] border border-slate-200 dark:border-white/10 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-mono-data text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedField === 'User ID' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  <span>Copy ID</span>
                </button>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-mono-data text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageCircle size={12} />
                    <span>WhatsApp</span>
                  </a>
                )}

                <a
                  href={`mailto:${user.email}`}
                  className="px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-mono-data text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Mail size={12} />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    FULL NAME
                  </span>
                  <div className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {user.name || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    EMAIL ADDRESS
                  </span>
                  <div className="font-mono-data text-xs font-semibold text-slate-900 dark:text-white break-all">
                    {user.email}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    PHONE NUMBER
                  </span>
                  <div className="font-mono-data text-xs font-semibold text-slate-900 dark:text-white">
                    {user.phone || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    COLLEGE / INSTITUTION
                  </span>
                  <div className="font-body text-xs font-bold text-slate-900 dark:text-white">
                    {user.college || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    GRADUATION YEAR / BATCH
                  </span>
                  <div className="font-body text-xs font-bold text-slate-900 dark:text-white">
                    {user.gradYear || 'Not provided'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-1">
                  <span className="font-mono-data text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    LOCATION (STATE &amp; CITY/DISTRICT)
                  </span>
                  <div className="font-body text-xs font-bold text-slate-900 dark:text-white">
                    {user.city && user.state
                      ? `${user.city}, ${user.state}`
                      : user.city || user.state || 'Not provided'}
                  </div>
                </div>
              </div>

              {/* Account Metadata */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="font-mono-data text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                  SYSTEM IDENTIFIERS &amp; REFERRALS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-data">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                      MONGO USER ID
                    </span>
                    <span className="text-slate-900 dark:text-white font-mono">{user._id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                      CAMPUS AMBASSADOR REFERRAL CODE
                    </span>
                    <span className="text-emerald-700 dark:text-mint font-bold">
                      {user.referralCode || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                      ACCOUNT CREATED
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleString('en-IN') : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                      LAST LOGIN ATTEMPT
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('en-IN') : 'Never recorded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Active & Historical Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    LOGIN SESSIONS ({user.sessions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-data">
                    Tokens authenticated via RefreshToken collection with device &amp; IP telemetry
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-data text-xs font-black text-emerald-700 dark:text-mint">
                    {activeSessions.length} ACTIVE NOW
                  </span>
                </div>
              </div>

              {user.sessions.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 font-mono-data text-slate-500 dark:text-slate-400">
                  No login session records found for this user.
                </div>
              ) : (
                <div className="space-y-3">
                  {user.sessions.map((session, index) => (
                    <div
                      key={session._id}
                      className={`p-4 rounded-2xl border transition-all ${
                        session.isActive
                          ? 'bg-emerald-500/[0.04] border-emerald-500/30 dark:border-mint/30 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-[#12241F]/60 border-slate-200 dark:border-white/10 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Laptop size={14} className={session.isActive ? 'text-emerald-700 dark:text-mint' : 'text-slate-400'} />
                          <span className="font-mono-data text-xs font-bold text-slate-900 dark:text-white">
                            Session #{index + 1}
                          </span>
                          {session.isActive ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-data font-black bg-emerald-500/15 text-emerald-700 dark:text-mint border border-emerald-500/30 animate-pulse">
                              ACTIVE SESSION
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono-data font-bold bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                              EXPIRED / REVOKED
                            </span>
                          )}
                        </div>

                        <span className="font-mono-data text-[10px] text-slate-500 dark:text-slate-400">
                          IP: <strong className="text-slate-700 dark:text-slate-300 font-mono">{session.ipAddress}</strong>
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 font-mono-data break-all bg-white/60 dark:bg-black/20 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400 dark:text-slate-500 mb-0.5">
                          USER AGENT:
                        </span>
                        {session.userAgent}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-data text-slate-500 dark:text-slate-400">
                        <div>
                          <span>Logged in: </span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {session.createdAt ? new Date(session.createdAt).toLocaleString('en-IN') : 'N/A'}
                          </strong>
                        </div>
                        <div>
                          <span>Expires at: </span>
                          <strong className="text-slate-800 dark:text-slate-200">
                            {session.expiresAt ? new Date(session.expiresAt).toLocaleString('en-IN') : 'N/A'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Event Passes & Registrations */}
          {activeTab === 'passes' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                  LINKED REGISTRATIONS ({user.registrations.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono-data">
                  Summit attendee passes and badges associated with this user ID
                </p>
              </div>

              {user.registrations.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 font-mono-data text-slate-500 dark:text-slate-400">
                  This user has not claimed or purchased any passes yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {user.registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-[#12241F] border border-slate-200/80 dark:border-white/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Ticket size={16} className="text-emerald-700 dark:text-mint" />
                          <span className="font-display font-black text-slate-900 dark:text-white text-sm">
                            {reg.passType.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <span className="font-mono-data text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-500/20 dark:text-mint border border-emerald-200 dark:border-emerald-500/30">
                          {reg.amountPaid > 0 ? `₹${reg.amountPaid}` : 'FREE PASS'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono-data">
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                            PASS ID
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{reg.passId}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                            VENUE CHECK-IN STATUS
                          </span>
                          <span
                            className={`font-bold ${
                              reg.isCheckedIn ? 'text-emerald-600 dark:text-mint' : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {reg.isCheckedIn ? 'CHECKED IN AT EVENT' : 'NOT CHECKED IN YET'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                            DATE CLAIMED
                          </span>
                          <span className="text-slate-900 dark:text-white">
                            {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                          </span>
                        </div>
                        {reg.tracks && reg.tracks.length > 0 && (
                          <div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                              SELECTED TRACKS
                            </span>
                            <span className="text-slate-900 dark:text-white">{reg.tracks.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12241F] flex items-center justify-between">
          <div className="text-[11px] font-mono-data text-slate-500 dark:text-slate-400">
            User ID: <span className="font-mono text-slate-700 dark:text-slate-300">{user._id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-900 dark:text-white transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
