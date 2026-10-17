'use client'

import React from 'react'
import { Clock, MapPin, Tag } from 'lucide-react'
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
          ? 'bg-panel border-mint/40 shadow-md text-primary'
          : 'bg-panel border-border-subtle hover:border-mint/30 text-primary'
      } hover:-translate-y-0.5`}
    >
      {/* Top Meta Header: Day Badge & Time */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono-data font-semibold uppercase tracking-wider bg-mint/15 text-mint border border-mint/30">
            {event.dayLabel}
          </span>
          {event.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono-data font-bold uppercase tracking-wider bg-panel-alt text-primary border border-border-subtle">
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
      <p className="text-[10px] font-mono-data uppercase tracking-wider text-muted mb-1">
        {event.eyebrow}
      </p>

      {/* Title */}
      <h3 className="font-sans font-semibold text-base sm:text-lg text-primary mb-2 leading-snug group-hover:text-mint transition-colors tracking-tight">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-xs sm:text-[13px] text-secondary font-body leading-relaxed mb-4">
        {event.description}
      </p>

      {/* Venue & Tags Footer */}
      <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center gap-1.5 text-secondary font-body">
          <MapPin className="w-3.5 h-3.5 text-mint shrink-0" />
          <span className="text-[11px] sm:text-xs font-medium">{event.venue}</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-data text-secondary bg-panel-alt border border-border-subtle"
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
