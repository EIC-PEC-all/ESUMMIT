'use client'
// components/Speakers/index.tsx
// Speaker grid with hover bio overlay

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SPEAKERS } from '@/lib/data'
import { Twitter, Linkedin } from 'lucide-react'

function SpeakerCard({ speaker }: { speaker: typeof SPEAKERS[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid rgba(138,144,166,0.08)',
        aspectRatio: '3/4',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="article"
      aria-label={`${speaker.name}, ${speaker.title}`}
      id={`speaker-${speaker.id}`}
    >
      {/* Avatar area */}
      {speaker.avatar ? (
        // TODO: replace with real <Image> component when real photos added
        <img
          src={speaker.avatar}
          alt={speaker.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${speaker.color}18 0%, var(--bg-panel) 70%)`,
          }}
          aria-hidden="true"
        >
          {/* Decorative rings */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-28 h-28 rounded-full border"
              style={{ borderColor: `${speaker.color}20` }}
            />
            <div
              className="absolute w-20 h-20 rounded-full border"
              style={{ borderColor: `${speaker.color}30` }}
            />
            {/* Initials avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center font-display text-2xl relative z-10"
              style={{ background: `${speaker.color}25`, color: speaker.color }}
            >
              {speaker.initials}
            </div>
          </div>
        </div>
      )}

      {/* Base info (always visible at bottom) */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: 'linear-gradient(to top, rgba(11,14,26,0.95) 0%, transparent 100%)',
        }}
      >
        <h3 className="font-body font-semibold text-base leading-tight" style={{ color: 'var(--text-primary)' }}>
          {speaker.name}
        </h3>
        <p className="font-mono-data text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          {speaker.title}
        </p>
      </div>

      {/* Bio overlay on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-5"
            style={{ background: `linear-gradient(160deg, ${speaker.color}E0 0%, rgba(11,14,26,0.97) 60%)` }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            aria-hidden={!hovered}
          >
            <div
              className="self-start mb-3 px-2.5 py-1 rounded-full font-mono-data text-[9px] uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}
            >
              {speaker.track}
            </div>
            <h3 className="font-body font-bold text-lg leading-tight mb-1" style={{ color: '#fff' }}>
              {speaker.name}
            </h3>
            <p className="font-mono-data text-xs mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {speaker.title}
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {speaker.bio}
            </p>
            <div className="flex gap-3 mt-4">
              {/* TODO: link to real socials */}
              <a href="#" aria-label={`${speaker.name} on Twitter`} className="p-1.5 rounded" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <Twitter size={14} />
              </a>
              <a href="#" aria-label={`${speaker.name} on LinkedIn`} className="p-1.5 rounded" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <Linkedin size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Speakers() {
  return (
    <section
      id="speakers"
      className="py-24 lg:py-32"
      aria-labelledby="speakers-heading"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p
              className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--accent-signal)' }}
            >
              Confirmed Speakers
            </p>
            <h2
              id="speakers-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              VOICES<br />THAT BUILT
            </h2>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <p className="max-w-xs font-body text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Hover any card to reveal bio. Full speaker list announced 30 days before the summit.
            </p>
            <Link
              href="/speakers"
              className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-signal hover:text-primary transition-colors mt-2"
            >
              View All Speakers Page &rarr;
            </Link>
          </div>
        </motion.div>

        {/* Speaker grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {SPEAKERS.map((speaker) => (
            <SpeakerCard key={speaker.id} speaker={speaker} />
          ))}
        </div>

        {/* Teaser for unannounced */}
        <motion.div
          className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl flex items-center justify-center"
              style={{
                aspectRatio: '3/4',
                background: 'var(--bg-panel)',
                border: '1px dashed rgba(138,144,166,0.15)',
              }}
              aria-label="Speaker to be announced"
            >
              <span className="font-mono-data text-xs tracking-widest" style={{ color: 'var(--text-muted)', opacity: 0.4 }}>
                TBA
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
