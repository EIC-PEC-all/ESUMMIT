'use client'

import React, { useState } from 'react'
import { FundingApplication, ApplicationStatus } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import {
  X,
  ExternalLink,
  MessageCircle,
  FileText,
  Building2,
  DollarSign,
  User,
  Star,
  Trash2,
  Save,
  Globe,
  Video
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ApplicationDetailModalProps {
  application: FundingApplication | null
  onClose: () => void
  onUpdate: (updated: FundingApplication) => void
  onDelete: (id: string) => void
}

const STATUS_OPTIONS: { id: ApplicationStatus; label: string }[] = [
  { id: 'PENDING_REVIEW', label: 'Pending Review' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'MOU_SENT', label: 'MoU Sent' },
  { id: 'MOU_ACCEPTED', label: 'MoU Accepted' },
  { id: 'PAYMENT_CONFIRMED', label: 'Payment Confirmed' },
  { id: 'REJECTED', label: 'Not Selected / Rejected' },
]

export function ApplicationDetailModal({
  application,
  onClose,
  onUpdate,
  onDelete,
}: ApplicationDetailModalProps) {
  const [status, setStatus] = useState<ApplicationStatus>(application?.status || 'PENDING_REVIEW')
  const [reviewNotes, setReviewNotes] = useState<string>(application?.reviewNotes || '')
  const [internalRating, setInternalRating] = useState<number>(application?.internalRating || 0)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  if (!application) return null

  // Clean phone number for WhatsApp link
  const cleanPhone = application.phone.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}`

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/applications/${application.applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes,
          internalRating,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update application')
      }

      onUpdate({
        ...application,
        status,
        reviewNotes,
        internalRating,
        updatedAt: new Date().toISOString(),
      })

      toast.success('Application updated successfully')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete application ${application.applicationId}?`)) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/applications/${application.applicationId}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete application')
      }

      onDelete(application.applicationId)
      toast.success('Application deleted')
      onClose()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Delete failed'
      toast.error(msg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#0B1814] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#081310]">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-slate-900 dark:text-white">
                {application.startupName}
              </span>
              <StatusBadge status={status} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono-data tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400">
              <span className="text-emerald-700 dark:text-mint font-extrabold">{application.applicationId}</span>
              <span>•</span>
              <span>Submitted {new Date(application.createdAt).toLocaleString()}</span>
              <span>•</span>
              <span className="text-slate-900 dark:text-white font-bold">{application.passTierName || 'GOLD PASS'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-xs cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1C18] border border-slate-200/80 dark:border-white/10">
            <a
              href={application.pitchDeckUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-xs font-mono-data uppercase tracking-[0.16em] font-bold flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-mint dark:text-[#060D0B] shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Open Pitch Deck
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={application.founderLinkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint text-xs font-mono-data uppercase tracking-[0.14em] font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-700 dark:text-mint" />
              Founder LinkedIn
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 transition-colors flex items-center gap-2 font-mono-data uppercase tracking-[0.14em] text-xs font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Founder
            </a>

            {application.websiteUrl && (
              <a
                href={application.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white dark:bg-[#12241F] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-mint text-xs font-mono-data uppercase tracking-[0.14em] font-bold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-mint" />
                Website
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            {application.demoVideoUrl && (
              <a
                href={application.demoVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-sky-50 hover:bg-sky-100 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 text-sky-800 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20 transition-colors flex items-center gap-2 font-mono-data uppercase tracking-[0.14em] text-xs font-bold"
              >
                <Video className="w-3.5 h-3.5" />
                Demo Video
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Pass Tier & Payment Status Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-500/10 border border-emerald-200/70 dark:border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-emerald-800 dark:text-mint font-extrabold block mb-1">
                Selected Startup Pass Tier
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display font-black text-xl text-slate-900 dark:text-white uppercase tracking-tight">
                  {application.passTierName || 'GOLD PASS'}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white dark:bg-mint dark:text-[#060D0B] font-mono-data font-black text-xs uppercase tracking-wider shadow-xs">
                  {application.passPrice || '₹3,500 + GST'}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                Payment Channel
              </span>
              <span className="font-mono-data text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 font-bold bg-white dark:bg-[#081310] border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full inline-block shadow-xs">
                Direct PEC Account (Post-MoU)
              </span>
            </div>
          </div>

          {/* Section 1: Founder and Contact Details */}
          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              1. Applicant, Role & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Applicant Name
                </span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block">{application.founderName}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Role at Event
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-mint font-mono-data text-xs font-black inline-block">
                  {application.role || 'Founder'}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Email
                </span>
                <a href={`mailto:${application.email}`} className="text-emerald-700 dark:text-mint hover:underline font-mono-data font-semibold text-xs block truncate">
                  {application.email}
                </a>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Phone / WhatsApp
                </span>
                <span className="text-slate-900 dark:text-white font-mono-data font-bold text-xs block">{application.phone}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  LinkedIn Profile
                </span>
                <a
                  href={application.founderLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-mint hover:underline truncate block font-mono-data font-semibold text-xs"
                >
                  {application.founderLinkedIn}
                </a>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Primary Motive
                </span>
                <span className="text-slate-900 dark:text-white font-mono-data font-semibold text-xs block truncate" title={application.motive}>
                  {application.motive || 'Showcase & Networking'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Startup Profile */}
          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              2. Startup Profile & Credentials
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Startup Name
                </span>
                <span className="text-slate-900 dark:text-white font-bold text-sm block">{application.startupName}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Current Stage
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-mint font-mono-data text-xs font-black inline-block">
                  {application.stage}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Primary Sector
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">{application.sector}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  DPIIT Number
                </span>
                <span className="text-slate-900 dark:text-white font-mono-data text-xs block font-bold">{application.dpiitNumber || 'None / Not Applicable'}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Financials and Fundraise */}
          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              3. Financials & Fundraising Ask
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Current Revenue Stage
                </span>
                <span className="text-slate-900 dark:text-white font-bold block">{application.revenueStage}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Total External Funding
                </span>
                <span className="text-slate-900 dark:text-white font-mono-data font-bold block">{application.totalFundingRaised}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-emerald-700 dark:text-mint font-extrabold block mb-1">
                  Current Fundraise Ask
                </span>
                <span className="text-emerald-700 dark:text-mint font-mono-data font-black text-base block">{application.currentAsk}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Expected Pre-Money
                </span>
                <span className="text-slate-900 dark:text-white font-mono-data font-bold block">{application.preMoneyValuation || 'Not Decided'}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Pitch Deck and MoU Terms */}
          <div className="p-5 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-mono-data font-black text-xs uppercase tracking-[0.2em] text-emerald-700 dark:text-mint flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              4. Pitch Deck & MoU Terms
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Pitch Deck Link
                </span>
                <a
                  href={application.pitchDeckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 dark:text-mint hover:underline flex items-center gap-2 font-mono-data font-bold text-xs break-all"
                >
                  {application.pitchDeckUrl}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#081310] border border-slate-200/60 dark:border-white/10 shadow-xs">
                <span className="font-mono-data uppercase text-[10px] tracking-[0.16em] text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Participation Fee & MoU Readiness
                </span>
                <div className="text-slate-900 dark:text-white font-semibold text-xs leading-relaxed">
                  {application.mouComfortable}
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Reviewer Evaluation Panel */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50/60 dark:bg-[#0D1C18] border border-slate-200/70 dark:border-white/10 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-mono-data text-[10px] uppercase tracking-[0.2em] text-emerald-700 dark:text-mint font-extrabold block">
                  Evaluation & Decision
                </span>
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight">
                  Reviewer Evaluation Panel
                </h4>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white dark:bg-[#081310] border border-slate-200 dark:border-white/10 shadow-xs">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setInternalRating(star)}
                    className="p-1.5 hover:scale-110 transition-transform cursor-pointer"
                    title={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= internalRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-[10px] font-mono-data uppercase tracking-[0.16em] font-bold mb-1.5">
                  Update Application Status
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
                  Internal Review Notes
                </label>
                <input
                  type="text"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="e.g. Strong deck, approved for Session B pitch"
                  className="w-full px-4 py-3 rounded-full bg-white dark:bg-[#081310] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-body text-xs focus:outline-none focus:border-emerald-500 shadow-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-[#081310]">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/20 transition-colors flex items-center gap-2 font-mono-data uppercase tracking-[0.14em] text-xs font-bold disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Entry
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
              className="px-6 py-2.5 rounded-full text-xs font-mono-data uppercase tracking-[0.16em] font-bold flex items-center gap-2 disabled:opacity-50 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-mint dark:text-[#060D0B] shadow-md transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white dark:border-[#060D0B] border-t-transparent rounded-full animate-spin" />
                  Saving...
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
