'use client'

import React, { useState } from 'react'
import { Registration, ApplicationStatus } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import {
  X,
  MessageCircle,
  User,
  Building2,
  GraduationCap,
  MapPin,
  Linkedin,
  Clock,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ApplicationDetailModalProps {
  application: Registration | null
  onClose: () => void
  onUpdate: (updated: Registration) => void
  onDelete: (id: string) => void
}

const STATUS_OPTIONS: { id: ApplicationStatus; label: string }[] = [
  { id: 'PENDING_REVIEW', label: 'Payment Pending' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed' },
  { id: 'REJECTED', label: 'Rejected' },
]

function InfoCard({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
      <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
        {label}
      </span>
      <span className="text-slate-900 dark:text-white font-bold text-sm block break-words">{value}</span>
    </div>
  )
}

export function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationDetailModalProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application?.status ?? 'PENDING_REVIEW')
  const [reviewNotes, setReviewNotes] = useState<string>(application?.reviewNotes ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!application) return null

  const isStudent = application.category === 'student'
  const cleanPhone = application.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/applications/${application.applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNotes }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update')

      onUpdate({ ...application, status, reviewNotes, updatedAt: new Date().toISOString() })
      toast.success('Updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete entry ${application.applicationId}?`)) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/applications/${application.applicationId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete')
      onDelete(application.applicationId)
      toast.success('Entry deleted')
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B1814] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden cursor-default"
      >
        {/* ── Header ── */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#081310]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 dark:text-white">
                {isStudent ? application.fullName : (application.organization || application.fullName)}
              </span>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-data tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400">
              <span className="text-emerald-700 dark:text-mint font-extrabold">{application.applicationId}</span>
              <span>•</span>
              <span className="text-slate-900 dark:text-white font-bold">{application.passTierName}</span>
              {application.passPrice && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-mint font-bold">{application.passPrice}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono-data text-slate-400 dark:text-slate-500">
              <Clock className="w-3 h-3 text-emerald-600 dark:text-mint" />
              <span>
                Registered{' '}
                {new Date(application.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(application.createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">

          {/* Quick Contact Actions */}
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10">
            <a
              href={`mailto:${application.email}`}
              className="px-4 py-2 rounded-full text-xs font-mono-data uppercase tracking-[0.14em] font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-mint dark:text-[#060D0B] shadow-sm transition-all"
            >
              <User className="w-3.5 h-3.5" />
              Email
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors flex items-center gap-2 font-mono-data uppercase tracking-[0.14em] text-xs font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            {application.linkedin && (
              <a
                href={application.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint text-xs font-mono-data uppercase tracking-[0.14em] font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-emerald-700 dark:text-mint" />
                LinkedIn
              </a>
            )}
          </div>

          {/* ── Form Response Details ── */}
          {isStudent ? (
            /* Student Pass Details */
            <>
              <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
                <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Student &amp; Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="Full Name" value={application.fullName} />
                  <InfoCard label="Email" value={application.email} />
                  <InfoCard label="Phone / WhatsApp" value={application.phone} />
                  {application.linkedin && <InfoCard label="LinkedIn" value={application.linkedin} />}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
                <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Institution &amp; Education
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="College / Institution" value={application.college} />
                  <InfoCard label="Course Year / Batch" value={application.courseYear} />
                  <InfoCard label="City" value={application.city} />
                  <InfoCard label="State" value={application.state} />
                </div>
              </div>

              {application.motive && (
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-3">
                  <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Tracks &amp; Motive
                  </h3>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                    <span className="text-slate-900 dark:text-white font-medium text-xs leading-relaxed">
                      {application.motive}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Startup Pass Details */
            <>
              <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
                <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Applicant &amp; Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard label="Full Name" value={application.fullName} />
                  <InfoCard label="Email" value={application.email} />
                  <InfoCard label="Phone / WhatsApp" value={application.phone} />
                  {application.linkedin && <InfoCard label="LinkedIn" value={application.linkedin} />}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
                <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Organization &amp; Role
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard label="Organization / Startup" value={application.organization} />
                  <InfoCard label="Role" value={application.role} />
                </div>
              </div>

              {application.motive && (
                <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-3">
                  <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    Primary Motive
                  </h3>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                    <span className="text-slate-900 dark:text-white font-medium text-xs leading-relaxed">
                      {application.motive}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Payment Status & Admin Panel ── */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-mint font-extrabold">
                Payment &amp; Status Management
              </span>
              {/* Quick-set payment buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('PAYMENT_CONFIRMED')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-data font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    status === 'PAYMENT_CONFIRMED'
                      ? 'bg-emerald-600 text-white dark:bg-mint dark:text-[#060D0B] shadow-sm'
                      : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Confirm Payment
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('REJECTED')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-data font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    status === 'REJECTED'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-mono-data uppercase tracking-[0.16em] font-bold mb-1.5">
                  Payment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                  className="w-full px-4 py-3 rounded-full bg-white dark:bg-[#081310] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono-data text-xs uppercase tracking-wider focus:outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-white dark:bg-[#081310] text-slate-900 dark:text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-mono-data uppercase tracking-[0.16em] font-bold mb-1.5">
                  Admin Notes
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Payment received via UPI"
                  className="w-full px-4 py-3 rounded-full bg-white dark:bg-[#081310] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#081310]">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/20 transition-colors flex items-center gap-2 font-mono-data uppercase tracking-[0.14em] text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Deleting…' : 'Delete Entry'}
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 dark:bg-[#12241F] dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono-data uppercase tracking-[0.14em] text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full text-xs font-mono-data uppercase tracking-[0.16em] font-bold flex items-center gap-2 disabled:opacity-50 btn-mint-gradient shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#060D0B] border-t-transparent rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
