'use client'

import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'
import type { DayEventVenue } from './types'

interface EventListItemProps {
  event: DayEventVenue
  isSelected: boolean
  distance?: number
  duration?: number
  onClick: () => void
}

export function EventListItem({ event, isSelected, distance, duration, onClick }: EventListItemProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.round(seconds / 60)
    if (mins < 60) return `${mins}m walk`
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  }

  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left relative overflow-hidden group"
      style={{ borderRadius: 10, border: 'none', outline: 'none', background: 'transparent' }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={isSelected}
    >
      {/* Morph background layer — fades between idle and selected */}
      <motion.div
        className="absolute inset-0 rounded-[10px]"
        animate={isSelected ? {
          background: [
            'rgba(57,255,20,0.0)',
            'rgba(57,255,20,0.12)',
          ],
          boxShadow: '0 0 0 0.5px rgba(57,255,20,0.35), 0 0 18px rgba(57,255,20,0.1)',
        } : {
          background: 'rgba(255,255,255,0.02)',
          boxShadow: '0 0 0 0 transparent',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />

      {/* Hover layer */}
      <motion.div
        className="absolute inset-0 rounded-[10px] opacity-0 group-hover:opacity-100"
        style={{ background: 'rgba(57,255,20,0.04)', transition: 'opacity 0.25s ease' }}
      />

      {/* Selected left accent bar — morphs in */}
      <motion.div
        className="absolute left-0 top-2 bottom-2 rounded-full"
        animate={isSelected ? { width: 3, opacity: 1, background: '#39FF14', boxShadow: '0 0 10px #39FF14' } : { width: 2, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      {/* Content */}
      <div className="relative flex items-center gap-3 px-3 py-3 pl-4">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{ width: 34, height: 34 }}
          animate={isSelected ? {
            background: 'rgba(57,255,20,0.15)',
            boxShadow: '0 0 12px rgba(57,255,20,0.3)',
          } : {
            background: 'rgba(255,255,255,0.04)',
            boxShadow: 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={isSelected ? { color: '#39FF14' } : { color: 'rgba(255,255,255,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <MapPin size={16} />
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <motion.p
            className="text-[12px] font-semibold truncate leading-tight"
            style={{ fontFamily: "'Kanit', sans-serif" }}
            animate={isSelected ? { color: '#ffffff' } : { color: 'rgba(255,255,255,0.6)' }}
            transition={{ duration: 0.3 }}
          >
            {event.title}
          </motion.p>
          <div className="flex items-center gap-2 mt-0.5">
            <motion.span
              className="text-[9px] uppercase tracking-wider"
              style={{ fontFamily: "'Space Mono', monospace" }}
              animate={isSelected ? { color: '#39FF14' } : { color: 'rgba(255,255,255,0.25)' }}
              transition={{ duration: 0.3 }}
            >
              {formatTime(event.time)}
            </motion.span>
            {(distance !== undefined || duration !== undefined) && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 8 }}>·</span>
                <motion.span
                  className="text-[9px]"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                  animate={isSelected ? { color: '#00FF88' } : { color: 'rgba(255,255,255,0.2)' }}
                  transition={{ duration: 0.3 }}
                >
                  {distance !== undefined && formatDistance(distance)}
                  {distance !== undefined && duration !== undefined && ' '}
                  {duration !== undefined && formatDuration(duration)}
                </motion.span>
              </>
            )}
          </div>
          <motion.p
            className="text-[9px] truncate mt-0.5"
            style={{ fontFamily: "'Space Mono', monospace" }}
            animate={isSelected ? { color: 'rgba(57,255,20,0.6)' } : { color: 'rgba(255,255,255,0.18)' }}
            transition={{ duration: 0.3 }}
          >
            {event.venueName}
          </motion.p>
        </div>

        {/* Arrow */}
        <motion.div
          className="flex-shrink-0"
          animate={isSelected
            ? { color: '#39FF14', rotate: 0, opacity: 1 }
            : { color: 'rgba(255,255,255,0.15)', rotate: -20, opacity: 0.5 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Navigation size={14} />
        </motion.div>
      </div>
    </motion.button>
  )
}