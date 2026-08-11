// components/EventPortfolio/DetailModal.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bookmark, Check, ArrowRight, Layers, Layout, Users, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { PortfolioEvent } from './data'

interface DetailModalProps {
  event: PortfolioEvent | null
  onClose: () => void
}

export function DetailModal({ event, onClose }: DetailModalProps) {
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
      try {
        const saved = JSON.parse(localStorage.getItem('pec_my_schedule') || '[]')
        setIsSaved(saved.includes(event.id))
      } catch {
        setIsSaved(false)
      }
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
  }, [event])

  const toggleSchedule = () => {
    if (!event) return
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('pec_my_schedule') || '[]')
      let updated: string[]
      if (saved.includes(event.id)) {
        updated = saved.filter((id) => id !== event.id)
        setIsSaved(false)
        toast('Removed from schedule', {
          style: { background: '#07130F', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
        })
      } else {
        updated = [...saved, event.id]
        setIsSaved(true)
        toast.success(`Added to schedule`, {
          style: { background: '#07130F', color: '#fff', border: '1px solid #7ED321' },
          iconTheme: { primary: '#7ED321', secondary: '#040605' },
        })
      }
      localStorage.setItem('pec_my_schedule', JSON.stringify(updated))
    } catch {
      console.warn('Failed to update schedule')
    }
  }

  if (!event) return null

  const details = [
    { Icon: Layers, label: 'OVERVIEW', text: event.purpose },
    { Icon: Layout, label: 'FORMAT & DELIVERY', text: event.delivery },
    { Icon: Users, label: 'PARTICIPATION & CAPACITY', text: event.expectedParticipation },
  ]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[6000] flex items-stretch sm:items-center justify-center p-0 sm:p-6">
        {/* Frosted Glass Dark Backdrop — Softly reveals site background with glassmorphic blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window — Edge-to-edge on mobile, floating glassmorphic card on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full h-full sm:h-auto sm:max-w-xl lg:max-w-3xl sm:max-h-[85vh] overflow-hidden rounded-none sm:rounded-2xl bg-[#091410] border-0 sm:border sm:border-mint/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-white/10 bg-[#07100D] shrink-0 pt-[max(0.8rem,env(safe-area-inset-top))]">
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <span className="font-mono-data text-[11px] font-black text-mint px-2 py-0.5 rounded bg-mint/10 border border-mint/20 shrink-0">
                {event.number}
              </span>
              <span className="font-mono-data text-[11px] font-bold tracking-wider text-neutral-300 uppercase truncate">
                {event.category}
              </span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="overflow-y-auto custom-scrollbar flex-1 p-4 sm:p-6 space-y-4">
            {/* Hero Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title Block */}
            <div className="space-y-1">
              <p className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint">
                {event.eyebrow}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Tags Strip */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-300 bg-white/[0.05] border border-white/10 rounded-md px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-white/10 my-3" />

            {/* Structured Details Cards */}
            <div className="space-y-3">
              {details.map(({ Icon, label, text }) => (
                <div
                  key={label}
                  className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-mint/10 text-mint shrink-0 mt-0.5">
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-mono-data text-[10px] font-extrabold uppercase tracking-widest text-mint">
                      {label}
                    </h4>
                    <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Banner */}
            {event.partner && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-mint/5 border border-mint/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mint/10 text-mint shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-mint/80">
                    CONFIRMED PARTNER
                  </p>
                  <p className="text-xs font-bold text-white uppercase tracking-wide truncate">
                    {event.partner}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fixed Sticky Action Footer */}
          <div className="p-3.5 sm:p-5 border-t border-white/10 bg-[#07100D] flex items-center gap-2.5 shrink-0 pb-[max(0.8rem,env(safe-area-inset-bottom))]">
            <button
              onClick={toggleSchedule}
              className={`flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl font-mono-data text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
                isSaved
                  ? 'bg-mint/15 border-mint text-mint'
                  : 'bg-white/5 border-white/15 text-white hover:border-mint/50 hover:text-mint'
              }`}
            >
              {isSaved ? <Check size={15} className="shrink-0" /> : <Bookmark size={15} className="shrink-0" />}
              <span className="truncate">{isSaved ? 'In Schedule' : 'Add Schedule'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1.5 h-11 px-3 rounded-xl bg-mint text-[#040806] font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider hover:bg-[#8ee430] transition-colors whitespace-nowrap"
            >
              <span className="truncate">Back</span>
              <ArrowRight size={15} className="shrink-0" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
