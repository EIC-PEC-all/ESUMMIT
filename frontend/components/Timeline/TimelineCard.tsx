'use client'

import React from 'react'
import { Clock, MapPin, Tag, Sparkles } from 'lucide-react'
import type { TimelineEvent } from '@/data/summitData'

interface TimelineCardProps {
  event: TimelineEvent
}

export default function TimelineCard({ event }: TimelineCardProps) {
  const isFlagship = event.badge === 'FLAGSHIP' || event.badge === 'GRAND FINALE'

  return (
    <article
      className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 border ${
        isFlagship
          ? 'bg-[#0D1C18]/90 border-mint/40 shadow-[0_0_25px_rgba(0,245,212,0.15)]'
          : 'bg-[#081310]/70 border-white/10 hover:border-mint/30'
      } hover:-translate-y-0.5`}
    >
      {/* Top Meta Header: Day Badge & Time */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-data font-semibold uppercase tracking-wider bg-mint/15 text-mint border border-mint/30">
            {event.dayLabel}
          </span>
          {event.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono-data font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">
              <Sparkles className="w-2.5 h-2.5 text-mint" />
              {event.badge}
            </span>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-mono-data text-mint">
          <Clock className="w-3.5 h-3.5" />
          <span>{event.time}</span>
        </div>
      </div>

      {/* Eyebrow */}
      <p className="text-[10px] font-mono-data uppercase tracking-wider text-gray-400 mb-1">
        {event.eyebrow}
      </p>

      {/* Title */}
      <h3 className="font-sans font-semibold text-base sm:text-lg text-white mb-2 leading-snug group-hover:text-mint transition-colors tracking-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-[13px] text-gray-300 font-body leading-relaxed mb-4">
        {event.description}
      </p>

      {/* Venue & Tags Footer */}
      <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center gap-1.5 text-gray-300 font-body">
          <MapPin className="w-3.5 h-3.5 text-mint shrink-0" />
          <span className="text-[11px] sm:text-xs font-medium">{event.venue}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-data text-gray-400 bg-black/40 border border-white/5"
            >
              <Tag className="w-2.5 h-2.5 text-mint/60" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
