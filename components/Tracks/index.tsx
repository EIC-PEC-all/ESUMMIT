'use client'
// components/Tracks/index.tsx
// Event tracks grid with 3D cursor-tilt, neon green glow, and expandable detail drawer

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Zap, Users, Store, Code2, Network, ChevronDown, X, LucideIcon } from 'lucide-react'
import { TRACKS } from '@/lib/data'
import { onAgentEvent } from '@/lib/events'
import CircuitBoard from '../Hero/CircuitBoard'

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
    setTilt({ x: dy * -8, y: dx * 8 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const Icon = ICONS[track.icon] ?? Zap

  return (
    <motion.div
      ref={cardRef}
      id={`track-${track.id}`}
      className={`tilt-card cursor-pointer rounded-2xl p-7 relative overflow-hidden group bg-panel ${isHighlighted ? 'highlight-active' : ''}`}
      style={{
        border: `1px solid ${isHighlighted ? 'var(--accent-mint)' : 'var(--border-subtle)'}`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'all 0.4s ease' : 'transform 0.1s ease',
        boxShadow: isHighlighted ? '0 0 28px var(--accent-green-glow)' : undefined,
      }}
      whileHover={{ borderColor: 'var(--accent-mint)', boxShadow: '0 0 25px var(--accent-green-glow)' }}
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
      {/* Icon in Green Glow Circle */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-void border border-mint/40 group-hover:border-mint transition-all"
        aria-hidden="true"
      >
        <Icon size={22} className="text-mint" />
      </div>

      {/* Eyebrow */}
      <p className="font-mono-data text-[10px] uppercase tracking-widest mb-2 text-mint font-bold flex items-center gap-1">
        <span>☑</span> {track.eyebrow}
      </p>

      {/* Title */}
      <h3 className="font-display text-3xl mb-3 leading-none text-primary group-hover:text-mint transition-colors">
        {track.title}
      </h3>

      {/* Short desc */}
      <p className="font-body text-sm leading-relaxed text-muted">
        {track.shortDesc}
      </p>

      {/* Expand hint */}
      <div className="mt-5 flex items-center gap-1.5 font-mono-data text-xs text-mint font-bold">
        <span>Expand Track</span>
        <ChevronDown size={14} aria-hidden="true" />
      </div>

      {/* Decorative corner glow */}
      <div
        className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-15 group-hover:opacity-35 transition-opacity"
        style={{ background: 'radial-gradient(circle, var(--accent-mint) 0%, transparent 70%)' }}
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
      className="py-24 lg:py-32 relative bg-void border-t border-b border-[var(--accent-mint)]/15 overflow-hidden"
      aria-labelledby="tracks-heading"
    >
      {/* Circuit overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      <div className="section-container relative z-10">
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
              <Zap size={14} className="text-[var(--accent-mint)] fill-[var(--accent-mint)]" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[var(--accent-mint)] font-bold">
                Capital &amp; Innovation Agenda
              </p>
            </div>
            <h2
              id="tracks-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              TRACKS &amp;<br />
              <span className="text-stroke-green">COMPETITIONS</span>
            </h2>
          </div>
          <Link
            href="/tracks"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-[var(--accent-mint)] hover:text-white transition-colors border-b border-[var(--accent-mint)]/40 pb-1"
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
            className="overflow-hidden relative z-20"
            role="region"
            aria-label={`${openTrack.title} details`}
          >
            <div
              className="mt-8 mx-4 lg:mx-0 rounded-2xl p-8 relative bg-panel border border-[var(--accent-mint)]/40 shadow-2xl"
              style={{ maxWidth: '1280px', margin: '32px auto 0' }}
            >
              <button
                onClick={() => setOpenId(null)}
                className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-[var(--accent-mint)] bg-void"
                aria-label="Close details panel"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono-data text-xs uppercase tracking-widest text-[var(--accent-mint)] font-bold">
                  ⚡ {openTrack.eyebrow}
                </span>
              </div>
              <h3 className="font-display text-4xl mb-4 text-white">
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
