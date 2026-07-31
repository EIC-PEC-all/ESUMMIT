'use client'
// components/Speakers/index.tsx
// Speaker lineup cards with circuit-trace hover wipe animation and Voltage theme styling

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Twitter, Zap, User } from 'lucide-react'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'

type Speaker = typeof SPEAKERS[0]

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 bg-panel border border-volt-dim/30 hover:border-volt transition-all duration-300 shadow-xl"
      style={{ minHeight: '320px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6, boxShadow: '0 0 28px rgba(245,212,0,0.25)' }}
    >
      {/* Yellow Circuit Line Accent on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-volt scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none" />

      {/* Top Header: Avatar Initials + Day/Track Badge */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-2xl font-bold bg-void border border-volt-dim/40 text-volt group-hover:scale-105 transition-transform"
        >
          {speaker.initials}
        </div>
        <span className="font-mono-data text-[10px] uppercase tracking-widest text-volt bg-volt/10 px-2.5 py-1 rounded border border-volt/20">
          ⚡ {speaker.track}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end">
        {/* Name */}
        <h3 className="font-display text-3xl mb-1 text-primary group-hover:text-volt transition-colors">
          {speaker.name}
        </h3>

        {/* Title */}
        <p className="font-body text-xs font-semibold text-muted mb-3">
          {speaker.title}
        </p>

        {/* Bio */}
        <p className="font-body text-xs text-muted leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
          {speaker.bio}
        </p>

        {/* Socials */}
        <div className="flex items-center gap-3 pt-3 border-t border-volt-dim/20">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-volt transition-colors"
            aria-label={`${speaker.name} on LinkedIn`}
          >
            <Linkedin size={14} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-volt transition-colors"
            aria-label={`${speaker.name} on Twitter`}
          >
            <Twitter size={14} />
          </a>
          <span className="ml-auto font-mono-data text-[10px] text-muted uppercase tracking-wider">
            Confirmed Speaker
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Speakers() {
  return (
    <section
      id="speakers"
      className="py-24 lg:py-32 relative"
      style={{ background: 'var(--bg-void)' }}
      aria-labelledby="speakers-heading"
    >
      {/* Current Line Top Accent */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

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
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-volt fill-volt" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-volt">
                Keynote Speakers &amp; Panelists
              </p>
            </div>
            <h2
              id="speakers-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              LEARN FROM THE <br />
              <span className="text-volt">VISIONARIES</span>
            </h2>
          </div>
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-volt hover:text-primary transition-colors"
          >
            View All Speakers &rarr;
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPEAKERS.map((speaker, index) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
