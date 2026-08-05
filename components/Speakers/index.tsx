'use client'
// components/Speakers/index.tsx
// High-craft Horizontal Scroll-Tied Pinning Speaker Deck
// Replaces previous iterations with an award-winning horizontal scroll card deck.

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Linkedin, Twitter, Sparkles, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

// High-definition speaker portrait photography
const SPEAKER_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85&auto=format&fit=crop', // Priya Nair
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85&auto=format&fit=crop', // Arjun Mehta
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=85&auto=format&fit=crop', // Deepika Rangi
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=85&auto=format&fit=crop', // Sameer Khanna
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=85&auto=format&fit=crop', // Ritu Sharma
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=85&auto=format&fit=crop', // Vikram Bose
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=800&q=85&auto=format&fit=crop', // Ananya Joshi
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=85&auto=format&fit=crop', // Kabir Singh
]

const COLORS = ['#FF4D3D', '#3DD9FF', '#FF8C42', '#9B5CFF', '#7ED321', '#3DD9FF', '#FF8C42', '#9B5CFF']

interface HorizontalSpeakerCardProps {
  speaker: (typeof SPEAKERS)[0]
  index: number
  image: string
  color: string
}

function HorizontalSpeakerCard({ speaker, index, image, color }: HorizontalSpeakerCardProps) {
  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  const boxShadowStyle = `0 16px 40px rgba(0,0,0,0.8), 0 0 24px ${color}20`
  const spotlightBg = `radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${color}22, transparent 40%)`
  const badgeBorder = `${color}40`

  return (
    <div
      onMouseMove={handleSpotlight}
      className="relative group shrink-0 w-[340px] sm:w-[380px] md:w-[420px] h-[460px] sm:h-[500px] rounded-3xl overflow-hidden bg-[#0D140E] border border-[#7ED321]/30 hover:border-[#7ED321]/80 transition-all duration-500 shadow-2xl flex flex-col justify-between p-6 sm:p-8"
      style={{
        boxShadow: boxShadowStyle,
      }}
    >
      {/* Radial mouse spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
        style={{
          background: spotlightBg,
        }}
      />

      {/* Speaker Background Photo with Gradient Fade */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={image}
          alt={speaker.name}
          loading="lazy"
          className="w-full h-full object-cover object-center grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
        />
        {/* Layered vignette gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B08] via-[#070B08]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B08]/60 via-transparent to-transparent" />
      </div>

      {/* Top Row: Track Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider backdrop-blur-md border"
          style={{
            background: 'rgba(7, 11, 8, 0.85)',
            color: color,
            borderColor: badgeBorder,
          }}
        >
          <Sparkles size={12} />
          <span>{speaker.track}</span>
        </span>

        {/* Social Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#070B08]/80 hover:bg-[#7ED321] text-gray-300 hover:text-[#070B08] flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
            title="LinkedIn Profile"
          >
            <Linkedin size={14} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-[#070B08]/80 hover:bg-[#7ED321] text-gray-300 hover:text-[#070B08] flex items-center justify-center transition-colors backdrop-blur-md border border-white/10"
            title="Twitter Profile"
          >
            <Twitter size={14} />
          </a>
        </div>
      </div>

      {/* Bottom Row: Speaker Name, Title & Bio */}
      <div className="relative z-10 pt-4 border-t border-white/15">
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-none mb-1 group-hover:text-[#7ED321] transition-colors">
          {speaker.name}
        </h3>
        <p className="font-mono-data text-xs font-semibold mb-3" style={{ color }}>
          {speaker.title}
        </p>

        <p className="font-body text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 mb-4">
          {speaker.bio}
        </p>

        <Link
          href="/speakers"
          className="inline-flex items-center gap-1.5 font-mono-data text-xs font-bold uppercase tracking-wider text-[#7ED321] hover:text-white transition-colors"
        >
          <span>Speaker Profile</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}

export default function Speakers() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeTrack, setActiveTrack] = useState<string>('all')

  // Track vertical scroll to translate horizontally
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map vertical scroll [0, 1] to horizontal offset percentage ['0%', '-68%']
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-68%'])

  const filteredSpeakers = activeTrack === 'all'
    ? SPEAKERS
    : SPEAKERS.filter((s) => s.track.toLowerCase() === activeTrack.toLowerCase())

  return (
    <section
      id="speakers"
      ref={containerRef}
      className="relative h-[300vh] bg-[#070B08] border-t border-b border-[#7ED321]/15"
      aria-labelledby="speakers-heading"
    >
      {/* Background circuit pattern */}
      <CircuitBoard prefersReduced={false} />
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between py-8 sm:py-12 px-5 sm:px-8 md:px-12 z-10">
        
        {/* Header Row & Filters */}
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6 z-10">
          <div>
            <h2
              id="speakers-heading"
              className="font-display font-black uppercase text-white leading-none tracking-tight mb-2"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 68px)' }}
            >
              LEARN FROM THE <span className="text-[#7ED321]">VISIONARIES</span>
            </h2>
            <p className="font-body text-xs sm:text-base text-[#8A9488] leading-relaxed max-w-xl">
              Industry titans, founders, and venture capitalists sharing actionable playbooks on stage at PEC E-Summit 2026.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'panels', 'pitch', 'hackathon', 'expo'].map((track) => (
              <button
                key={track}
                onClick={() => setActiveTrack(track)}
                className={`px-3.5 py-1.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTrack === track
                    ? 'bg-[#7ED321] text-[#070B08] shadow-[0_0_20px_rgba(126,211,33,0.4)]'
                    : 'bg-[#0D140E] text-[#8A9488] border border-[#7ED321]/20 hover:border-[#7ED321] hover:text-white'
                }`}
              >
                {track === 'all' ? 'All Tracks' : track}
              </button>
            ))}
          </div>
        </div>

        {/* ── Horizontal Scroll Motion Deck ── */}
        <div className="w-full overflow-hidden my-auto py-4">
          <motion.div
            style={{ x: xTransform }}
            className="flex gap-6 sm:gap-8 w-max pl-4 sm:pl-8 md:pl-12 pr-12"
          >
            {filteredSpeakers.map((speaker, index) => (
              <HorizontalSpeakerCard
                key={speaker.id}
                speaker={speaker}
                index={index}
                image={SPEAKER_IMAGES[index % SPEAKER_IMAGES.length]}
                color={COLORS[index % COLORS.length]}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom Footer Bar (Scroll progress & link) */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 pt-4 border-t border-white/10 text-xs font-mono-data text-[#8A9488]">
          {/* Scroll Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-widest text-[#7ED321] font-bold">Scroll Down to Explore</span>
            <div className="w-32 sm:w-48 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-[#7ED321] rounded-full origin-left"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>

          <Link
            href="/speakers"
            className="inline-flex items-center gap-1.5 text-[#7ED321] hover:text-white transition-colors uppercase font-bold tracking-wider"
          >
            <span>Full Lineup</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  )
}
