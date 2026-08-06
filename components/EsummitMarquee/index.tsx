'use client'
// components/EsummitMarquee/index.tsx
// Photo gallery with:
//   · Entry animation: rows slide in from the RIGHT when section scrolls into view
//   · Continuous right-to-left infinite CSS scroll (Row 1 slower, Row 2 faster)
//   · Cloudy/dreamy fog masks on both edges with layered blur
//   · Speaker strip in the middle
//   · Green hover glow on each photo card

import { useEffect, useRef, useState } from 'react'

// E-Summit themed images (Tech, Pitch, Investors, Hackathons)
const ALL_IMGS = [
  // Row 1 — Keynotes, pitch competitions, tech stages
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=840&q=80&auto=format&fit=crop',
  // Row 2 — Investor meets, networking, workshops, hackathon teams
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=840&q=80&auto=format&fit=crop',
]

const ROW_1 = ALL_IMGS.slice(0, 8)
const ROW_2 = ALL_IMGS.slice(8)
const LOOP_1 = [...ROW_1, ...ROW_1, ...ROW_1, ...ROW_1]
const LOOP_2 = [...ROW_2, ...ROW_2, ...ROW_2, ...ROW_2]

const SPEAKERS = [
  { name: 'Priya Nair',    title: 'Partner, Surge Ventures',           initials: 'PN', color: '#FF4D3D' },
  { name: 'Arjun Mehta',   title: 'Co-founder & CTO, Kira.ai',         initials: 'AM', color: '#3DD9FF' },
  { name: 'Deepika Rangi', title: 'Head of Startup Ecosystem, Nasscom', initials: 'DR', color: '#FF8C42' },
  { name: 'Sameer Khanna', title: 'Angel Investor & ex-Sequoia EIR',    initials: 'SK', color: '#9B5CFF' },
  { name: 'Ritu Sharma',   title: 'Founder, GreenMile Logistics',       initials: 'RS', color: '#FF4D3D' },
  { name: 'Vikram Bose',   title: 'VP Product, Razorpay',               initials: 'VB', color: '#3DD9FF' },
  { name: 'Ananya Joshi',  title: 'Founder, MindBloom EdTech',          initials: 'AJ', color: '#FF8C42' },
  { name: 'Kabir Singh',   title: 'CTO, Stealth Agri-Startup',          initials: 'KS', color: '#9B5CFF' },
]

function SpeakerCard({ speaker }: { speaker: (typeof SPEAKERS)[0] }) {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 mx-2 bg-panel border border-border-subtle"
      style={{
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="font-body w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
        style={{
          background: `${speaker.color}22`,
          border: `2px solid ${speaker.color}66`,
          color: speaker.color,
          boxShadow: `0 0 16px ${speaker.color}33`,
        }}
      >
        {speaker.initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-body font-semibold text-sm whitespace-nowrap text-primary">
          {speaker.name}
        </span>
        <span className="font-body text-xs whitespace-nowrap text-mint/80">
          {speaker.title}
        </span>
      </div>
    </div>
  )
}

function SpeakerStrip({ direction = 'left' }: { direction?: 'left' | 'right' }) {
  const items = [...SPEAKERS, ...SPEAKERS, ...SPEAKERS, ...SPEAKERS]
  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, var(--bg-void) 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, var(--bg-void) 0%, transparent 100%)' }} />
      <div 
        className="flex" 
        style={{ 
          animation: `${direction === 'right' ? 'speakerScrollReverse' : 'speakerScroll'} 35s linear infinite`, 
          willChange: 'transform' 
        }}
      >
        {items.map((s, i) => <SpeakerCard key={`${s.name}-${i}`} speaker={s} />)}
      </div>
    </div>
  )
}

/** Single image card with hover glow */
function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
      style={{ width: '400px', height: '250px' }}
    >
      <img
        src={src}
        alt="E-Summit event photo"
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Green tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-mint/10"
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-void/80 via-transparent to-transparent"
      />
      {/* Green border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 border border-mint/40 shadow-[inset_0_0_20px_rgba(80,227,194,0.2)]"
      />
    </div>
  )
}

/** One infinite-scroll photo row — direction left or right */
function PhotoRow({
  images,
  duration,
  visible,
  delay,
  direction = 'left',
}: {
  images: string[]
  duration: number
  visible: boolean
  delay: number
  direction?: 'left' | 'right'
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        transform: visible ? 'translateX(0)' : 'translateX(110vw)',
        opacity: visible ? 1 : 0,
        transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 0.7s ease ${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      {/* Inner infinite-scroll strip */}
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `${direction === 'right' ? 'marqueeScrollReverse' : 'marqueeScroll'} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={i} src={src} />
        ))}
      </div>
    </div>
  )
}

export default function EsummitMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Trigger entry animation when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="esummit-marquee"
      className="esummit-section overflow-hidden pt-20 pb-12 relative bg-void"
      aria-label="E-Summit moments and speakers"
    >
      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        @keyframes speakerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        @keyframes speakerScrollReverse {
          0%   { transform: translateX(-25%); }
          100% { transform: translateX(0%); }
        }
      `}</style>

      {/* ── Cloudy / dreamy fog edges ── */}
      <div className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none w-48 bg-gradient-to-r from-void via-void/80 to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none w-48 bg-gradient-to-l from-void via-void/80 to-transparent" />

      {/* ── Row 1: enters from right, scrolls LEFT ── */}
      <div className="mb-4">
        <PhotoRow images={LOOP_1} duration={50} visible={visible} delay={0} direction="left" />
      </div>

      {/* ── Speaker strip: scrolls RIGHT ── */}
      <div
        className="relative z-10 my-6"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
        }}
      >
        <SpeakerStrip direction="right" />
      </div>

      {/* ── Row 2: enters from right, scrolls RIGHT (opposite to Row 1) ── */}
      <div className="mt-4">
        <PhotoRow images={LOOP_2} duration={45} visible={visible} delay={0.18} direction="right" />
      </div>
    </section>
  )
}
