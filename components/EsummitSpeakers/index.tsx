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
    day: 'DAY 01',
    date: 'MARCH 15, 2026',
    title: 'Inauguration & Pitch Arena',
    events: [
      { time: '09:30 AM', title: 'Grand Opening & Keynote Address', tag: 'Main Stage' },
      { time: '11:00 AM', title: 'Startup Expo & Founder Alley Launch', tag: 'Expo Floor' },
      { time: '02:00 PM', title: 'VC Pitch Arena: Qualifying Round', tag: 'Pitch Room' },
      { time: '05:00 PM', title: '24-Hour National Hackathon Kickoff', tag: 'Hacker Lab' },
      { time: '08:00 PM', title: 'VIP Investor & Founder Networking Dinner', tag: 'VIP Lounge' },
    ],
  },
  {
    num: '02',
    day: 'DAY 02',
    date: 'MARCH 16, 2026',
    title: 'Hackathon Demos & Grand Finals',
    events: [
      { time: '10:00 AM', title: 'DeepTech & GenAI VC Masterclass', tag: 'Auditorium' },
      { time: '12:30 PM', title: 'Hackathon Live Project Demos & Judging', tag: 'Hacker Lab' },
      { time: '03:00 PM', title: 'Grand Pitch Finals (₹7.5L Pool)', tag: 'Main Stage' },
      { time: '05:30 PM', title: 'Valedictory Keynote & Award Ceremony', tag: 'Main Stage' },
    ],
  },
]

const TOTAL = CARDS.length

function HighlightCard({
  card,
  index,
  scrollYProgress,
}: {
  card: (typeof CARDS)[0]
  index: number
  scrollYProgress: any
}) {
  const targetScale = 1 - (TOTAL - 1 - index) * 0.04
  const scale = useTransform(scrollYProgress, [index / TOTAL, 1], [1, targetScale])

  return (
    <div
      className="h-[80vh] sticky"
      style={{ top: `calc(${index * 36}px + 6rem)` }}
    >
      <div className="flex w-full h-full justify-end">
        {/* Left side empty space (50%) */}
        <div className="hidden lg:block w-1/2" aria-hidden="true" />

        {/* Right side 50% card */}
        <motion.div
          className="w-full lg:w-1/2 h-full rounded-[32px] sm:rounded-[40px] border-2 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
          style={{
            borderColor: 'rgba(126, 211, 33, 0.3)',
            background: '#07130F',
            scale,
            originY: 0,
          }}
        >
          <div>
            {/* Card Top Header */}
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-display font-black text-4xl sm:text-5xl text-[#7ED321]">
                  {card.day}
                </span>
                <span className="font-mono-data text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {card.date}
                </span>
              </div>
              <span className="font-mono-data text-xs font-bold text-[#7ED321] border border-[#7ED321]/30 bg-[#7ED321]/10 px-3 py-1 rounded-full">
                Phase {card.num}
              </span>
            </div>

            <h3 className="mb-6 font-display font-bold text-xl sm:text-2xl text-white">
              {card.title}
            </h3>

            {/* Events List */}
            <div className="space-y-3">
              {card.events.map((ev, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#040A07]/80 p-3.5 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-data text-xs font-bold text-[#7ED321] shrink-0">
                      {ev.time}
                    </span>
                    <span className="font-body text-xs sm:text-sm font-medium text-white truncate">
                      {ev.title}
                    </span>
                  </div>
                  <span className="font-mono-data text-[10px] text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded shrink-0">
                    {ev.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer note */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-mono-data text-xs text-gray-400">
            <span>PEC Sector 12, Chandigarh</span>
            <span className="text-[#7ED321]">E-Summit 2026</span>
          </div>
        </motion.div>
      </div>
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
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 bg-void text-white"
      aria-labelledby="highlights-heading"
    >
      <h2
        id="highlights-heading"
        className="text-[var(--accent-mint)] font-display font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
        }}
      >
        HIGHLIGHTS
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
