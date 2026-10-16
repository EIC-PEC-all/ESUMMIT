// components/EventPortfolio/DetailModal.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Layout, Users, ShieldCheck, ExternalLink } from 'lucide-react'
import { PortfolioEvent } from './data'

interface DetailModalProps {
  event: PortfolioEvent | null
  onClose: () => void
}

export function DetailModal({ event, onClose }: DetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('modal-open')
    } else {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
    return () => {
      document.body.style.overflow = 'unset'
      document.body.classList.remove('modal-open')
    }
  }, [event])

  // Focus trapping and Escape key handler
  useEffect(() => {
    if (!event) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [event, onClose])

  if (!event) return null

  const details = [
    { Icon: Layers, label: 'OVERVIEW', text: event.purpose },
    { Icon: Layout, label: 'FORMAT & DELIVERY', text: event.delivery },
    { Icon: Users, label: 'PARTICIPATION & CAPACITY', text: event.expectedParticipation },
  ]

  const isComp = event ? ['hackathon', 'competition', 'quiz', 'auction', 'strategy'].some(keyword => event.category.toLowerCase().includes(keyword)) : false
  const registerLink = isComp ? (event?.registrationUrl || 'https://unstop.com') : '/register'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-stretch sm:items-center justify-center p-0 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-backdrop backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-event-title"
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 w-full h-[100dvh] sm:h-auto sm:max-w-xl lg:max-w-3xl sm:max-h-[85vh] overflow-hidden rounded-none sm:rounded-2xl bg-panel/95 backdrop-blur-2xl border-0 sm:border sm:border-border-panel text-primary shadow-2xl flex flex-col"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border-subtle bg-panel shrink-0 pt-[max(0.8rem,env(safe-area-inset-top))]">
            <div className="flex items-center gap-2 min-w-0 pr-3">
              <span className="font-mono-data text-[11px] font-black text-mint px-2 py-0.5 rounded bg-mint/10 border border-mint/20 shrink-0">
                {event.number}
              </span>
              <span className="font-mono-data text-[11px] font-bold tracking-wider text-secondary uppercase truncate">
                {event.category}
              </span>
            </div>

            {/* Accessible Touch Target Close Button (>= 44x44px) */}
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-full bg-panel-alt hover:bg-panel border border-border-subtle text-secondary hover:text-primary flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              aria-label="Close event details modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div
            className="overflow-y-auto min-h-0 overscroll-contain touch-pan-y custom-scrollbar flex-1 p-4 sm:p-6 space-y-4"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Hero Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden border border-border-subtle bg-panel-alt shrink-0">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 100vw, 550px"
                className="object-cover"
              />
            </div>

            {/* Title Block */}
            <div className="space-y-1">
              <p className="font-mono-data text-[10px] font-bold uppercase tracking-[0.2em] text-mint">
                {event.eyebrow}
              </p>
              <h2
                id="modal-event-title"
                className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary leading-tight"
              >
                {event.title}
              </h2>
            </div>

            {/* Tags Strip */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {event.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-secondary bg-panel-alt border border-border-subtle rounded-md px-2.5 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="border-border-subtle my-3" />

            {/* Structured Details Cards */}
            <div className="space-y-3">
              {details.map(({ Icon, label, text }) => (
                <div
                  key={label}
                  className="p-3.5 sm:p-4 rounded-xl bg-panel-alt border border-border-subtle flex items-start gap-3"
                >
                  <div className="p-1.5 sm:p-2 rounded-lg bg-mint/10 text-mint shrink-0 mt-0.5">
                    <Icon size={15} strokeWidth={2} />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="font-mono-data text-[10px] font-extrabold uppercase tracking-widest text-mint">
                      {label}
                    </h4>
                    <p className="text-xs text-secondary leading-relaxed font-normal">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Partner Banner */}
            {event.partner && (
              <div className="p-3.5 sm:p-4 rounded-xl bg-mint/10 border border-mint/20 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-mint/15 text-mint shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono-data text-[9px] font-bold uppercase tracking-widest text-mint/80">
                    CONFIRMED PARTNER
                  </p>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide truncate">
                    {event.partner}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-3.5 sm:p-5 border-t border-border-subtle bg-panel flex items-center gap-2.5 shrink-0 pb-[max(0.8rem,env(safe-area-inset-bottom))]">
            {isComp ? (
              <a
                href={registerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-mint text-void font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer shadow-md"
              >
                <span>Register on Unstop</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            ) : (
              <a
                href="/register"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 h-11 px-5 rounded-full bg-mint text-void font-mono-data text-[11px] sm:text-xs font-black uppercase tracking-wider hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer shadow-md"
              >
                <span>Claim Pass for this Event</span>
                <ExternalLink size={14} className="shrink-0" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
