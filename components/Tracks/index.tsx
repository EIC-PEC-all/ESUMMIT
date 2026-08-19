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

import KineticText from '@/components/ui/KineticText'
import AnimatedCircuitTraces from '@/components/ui/AnimatedCircuitTraces'

const ICONS: Record<string, LucideIcon> = {
  Zap,
  Users,
  Store,
  Code2,
  Network,
}

function TrackCard({
  track,
  isHighlighted,
  onClick,
}: {
  track: (typeof TRACKS)[0]
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
      className={`tilt-card group relative cursor-pointer overflow-hidden rounded-2xl bg-panel p-7 ${isHighlighted ? 'highlight-active' : ''}`}
      style={{
        border: `1px solid ${isHighlighted ? 'var(--accent-mint)' : 'var(--border-subtle)'}`,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'all 0.4s ease' : 'transform 0.1s ease',
        boxShadow: isHighlighted ? '0 0 28px var(--accent-green-glow)' : undefined,
      }}
      whileHover={{
        borderColor: 'var(--accent-mint)',
        boxShadow: '0 0 25px var(--accent-green-glow)',
      }}
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
        className="border-mint/40 mb-5 flex h-12 w-12 items-center justify-center rounded-full border bg-void transition-all group-hover:border-mint"
        aria-hidden="true"
      >
        <Icon size={22} className="text-mint" />
      </div>

      {/* Eyebrow */}
      <p className="mb-2 flex items-center gap-1 font-mono-data text-[10px] font-bold uppercase tracking-widest text-mint">
        <span>☑</span> {track.eyebrow}
      </p>

      {/* Title */}
      <h3 className="mb-3 font-display text-3xl leading-none text-primary transition-colors group-hover:text-mint">
        {track.title}
      </h3>

      {/* Short desc */}
      <p className="font-body text-sm leading-relaxed text-muted">{track.shortDesc}</p>

      {/* Expand hint */}
      <div className="mt-5 flex items-center gap-1.5 font-mono-data text-xs font-bold text-mint">
        <span>Expand Track</span>
        <ChevronDown size={14} aria-hidden="true" />
      </div>

      {/* Decorative corner glow */}
      <div
        className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-15 transition-opacity group-hover:opacity-35"
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
        document
          .getElementById(`track-${id}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setHighlightId(null), 4000)
      }
      if (event.type === 'openTrackCard') {
        const id = event.payload.id as string
        setOpenId(id)
        setTimeout(() => {
          document
            .getElementById(`track-${id}`)
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    })
    return unsub
  }, [])

  return (
    <section
      id="tracks"
      className="border-[var(--accent-mint)]/15 relative overflow-hidden border-b border-t bg-void py-24 lg:py-32"
      aria-labelledby="tracks-heading"
    >
      {/* Self-drawing PCB Circuit lines overlay (Anime.js) */}
      <AnimatedCircuitTraces />

      {/* Circuit overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Current Line Top Accent */}
      <div className="current-line-horizontal pointer-events-none absolute left-0 right-0 top-0" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Zap size={14} className="fill-[var(--accent-mint)] text-[var(--accent-mint)]" />
              <p className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent-mint)]">
                Capital &amp; Innovation Agenda
              </p>
            </div>
            <h2
              id="tracks-heading"
              className="font-display text-4xl font-black uppercase leading-none text-primary sm:text-6xl"
            >
              <KineticText
                text="Executive Tracks"
                highlightWords={['Tracks']}
                staggerDelay={0.03}
              />
            </h2>
          </div>
          <Link
            href="/tracks"
            className="border-[var(--accent-mint)]/40 inline-flex items-center gap-2 border-b pb-1 font-mono-data text-xs uppercase tracking-wider text-[var(--accent-mint)] transition-colors hover:text-white"
          >
            Explore Full Tracks Page &rarr;
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            className="relative z-20 overflow-hidden"
            role="region"
            aria-label={`${openTrack.title} details`}
          >
            <div
              className="border-[var(--accent-mint)]/40 relative mx-4 mt-8 rounded-2xl border bg-panel p-8 shadow-2xl lg:mx-0"
              style={{ maxWidth: '1280px', margin: '32px auto 0' }}
            >
              <button
                onClick={() => setOpenId(null)}
                className="absolute right-6 top-6 rounded-lg bg-void p-2 text-muted hover:text-[var(--accent-mint)]"
                aria-label="Close details panel"
              >
                <X size={16} />
              </button>
              <div className="mb-3 flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono-data text-xs font-bold uppercase tracking-widest text-[var(--accent-mint)]">
                  <Zap size={12} className="text-[var(--accent-mint)]" />
                  <span>{openTrack.eyebrow}</span>
                </span>
              </div>
              <h3 className="mb-4 font-display text-4xl text-white">{openTrack.title}</h3>
              <div className="prose prose-invert max-w-2xl">
                {openTrack.fullDesc.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 font-body text-sm leading-relaxed text-muted">
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
