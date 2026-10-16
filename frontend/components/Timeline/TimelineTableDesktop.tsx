'use client'

import React from 'react'
import { Clock, MapPin, Tag, Sparkles, ArrowUpRight } from 'lucide-react'
import type { TimelineEvent, EventItem } from '@/data/summitData'
import { getLinkedEvent, TRACK_STYLES } from './eventMapping'

interface TimelineTableDesktopProps {
  events: TimelineEvent[]
  onSelectEvent: (event: EventItem) => void
  eventsList?: EventItem[]
}

export default function TimelineTableDesktop({
  events,
  onSelectEvent,
  eventsList,
}: TimelineTableDesktopProps) {
  return (
    <div className="w-full rounded-2xl border border-border-panel bg-panel shadow-xl backdrop-blur-xl overflow-hidden text-primary">
      {/* Table Top Info Ribbon */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-panel-alt/70 border-b border-border-subtle text-[11px] font-mono-data text-secondary">
        <span className="flex items-center gap-1.5 text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
          <span>Interactive Summit Timetable</span>
        </span>
        <span className="text-muted text-[10px] hidden lg:inline">
          Click any session row to view event guidelines, prizes &amp; pass registration
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px]">
          {/* Sticky Header */}
          <thead>
            <tr className="border-b border-border-subtle bg-panel-alt sticky top-0 z-20 text-[11px] font-mono-data font-bold uppercase tracking-wider text-secondary">
              <th scope="col" className="py-3.5 px-6 w-[170px]">
                Time Slot
              </th>
              <th scope="col" className="py-3.5 px-6 min-w-[320px]">
                Session &amp; Agenda
              </th>
              <th scope="col" className="py-3.5 px-4 w-[130px]">
                Track
              </th>
              <th scope="col" className="py-3.5 px-6 w-[200px]">
                Venue
              </th>
              <th scope="col" className="py-3.5 px-6 w-[220px]">
                Highlights &amp; Tags
              </th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y divide-border-subtle font-body">
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
                <tr
                  key={ev.id}
                  onClick={() => linkedEvent && onSelectEvent(linkedEvent)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && linkedEvent) {
                      e.preventDefault()
                      onSelectEvent(linkedEvent)
                    }
                  }}
                  tabIndex={linkedEvent ? 0 : undefined}
                  role={linkedEvent ? 'button' : undefined}
                  aria-label={linkedEvent ? `View details for ${ev.title}` : undefined}
                  className={`group transition-all duration-150 outline-none select-none ${
                    linkedEvent ? 'cursor-pointer hover:bg-panel-alt/50' : 'hover:bg-panel-alt/30'
                  } ${
                    isFlagship
                      ? 'border-l-[3px] border-l-mint bg-mint/[0.04]'
                      : 'border-l-[3px] border-l-transparent'
                  }`}
                >
                  {/* Column 1: Time Slot & Day */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-col gap-1.5">
                      <div className="inline-flex items-center gap-1.5 font-mono-data text-xs font-bold text-mint">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-mint" />
                        <span>{ev.time}</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono-data font-semibold text-secondary bg-panel-alt border border-border-subtle w-fit">
                        {ev.dayLabel}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Session & Agenda */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-col gap-1">
                      {/* Eyebrow & Badges (Property # removed) */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono-data uppercase tracking-wider text-muted">
                          {ev.eyebrow}
                        </span>

                        {ev.badge && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-mono-data font-bold uppercase tracking-wider bg-mint/15 text-mint border border-mint/30">
                            <Sparkles className="w-2.5 h-2.5" />
                            {ev.badge}
                          </span>
                        )}
                      </div>

                      {/* Title with hover arrow if clickable */}
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-sans font-bold text-[15px] sm:text-base text-primary group-hover:text-mint transition-colors leading-snug tracking-tight">
                          {ev.title}
                        </h4>
                        {linkedEvent && (
                          <ArrowUpRight className="w-3.5 h-3.5 text-mint/60 group-hover:text-mint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-secondary leading-relaxed max-w-xl">
                        {ev.description}
                      </p>
                    </div>
                  </td>

                  {/* Column 3: Track Tag */}
                  <td className="py-4 px-4 align-top">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono-data font-bold uppercase tracking-wider border ${trackStyle.pill}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${trackStyle.dot}`} />
                      <span>{ev.category}</span>
                    </span>
                  </td>

                  {/* Column 4: Venue (Used exactly as-is from brochure/data) */}
                  <td className="py-4 px-6 align-top">
                    <div className="inline-flex items-center gap-1.5 text-xs text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-mint shrink-0" />
                      <span className="font-medium text-secondary">{ev.venue}</span>
                    </div>
                  </td>

                  {/* Column 5: Highlights & Tags (Clean tags, button removed) */}
                  <td className="py-4 px-6 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {ev.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-data text-secondary bg-panel-alt border border-border-subtle"
                        >
                          <Tag className="w-2.5 h-2.5 text-mint/70 shrink-0" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
