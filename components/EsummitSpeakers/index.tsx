'use client'
// components/EsummitSpeakers/index.tsx
// Dark sticky-stacking highlight cards — green/black theme.
// Each card shows event info + featured speaker names.

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Ghost outline "Learn More" button
function ViewButton() {
  return (
    <button
      className="rounded-full border-2 font-medium uppercase tracking-widest transition-all duration-200
        hover:bg-mint/10 hover:shadow-md
        px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
      style={{
        borderColor: 'var(--accent-mint)',
        color: 'var(--accent-mint)',
      }}
    >
      Learn More
    </button>
  )
}

// Speaker avatar chip
function SpeakerChip({
  name,
  title,
  initials,
  color,
}: {
  name: string
  title: string
  initials: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-full"
      style={{ background: 'rgba(126, 211, 33, 0.07)', border: '1px solid rgba(126, 211, 33, 0.18)' }}
    >
      {/* Avatar circle */}
      <div
        className="font-display w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
        style={{ background: color, color: '#040605' }}
      >
        {initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="font-display font-medium text-xs sm:text-sm whitespace-nowrap"
          style={{ color: 'var(--text-primary)' }}
        >
          {name}
        </span>
        <span
          className="font-display font-light text-[10px] sm:text-xs whitespace-nowrap"
          style={{ color: 'var(--accent-mint)', opacity: 0.8 }}
        >
          {title}
        </span>
      </div>
    </div>
  )
}

const CARDS = [
  {
    num: '01',
    category: 'Pitch Competition',
    name: 'Pitch Finals',
    speakers: [
      { name: 'Priya Nair', title: 'Partner, Surge Ventures', initials: 'PN', color: '#FF4D3D' },
      { name: 'Sameer Khanna', title: 'Angel Investor', initials: 'SK', color: '#9B5CFF' },
      { name: 'Ritu Sharma', title: 'Founder, GreenMile', initials: 'RS', color: '#FF4D3D' },
    ],
    images: {
      col1Top:    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&q=85&auto=format&fit=crop', // speaker on stage
      col1Bottom: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=85&auto=format&fit=crop', // conference hall
      col2:       'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=700&q=85&auto=format&fit=crop', // startup pitch
    },
  },
  {
    num: '02',
    category: 'Hackathon',
    name: '24-Hour Build',
    speakers: [
      { name: 'Arjun Mehta', title: 'Co-founder, Kira.ai', initials: 'AM', color: '#3DD9FF' },
      { name: 'Kabir Singh', title: 'ex-Microsoft Research', initials: 'KS', color: '#9B5CFF' },
    ],
    images: {
      col1Top:    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=700&q=85&auto=format&fit=crop', // hackathon coding
      col1Bottom: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&q=85&auto=format&fit=crop', // team coding
      col2:       'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=85&auto=format&fit=crop', // hackathon team
    },
  },
  {
    num: '03',
    category: 'Investor Networking',
    name: 'Investor Meet',
    speakers: [
      { name: 'Vikram Bose', title: 'VP Product, Razorpay', initials: 'VB', color: '#3DD9FF' },
      { name: 'Deepika Rangi', title: 'Head, Nasscom', initials: 'DR', color: '#FF8C42' },
      { name: 'Ananya Joshi', title: 'Founder, MindBloom', initials: 'AJ', color: '#FF8C42' },
    ],
    images: {
      col1Top:    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&q=85&auto=format&fit=crop', // investor meeting
      col1Bottom: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=85&auto=format&fit=crop', // panel discussion
      col2:       'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=700&q=85&auto=format&fit=crop', // entrepreneur presenting
    },
  },
  {
    num: '04',
    category: 'Panel Discussions',
    name: 'Playbooks & AI',
    speakers: [
      { name: 'Sameer Khanna', title: 'Angel Investor', initials: 'SK', color: '#9B5CFF' },
      { name: 'Vikram Bose', title: 'VP Product, Razorpay', initials: 'VB', color: '#3DD9FF' },
    ],
    images: {
      col1Top:    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=700&q=85&auto=format&fit=crop',
      col1Bottom: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&q=85&auto=format&fit=crop',
      col2:       'https://images.unsplash.com/photo-1558403194-611308249627?w=700&q=85&auto=format&fit=crop',
    },
  },
  {
    num: '05',
    category: 'Startup Expo',
    name: '30+ Exhibitors',
    speakers: [],
    images: {
      col1Top:    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=85&auto=format&fit=crop',
      col1Bottom: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=700&q=85&auto=format&fit=crop',
      col2:       'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&q=85&auto=format&fit=crop',
    },
  },
]

const TOTAL = CARDS.length
const IMG_RADIUS = 'clamp(16px, 3vw, 36px)'

function HighlightCard({
  card,
  index,
  scrollYProgress,
}: {
  card: (typeof CARDS)[0]
  index: number
  scrollYProgress: any
}) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [index / TOTAL, 1], [1, targetScale])

  return (
    <div
      className="h-[85vh] sticky"
      style={{ top: `calc(${index * 28}px + 6rem)` }}
    >
      <motion.div
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px]
          border-2 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4"
        style={{
          borderColor: 'rgba(126, 211, 33, 0.4)',
          background: 'var(--bg-panel)',
          boxShadow: '0 0 60px rgba(126, 211, 33, 0.05) inset',
          scale,
          originY: 0,
        }}
      >
        {/* ── Top row: number + name + button ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-4 sm:gap-6">
            {/* Number */}
            <span
              className="font-display font-black leading-none select-none"
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 120px)',
                lineHeight: 0.9,
                color: 'var(--accent-mint)',
                textShadow: '0 0 40px var(--accent-green-glow)',
              }}
            >
              {card.num}
            </span>
            {/* Category + name */}
            <div className="flex flex-col">
              <span
                className="font-mono-data uppercase tracking-widest"
                style={{
                  color: 'var(--accent-mint)',
                  fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
                  opacity: 0.7,
                }}
              >
                {card.category}
              </span>
              <span
                className="font-display font-medium uppercase"
                style={{
                  color: 'var(--text-primary)',
                  fontSize: 'clamp(1rem, 2.2vw, 2.1rem)',
                }}
              >
                {card.name}
              </span>
            </div>
          </div>
          <ViewButton />
        </div>

        {/* ── Speaker chips row ── */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="font-mono-data text-[10px] uppercase tracking-widest mr-1"
            style={{ color: 'var(--accent-mint)', opacity: 0.5 }}
          >
            Speakers:
          </span>
          {card.speakers.map((s) => (
            <SpeakerChip
              key={s.name}
              name={s.name}
              title={s.title}
              initials={s.initials}
              color={s.color}
            />
          ))}
        </div>

        {/* ── Image grid ── */}
        <div className="flex gap-3 sm:gap-4 flex-1 overflow-hidden">
          {/* Left col — 40% — 2 stacked images */}
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
            <img
              src={card.images.col1Top}
              alt=""
              loading="lazy"
              className="w-full object-cover"
              style={{ borderRadius: IMG_RADIUS, height: 'clamp(120px, 15vw, 210px)' }}
            />
            <img
              src={card.images.col1Bottom}
              alt=""
              loading="lazy"
              className="w-full object-cover flex-1"
              style={{ borderRadius: IMG_RADIUS, height: 'clamp(140px, 20vw, 300px)' }}
            />
          </div>
          {/* Right col — 60% — tall image */}
          <div className="flex-1">
            <img
              src={card.images.col2}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ borderRadius: IMG_RADIUS }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function EsummitHighlights() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="esummit-highlights"
      ref={containerRef}
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 bg-[#0D2420] [.light_&]:bg-[#2A3C1A] text-white border-t border-mint/30 [.light_&]:border-[#4E6527]/50"
      aria-labelledby="highlights-heading"
    >
      {/* Green top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.5) 50%, transparent)' }}
      />

      <h2
        id="highlights-heading"
        className="text-white drop-shadow-lg font-display font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
        }}
      >
        Highlights
      </h2>

      <div className="relative">
        {CARDS.map((card, index) => (
          <HighlightCard
            key={card.num}
            card={card}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  )
}
