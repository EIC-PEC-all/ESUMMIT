'use client'

import React from 'react'
import { motion, MotionValue } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { DayCard } from './types'

export interface HighlightCardProps {
  card: DayCard
  index: number
  scrollYProgress: MotionValue<number>
  selectedEventId: string | null
  onSelectEvent: (eventId: string) => void
  onLocateOnMap?: (eventId: string) => void
}

export default function HighlightCard({
  card,
  index,
  selectedEventId,
  onSelectEvent,
  onLocateOnMap,
}: HighlightCardProps) {
  return (
    <div
      id={`timeline-day-${index}`}
      className={`w-full lg:sticky ${index > 0 ? 'mt-6 lg:mt-[35vh]' : ''}`}
      style={{
        top: index === 0 ? '5.5rem' : 'calc(5.5rem + 32px)',
        zIndex: 10 + index,
      }}
    >
      <motion.div
        className="flex w-full flex-col justify-between rounded-[24px] sm:rounded-[30px] border border-border-panel p-4 sm:p-6 shadow-2xl h-auto lg:h-[min(560px,calc(100dvh-7rem))] lg:overflow-y-auto"
        style={{
          borderColor: 'var(--border-glow)',
          background: 'linear-gradient(180deg, var(--bg-section-1) 0%, var(--bg-void) 100%)',
        }}
      >
        <div>
          {/* Card Header */}
          <div className="mb-3.5 flex items-center justify-between border-b border-border-subtle pb-3">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-3xl sm:text-4xl font-black text-gradient-mint">
                {card.day}
              </span>
              <span className="font-mono-data text-[11px] sm:text-xs font-bold uppercase tracking-wider text-secondary">
                {card.date}
              </span>
            </div>
            <span className="font-mono-data text-[11px] font-bold uppercase tracking-widest text-mint bg-mint/10 px-2.5 py-0.5 rounded-full border border-mint/20">
              Phase {card.num}
            </span>
          </div>

          <h3 className="mb-4 font-display text-lg sm:text-xl font-bold">
            <span className="text-gradient-white">{card.title}</span>
          </h3>

          {/* Events List */}
          <div className="space-y-0.5 px-0.5">
            {card.events.map((ev) => {
              const isSelected = selectedEventId === ev.id
              return (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev.id)}
                  className={`group flex cursor-pointer items-start py-2.5 px-2.5 rounded-xl transition-all duration-200 border-b border-border-subtle last:border-b-0 ${
                    isSelected
                      ? 'bg-mint/10 border-mint/30 text-mint'
                      : 'hover:bg-panel-alt'
                  }`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 w-full">
                    {/* Left: Time */}
                    <span
                      className={`shrink-0 pt-0.5 font-mono-data text-[11px] sm:text-xs font-semibold tracking-wider transition-colors ${
                        isSelected ? 'text-mint' : 'text-secondary group-hover:text-primary'
                      }`}
                    >
                      {ev.time}
                    </span>

                    {/* Right: Title & Venue */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full min-w-0 gap-1 sm:gap-3">
                      <span
                        className={`font-body text-xs sm:text-sm font-medium transition-colors leading-snug ${
                          isSelected ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'
                        }`}
                      >
                        {ev.title}
                      </span>

                      {/* Venue button (tappable to locate on map) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectEvent(ev.id)
                          if (onLocateOnMap) onLocateOnMap(ev.id)
                        }}
                        className="flex shrink-0 items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-panel transition-colors text-left"
                        title="Locate on map"
                      >
                        <span
                          className={`font-mono-data text-[9.5px] uppercase font-bold tracking-wider transition-colors ${
                            isSelected ? 'text-mint' : 'text-secondary group-hover:text-primary'
                          }`}
                        >
                          {ev.tag}
                        </span>
                        <MapPin
                          size={11}
                          className={`transition-colors ${
                            isSelected
                              ? 'fill-mint text-mint'
                              : 'text-muted group-hover:text-mint'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Card Footer — Extra pb-14 on mobile to prevent FAB collision */}
        <div className="mt-4 pb-14 sm:pb-0 flex items-center justify-between border-t border-border-subtle pt-3 font-mono-data text-[11px] text-secondary">
          <span>PEC Sector 12, Chandigarh</span>
          <span className="text-mint text-[10.5px]">Click event to locate venue</span>
        </div>
      </motion.div>
    </div>
  )
}
