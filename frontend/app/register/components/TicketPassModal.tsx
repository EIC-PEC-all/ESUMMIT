'use client'

import React from 'react'
import Image from 'next/image'
import { CheckCircle2, Ticket, Sparkles, Download, Edit3, Share2, MessageCircle } from 'lucide-react'
import { RegistrationRecord } from '@/lib/registrations'

interface TicketPassModalProps {
  currentBadge: RegistrationRecord
  summitDates: string
  onExportInstagramStory: () => void
  onPrint: () => void
  onEdit: (pass: RegistrationRecord) => void
  onViewPasses: () => void
  totalPassesCount: number
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  currentBadge,
  summitDates,
  onExportInstagramStory,
  onPrint,
  onEdit,
  onViewPasses,
  totalPassesCount,
}) => {
  const shareText = encodeURIComponent(
    `I just registered for PEC E-Summit 2026! 🔥 Join founders, investors, and builders at Punjab Engineering College on September 26–27. Get your delegate pass: https://esummit.pec.ac.in/register?ref=${currentBadge.id}`
  )
  const shareUrl = encodeURIComponent(`https://esummit.pec.ac.in/register?ref=${currentBadge.id}`)

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank')
  }

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareText}`, '_blank')
  }

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')
  }

  return (
    <div className="space-y-5 max-w-md mx-auto pt-4">
      <div className="text-center space-y-1">
        <div className="w-9 h-9 rounded-full bg-mint/10 border border-mint/30 text-mint mx-auto flex items-center justify-center">
          <CheckCircle2 size={18} />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Your Pass is Confirmed!
        </h2>
        <p className="text-xs text-neutral-400">
          Save your entry pass or show your QR code at the registration desk.
        </p>
      </div>

      {/* Digital Pass Ticket Card */}
      <div className="rounded-lg border border-white/15 bg-[#13221C] p-4 relative space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="bg-mint text-void p-1 rounded font-bold">
              <Ticket size={13} />
            </div>
            <div>
              <span className="block text-xs font-bold text-white">
                PEC E-SUMMIT 2026
              </span>
              <span className="block text-[10px] text-neutral-400">
                {summitDates} • PEC Chandigarh
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-mint/10 border border-mint/20 text-[10px] font-semibold text-mint font-mono">
            {currentBadge.category}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-0">
            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                Attendee Name
              </span>
              <h3 className="text-base font-bold text-white mt-0.5 truncate">
                {currentBadge.name}
              </h3>
            </div>

            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                College / Institution
              </span>
              <p className="text-xs text-neutral-300 mt-0.5 truncate">{currentBadge.college}</p>
            </div>

            <div>
              <span className="text-[9px] text-neutral-400 uppercase tracking-wider block font-mono">
                Ticket ID
              </span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-xs font-bold text-mint">
                {currentBadge.id}
              </span>
            </div>
          </div>

          <div className="p-2 bg-white rounded-md shrink-0 flex flex-col items-center">
            {currentBadge.qrCodeData ? (
              <Image
                src={currentBadge.qrCodeData}
                alt="Check-in QR"
                width={90}
                height={90}
                className="w-20 h-20 object-contain mix-blend-multiply"
                unoptimized
              />
            ) : (
              <div className="w-20 h-20 bg-neutral-200 flex items-center justify-center text-[10px] text-neutral-600 font-mono">
                QR Ready
              </div>
            )}
            <span className="text-[8px] text-neutral-800 font-bold uppercase mt-0.5 font-mono">
              Entry QR
            </span>
          </div>
        </div>
      </div>

      {/* Social Share Strip */}
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-300">
          <span className="flex items-center gap-1.5 font-mono uppercase text-mint">
            <Share2 size={12} />
            Share &amp; Invite Friends
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">#PECESummit26</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="py-1.5 px-2 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <MessageCircle size={12} />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleShareTwitter}
            className="py-1.5 px-2 rounded bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Twitter / X</span>
          </button>

          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="py-1.5 px-2 rounded bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={onExportInstagramStory}
          className="py-2 px-3 rounded-md bg-mint hover:bg-white text-void text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Sparkles size={13} />
          <span>Story Badge</span>
        </button>

        <button
          type="button"
          onClick={onPrint}
          className="py-2 px-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Download size={13} />
          <span>Print Ticket</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(currentBadge)}
          className="py-2 px-3 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Edit3 size={12} />
          <span>Edit Details</span>
        </button>

        <button
          type="button"
          onClick={onViewPasses}
          className="py-2 px-3 rounded-md border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Ticket size={12} />
          <span>My Passes ({totalPassesCount})</span>
        </button>
      </div>
    </div>
  )
}
