'use client'
// components/Tracks/index.tsx
// Event tracks grid with 3D cursor-tilt, volt border charging stroke, and expandable detail drawer

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Zap, Users, Store, Code2, Network, ChevronDown, X, LucideIcon } from 'lucide-react'
import { TRACKS } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'

const ICONS: Record<string, LucideIcon> = {
  Zap, Users, Store, Code2, Network,
}

function TrackCard({
  track,
  isHighlighted,
  onClick,
}: {
  track: typeof TRACKS[0]
  isHighlighted: boolean
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -7, y: dx * 7 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const Icon = ICONS[track.icon] ?? Zap

  return (
    <motion.div
      ref={cardRef}
      id={`track-${track.id}`}
      className={`tilt-card cursor-pointer rounded-2xl p-6 relative overflow-hidden group ${isHighlighted ? 'highlight-active' : ''}`}
      style={{
        background: 'var(--bg-void)',
        border: `1px solid ${isHighlighted ? '#F5D400' : 'rgba(138,118,0,0.25)'}`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'all 0.4s ease' : 'transform 0.1s ease',
        boxShadow: isHighlighted ? '0 0 28px rgba(245,212,0,0.35)' : undefined,
      }}
      whileHover={{ borderColor: '#F5D400', boxShadow: '0 0 24px rgba(245,212,0,0.2)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      role="button"
      tabIndex={0}
      aria-label={`${track.title} — click to expand details`}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-panel border border-volt-dim/40 group-hover:border-volt transition-colors"
        aria-hidden="true"
      >
        <Icon size={22} className="text-volt" />
      </div>

      {/* Eyebrow */}
      <p className="font-mono-data text-[10px] uppercase tracking-widest mb-2 text-volt">
        ⚡ {track.eyebrow}
      </p>

      {/* Title */}
      <h3 className="font-display text-3xl mb-3 leading-none text-primary group-hover:text-volt transition-colors">
        {track.title}
      </h3>

      {/* Short desc */}
      <p className="font-body text-sm leading-relaxed text-muted">
        {track.shortDesc}
      </p>

      {/* Expand hint */}
      <div className="mt-5 flex items-center gap-1.5 font-mono-data text-xs text-volt">
        <span>Expand Track</span>
        <ChevronDown size={14} aria-hidden="true" />
      </div>

      {/* Decorative corner glow */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ background: 'radial-gradient(circle, #F5D400 0%, transparent 70%)' }}
        aria-hidden="true"
      />
    </motion.div>
  )
}

export default function Tracks() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const openTrack = openId ? TRACKS.find((t) => t.id === openId) : null

  useEffect(() => {
    const unsub = onAgentEvent((event) => {
      if (event.type === 'highlightEvent') {
        const id = event.payload.id as string
        setHighlightId(id)
        document.getElementById(`track-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setHighlightId(null), 4000)
      }
      if (event.type === 'openTrackCard') {
        const id = event.payload.id as string
        setOpenId(id)
        setTimeout(() => {
          document.getElementById(`track-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    })
    return unsub
  }, [])

  return (
    <section
      id="tracks"
      className="py-24 lg:py-32 relative"
      style={{ background: 'var(--bg-panel)' }}
      aria-labelledby="tracks-heading"
    >
      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-volt fill-volt" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-volt">
                High-Voltage Agenda
              </p>
            </div>
            <h2
              id="tracks-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              TRACKS &amp;<br />
              <span className="text-volt">COMPETITIONS</span>
            </h2>
          </div>
          <Link
            href="/tracks"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-volt hover:text-primary transition-colors"
          >
            Explore Full Tracks Page &rarr;
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              isHighlighted={highlightId === track.id}
              onClick={() => setOpenId(openId === track.id ? null : track.id)}
            />
          ))}
        </div>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {openTrack && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            role="region"
            aria-label={`${openTrack.title} details`}
          >
            <div
              className="mt-8 mx-4 lg:mx-0 rounded-2xl p-8 relative bg-void border border-volt-dim/40 shadow-2xl"
              style={{ maxWidth: '1280px', margin: '32px auto 0' }}
            >
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-volt bg-panel"
                aria-label="Close details panel"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono-data text-xs uppercase tracking-widest text-volt">
                  ⚡ {openTrack.eyebrow}
                </span>
              </div>
              <h3 className="font-display text-4xl mb-4 text-primary">
                {openTrack.title}
              </h3>
              <div className="prose prose-invert max-w-2xl">
                {openTrack.fullDesc.split('\n\n').map((para, i) => (
                  <p key={i} className="font-body text-sm leading-relaxed mb-4 text-muted">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
