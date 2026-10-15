'use client'

import React from 'react'
import { MapPin, Sparkles, ArrowUpRight } from 'lucide-react'
import type { TimelineEvent, EventItem } from '@/data/summitData'
import { getLinkedEvent, TRACK_STYLES } from './eventMapping'

interface TimelineListMobileProps {
  events: TimelineEvent[]
  onSelectEvent: (event: EventItem) => void
  eventsList?: EventItem[]
}

export default function TimelineListMobile({
  events,
  onSelectEvent,
  eventsList,
}: TimelineListMobileProps) {
  return (
    <div className="relative pl-5 sm:pl-6 border-l border-white/10 space-y-4 sm:space-y-5 my-3">
      {events.map((ev) => {
        const catKey = ev.category.toLowerCase()
        const trackStyle = TRACK_STYLES[catKey] || {
          pill: 'bg-white/5 text-gray-300 border-white/10',
          dot: 'bg-gray-400',
          label: ev.category,
        }
        const isFlagship = ev.badge === 'FLAGSHIP' || ev.badge === 'GRAND FINALE'
        const linkedEvent = getLinkedEvent(ev, eventsList)

        return (
          <div key={ev.id} className="relative group">
            {/* Timeline anchor node */}
            <div
              className={`absolute -left-[25px] sm:-left-[29px] top-4 w-2 h-2 rounded-full transition-all duration-200 ${
                isFlagship
                  ? 'bg-mint ring-4 ring-mint/20'
                  : 'bg-gray-500 ring-2 ring-black group-hover:bg-mint'
              }`}
            />

            {/* Session Card with Glassmorphism & Saturated Accents */}
            <article
              onClick={() => linkedEvent && onSelectEvent(linkedEvent)}
              className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-200 select-none backdrop-blur-xl ${
                linkedEvent ? 'cursor-pointer active:scale-[0.99]' : ''
              } ${
                isFlagship
                  ? 'bg-gradient-to-b from-mint/[0.12] via-[#091D15]/90 to-[#040F0B]/95 border-mint/35 border-l-4 border-l-mint shadow-[0_8px_32px_0_rgba(0,245,212,0.15)]'
                  : 'bg-gradient-to-b from-white/[0.08] via-[#091D15]/85 to-[#040F0B]/95 border-white/10 hover:border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]'
              }`}
            >
              {/* Header: Time & Track */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono-data text-xs font-semibold text-mint tracking-tight">
                  {ev.time}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono-data font-medium uppercase tracking-wider border ${trackStyle.pill}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${trackStyle.dot}`} />
                    <span>{ev.category}</span>
                  </span>
                  {ev.badge && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono-data font-bold uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                      <Sparkles className="w-2.5 h-2.5 text-mint" />
                      {ev.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Eyebrow */}
              <p className="text-[10px] font-mono-data uppercase tracking-wider text-gray-400 mb-1">
                {ev.eyebrow}
              </p>

              {/* Session Title */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-sans font-bold text-[15px] sm:text-base text-white leading-snug tracking-tight">
                  {ev.title}
                </h4>
                {linkedEvent && (
                  <ArrowUpRight className="w-4 h-4 text-mint shrink-0 mt-0.5" />
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-300/90 font-body leading-relaxed mb-3">
                {ev.description}
              </p>

              {/* Venue & Tags Footer */}
              <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-mint/80 shrink-0" />
                  <span className="font-body text-xs font-medium text-gray-200">{ev.venue}</span>
                </div>

                {ev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ev.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono-data text-gray-400 bg-white/[0.03] border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
