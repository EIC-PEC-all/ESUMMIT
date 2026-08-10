// components/EventPortfolio/DetailModal.tsx
'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ArrowRight, Calendar, Sparkles, Users } from 'lucide-react'
import { PortfolioEvent } from './data'

interface DetailModalProps {
  event: PortfolioEvent | null
  onClose: () => void
}

export function DetailModal({ event, onClose }: DetailModalProps) {
  useEffect(() => {
    if (event) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [event])

  if (!event) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0C120F] p-6 sm:p-8 md:p-10 custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-neutral-950 text-neutral-400 hover:border-mint hover:text-mint transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>

          {/* Header Eyebrow */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-mono-data text-mint font-bold uppercase tracking-wider">
              {event.number} · {event.eyebrow}
            </span>
            <span className="text-xs font-mono-data text-neutral-400 font-bold uppercase tracking-wider">
              &middot; {event.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            {event.title}
          </h2>

          {/* Event Media Banner */}
          <div className="relative my-4 w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-xl border border-white/10 overflow-hidden bg-neutral-950">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C120F] via-transparent to-transparent opacity-80" />
          </div>

          {/* Partner Callout if exists */}
          {event.partner && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-mint/20 bg-mint/5 p-4 text-mint">
              <Sparkles size={18} className="shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase text-mint">Confirmed / Knowledge Partner</p>
                <p className="text-sm font-semibold text-white">{event.partner}</p>
              </div>
            </div>
          )}

          {/* Grid Information Details */}
          <div className="grid gap-5 md:grid-cols-2 mb-6">
            {/* Section 1: Purpose & Scope */}
            <div className="rounded-xl border border-white/10 bg-neutral-950 p-5">
              <h3 className="mb-2 text-xs uppercase font-semibold text-mint flex items-center gap-2">
                <CheckCircle2 size={14} /> 1. Purpose &amp; Scope
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300">{event.purpose}</p>
            </div>

            {/* Section 2: Proposed Delivery */}
            <div className="rounded-xl border border-white/10 bg-neutral-950 p-5">
              <h3 className="mb-2 text-xs uppercase font-semibold text-mint flex items-center gap-2">
                <Calendar size={14} /> 2. Proposed Delivery
              </h3>
              <p className="text-sm leading-relaxed text-neutral-300">{event.delivery}</p>
            </div>
          </div>

          {/* Section 3: Expected Participation & Target Audience */}
          <div className="rounded-xl border border-white/10 bg-neutral-950 p-5 mb-6">
            <h3 className="mb-2 text-xs uppercase font-semibold text-mint flex items-center gap-2">
              <Users size={14} /> 3. Expected Participation &amp; Capacity
            </h3>
            <p className="text-sm leading-relaxed text-neutral-300">{event.expectedParticipation}</p>
          </div>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {event.tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-md bg-neutral-950 border border-white/10 px-3 py-1 text-xs text-neutral-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action CTA */}
          <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-5 gap-4">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-mint animate-ping" />
              Official E-Summit &apos;26 Portfolio Activity
            </div>

            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105"
            >
              <span>Back to Portfolio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
