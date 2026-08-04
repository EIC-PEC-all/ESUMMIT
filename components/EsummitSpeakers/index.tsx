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
        hover:bg-[#7ED321]/10 hover:shadow-[0_0_20px_rgba(126,211,33,0.3)]
        px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
      style={{
        borderColor: '#7ED321',
        color: '#7ED321',
        fontFamily: "'Kanit', sans-serif",
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
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
        style={{ background: color, color: '#070B08', fontFamily: "'Kanit', sans-serif" }}
      >
        {initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="font-medium text-xs sm:text-sm whitespace-nowrap"
          style={{ color: '#F5F5F0', fontFamily: "'Kanit', sans-serif" }}
        >
          {name}
        </span>
        <span
          className="font-light text-[10px] sm:text-xs whitespace-nowrap"
          style={{ color: '#7ED321', fontFamily: "'Kanit', sans-serif", opacity: 0.8 }}
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
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
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
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
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
      col1Top: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1Bottom: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
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
          background: '#0D140E',
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
              className="font-black leading-none select-none"
              style={{
                fontFamily: "'Kanit', sans-serif",
                fontSize: 'clamp(2.5rem, 8vw, 120px)',
                lineHeight: 0.9,
                color: '#7ED321',
                textShadow: '0 0 40px rgba(126, 211, 33, 0.4)',
              }}
            >
              {card.num}
            </span>
            {/* Category + name */}
            <div className="flex flex-col">
              <span
                className="font-mono-data uppercase tracking-widest"
                style={{
                  color: '#7ED321',
                  fontSize: 'clamp(0.6rem, 1vw, 0.85rem)',
                  opacity: 0.7,
                }}
              >
                {card.category}
              </span>
              <span
                className="font-medium uppercase"
                style={{
                  color: '#F5F5F0',
                  fontFamily: "'Kanit', sans-serif",
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
            style={{ color: '#7ED321', opacity: 0.5 }}
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
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#070B08', fontFamily: "'Kanit', sans-serif" }}
      aria-labelledby="highlights-heading"
    >
      {/* Green top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.5) 50%, transparent)' }}
      />

      <h2
        id="highlights-heading"
        className="hero-heading-green font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontFamily: "'Kanit', sans-serif",
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
