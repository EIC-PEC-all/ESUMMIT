'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EventListItem } from './EventListItem'
import type { DayEventVenue, RouteData } from './types'
import { DAY_EVENT_VENUES } from '@/lib/data'

interface EventListPanelProps {
  day: 'day1' | 'day2'
  selectedEvent: DayEventVenue | null
  route: RouteData | null
  onSelectEvent: (event: DayEventVenue) => void
  isNavigating?: boolean
  onToggleNavigation?: () => void
}

export function EventListPanel({ 
  day, 
  selectedEvent, 
  route, 
  onSelectEvent, 
  isNavigating = false,
  onToggleNavigation 
}: EventListPanelProps) {
  const events = useMemo(() => DAY_EVENT_VENUES[day], [day])

  const getEventRouteInfo = (event: DayEventVenue) => {
    if (!route || selectedEvent?.eventId !== event.eventId) return {}
    return { distance: route.distance, duration: route.duration }
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'transparent' }}>
      {/* GTA-style Header — no border, just a glassy fade strip */}
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center gap-2">
          {/* Neon blip */}
          <span
            className="animate-pulse"
            style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: '#39FF14', boxShadow: '0 0 10px #39FF14',
            }}
          />
          <span
            className="uppercase tracking-widest text-[10px] font-bold"
            style={{ fontFamily: "'Space Mono', monospace", color: '#39FF14' }}
          >
            {day === 'day1' ? 'Day 01' : 'Day 02'} · {events.length} Events
          </span>
        </div>
        <span
          className="text-[9px] uppercase tracking-wider"
          style={{ fontFamily: "'Space Mono', monospace", color: 'rgba(200,255,0,0.5)' }}
        >
          TAP TO NAV
        </span>
      </div>

      {/* Scrollable event list — hides when navigating to maximize map */}
      <div 
        className="relative flex-1 min-h-0 transition-all duration-500 ease-in-out"
        style={{ 
          opacity: isNavigating ? 0 : 1, 
          maxHeight: isNavigating ? 0 : '100%',
          overflow: 'hidden'
        }}
      >
        {/* Fade top */}
        <div
          className="absolute top-0 left-0 right-0 h-6 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(5,5,5,0.6) 0%, transparent 100%)' }}
        />
        {/* Fade bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, rgba(5,5,5,0.9) 0%, transparent 100%)' }}
        />

        <div className="h-full overflow-y-auto px-2 py-3 space-y-1 scrollbar-none">
          {events.map((event, i) => {
            const isSelected = selectedEvent?.eventId === event.eventId
            const routeInfo = getEventRouteInfo(event)
            return (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: 'easeOut' }}
              >
                <EventListItem
                  event={event}
                  isSelected={isSelected}
                  distance={routeInfo.distance}
                  duration={routeInfo.duration}
                  onClick={() => onSelectEvent(event)}
                />
              </motion.div>
            )
          })}

          {events.length < 1 && (
            <div className="py-8 text-center text-[#555] text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
              NO EVENTS SCHEDULED
            </div>
          )}
        </div>
      </div>

      {/* Active Navigation HUD — GTA mission objective style */}
      <AnimatePresence>
        {selectedEvent && route && (
          <motion.div
            key="nav-hud"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex-shrink-0 px-3 pb-3 pt-1"
          >
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: 'linear-gradient(135deg, rgba(57,255,20,0.08) 0%, rgba(0,255,136,0.04) 100%)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 20px rgba(57,255,20,0.12), inset 0 0 0 0.5px rgba(57,255,20,0.2)',
              }}
            >
              {/* Blinking objective label */}
              <div className="flex items-center gap-2 mb-2">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 9, color: '#39FF14',
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    fontWeight: 700,
                  }}
                >
                  ★ Active Navigation
                </motion.span>
              </div>

              <p
                className="text-white text-[11px] font-semibold truncate mb-2"
                style={{ fontFamily: "'Kanit', sans-serif" }}
              >
                {selectedEvent.title}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                    Distance
                  </span>
                  <span style={{ fontFamily: "'Kanit', sans-serif", fontSize: 14, color: '#39FF14', fontWeight: 700 }}>
                    {route.distance < 1000
                      ? `${Math.round(route.distance)} m`
                      : `${(route.distance / 1000).toFixed(1)} km`}
                  </span>
                </div>
                <div
                  style={{
                    width: 1, height: 28,
                    background: 'linear-gradient(180deg, transparent, rgba(57,255,20,0.4), transparent)',
                  }}
                />
                <div className="flex flex-col items-end">
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                    Walk
                  </span>
                  <span style={{ fontFamily: "'Kanit', sans-serif", fontSize: 14, color: '#00FF88', fontWeight: 700 }}>
                    {Math.round(route.duration / 60)} min
                  </span>
                </div>
              </div>

              {/* Toggle Navigation Button */}
              <button
                onClick={onToggleNavigation}
                className="w-full mt-3 py-2 rounded-[8px] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                style={{
                  fontFamily: "'Kanit', sans-serif",
                  background: isNavigating ? 'transparent' : '#39FF14',
                  color: isNavigating ? '#FF4D3D' : '#050505',
                  border: isNavigating ? '1px solid rgba(255,77,61,0.3)' : 'none',
                  boxShadow: isNavigating ? 'none' : '0 0 20px rgba(57,255,20,0.4)',
                }}
              >
                {isNavigating ? 'End Route' : 'Start Navigation'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}