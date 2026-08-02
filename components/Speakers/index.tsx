'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Zap } from 'lucide-react'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

type Speaker = typeof SPEAKERS[0]

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="group relative rounded-2xl overflow-hidden flex flex-col justify-between p-6 bg-[#0D140E] border border-[#7ED321]/20 hover:border-[#7ED321] transition-all duration-300 shadow-xl"
      style={{ minHeight: '320px' }}
      whileHover={{ y: -6, boxShadow: '0 0 28px rgba(126,211,33,0.3)' }}
    >
      {/* Green Circuit Line Accent on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#7ED321] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left pointer-events-none" />

      {/* Top Header: Avatar Initials (Grayscale by default -> Neon Green on Hover) */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-display text-2xl font-bold bg-[#070B08] border border-[#7ED321]/30 text-gray-400 group-hover:text-[#7ED321] group-hover:border-[#7ED321] group-hover:scale-105 filter grayscale group-hover:grayscale-0 transition-all"
        >
          {speaker.initials}
        </div>
        <span className="font-mono-data text-[10px] uppercase tracking-widest text-[#7ED321] bg-[#7ED321]/10 px-2.5 py-1 rounded border border-[#7ED321]/30 font-bold">
          ⚡ {speaker.track}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end">
        {/* Name */}
        <h3 className="font-display text-3xl mb-1 text-white group-hover:text-[#7ED321] transition-colors">
          {speaker.name}
        </h3>

        {/* Title */}
        <p className="font-body text-xs font-semibold text-[#8A9488] mb-3">
          {speaker.title}
        </p>

        {/* Bio */}
        <p className="font-body text-xs text-[#8A9488] leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all">
          {speaker.bio}
        </p>

        {/* Socials */}
        <div className="flex items-center gap-3 pt-3 border-t border-[#7ED321]/15">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8A9488] hover:text-[#7ED321] transition-colors"
            aria-label={`${speaker.name} on LinkedIn`}
          >
            <Linkedin size={14} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8A9488] hover:text-[#7ED321] transition-colors"
            aria-label={`${speaker.name} on Twitter`}
          >
            <Twitter size={14} />
          </a>
          <span className="ml-auto font-mono-data text-[10px] text-[#8A9488] uppercase tracking-wider font-semibold">
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
      className="py-24 lg:py-32 relative bg-[#111A12] border-t border-b border-[#7ED321]/15 overflow-hidden"
      aria-labelledby="speakers-heading"
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
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#7ED321] fill-[#7ED321]" />
              <p className="font-mono-data text-xs uppercase tracking-[0.2em] text-[#7ED321] font-bold">
                Keynote Speakers &amp; Panelists
              </p>
            </div>
            <h2
              id="speakers-heading"
              className="font-display leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              LEARN FROM THE <br />
              <span className="text-stroke-green">VISIONARIES</span>
            </h2>
          </div>
          <Link
            href="/speakers"
            className="inline-flex items-center gap-2 font-mono-data text-xs uppercase tracking-wider text-[#7ED321] hover:text-white transition-colors border-b border-[#7ED321]/40 pb-1"
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
