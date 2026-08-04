'use client'
// components/EsummitMarquee/index.tsx
// Photo gallery with:
//   · Entry animation: rows slide in from the RIGHT when section scrolls into view
//   · Continuous right-to-left infinite CSS scroll (Row 1 slower, Row 2 faster)
//   · Cloudy/dreamy fog masks on both edges with layered blur
//   · Speaker strip in the middle
//   · Green hover glow on each photo card

import { useEffect, useRef, useState } from 'react'

// E-Summit themed images
const ALL_IMGS = [
  // Row 1 — Speaker stages, keynotes, pitch competitions
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543269664-7eef42226a21?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560523160-754a9e25c68f?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=840&q=80&auto=format&fit=crop',
  // Row 2 — Investor meets, networking, workshops, celebrations
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=840&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=840&q=80&auto=format&fit=crop',
]

const ROW_1 = ALL_IMGS.slice(0, 11)
const ROW_2 = ALL_IMGS.slice(11)
// Quadruple for seamless infinite loop with no gap
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
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 mx-2"
      style={{
        background: 'rgba(13,20,14,0.95)',
        border: '1px solid rgba(126,211,33,0.25)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
        style={{
          background: `${speaker.color}22`,
          border: `2px solid ${speaker.color}66`,
          color: speaker.color,
          fontFamily: "'Kanit', sans-serif",
          boxShadow: `0 0 16px ${speaker.color}33`,
        }}
      >
        {speaker.initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-sm whitespace-nowrap" style={{ color: '#F5F5F0', fontFamily: "'Kanit', sans-serif" }}>
          {speaker.name}
        </span>
        <span className="font-light text-xs whitespace-nowrap" style={{ color: '#7ED321', fontFamily: "'Kanit', sans-serif", opacity: 0.75 }}>
          {speaker.title}
        </span>
      </div>
    </div>
  )
}

function SpeakerStrip() {
  const items = [...SPEAKERS, ...SPEAKERS, ...SPEAKERS, ...SPEAKERS]
  return (
    <div className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #070B08 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #070B08 0%, transparent 100%)' }} />
      <div className="flex" style={{ animation: 'speakerScroll 32s linear infinite', willChange: 'transform' }}>
        {items.map((s, i) => <SpeakerCard key={`${s.name}-${i}`} speaker={s} />)}
      </div>
    </div>
  )
}

/** Single image card with hover glow */
function PhotoCard({ src, index }: { src: string; index: number }) {
  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
      style={{ width: '400px', height: '260px' }}
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Green tint on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: 'rgba(126,211,33,0.12)' }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(7,11,8,0.5) 100%)' }}
      />
      {/* Green border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-400 opacity-0 group-hover:opacity-100"
        style={{ boxShadow: '0 0 0 1.5px rgba(126,211,33,0.5) inset, 0 0 24px rgba(126,211,33,0.18)' }}
      />
    </div>
  )
}

/** One infinite-scroll photo row — slides in from right on mount, then scrolls continuously */
function PhotoRow({
  images,
  duration,
  visible,
  delay,
}: {
  images: string[]
  duration: number
  visible: boolean
  delay: number
}) {
  return (
    <div
      className="overflow-hidden"
      style={{
        // Entry: start from far right, animate to position-0 when visible
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
          animation: `marqueeScroll ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={i} src={src} index={i} />
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
      className="esummit-section overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-12 relative"
      style={{ background: '#070B08', fontFamily: "'Kanit', sans-serif" }}
      aria-label="E-Summit moments and speakers"
    >
      {/* ── CSS keyframes ── */}
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes speakerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
      `}</style>

      {/* ── Cloudy / dreamy fog edges ── */}
      {/* Left cloud — wide, layered */}
      <div className="absolute left-0 top-0 bottom-0 z-20 pointer-events-none" style={{ width: '220px' }}>
        {/* Solid black core */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #070B08 0%, #070B08 30%, transparent 100%)' }} />
        {/* Soft blur bloom */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(7,11,8,0.95) 0%, rgba(7,11,8,0.7) 45%, transparent 100%)',
          filter: 'blur(12px)',
        }} />
        {/* Feathered outer glow */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(126,211,33,0.04) 0%, transparent 100%)',
          filter: 'blur(20px)',
        }} />
      </div>

      {/* Right cloud — wide, layered */}
      <div className="absolute right-0 top-0 bottom-0 z-20 pointer-events-none" style={{ width: '220px' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(270deg, #070B08 0%, #070B08 30%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(270deg, rgba(7,11,8,0.95) 0%, rgba(7,11,8,0.7) 45%, transparent 100%)',
          filter: 'blur(12px)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(270deg, rgba(126,211,33,0.04) 0%, transparent 100%)',
          filter: 'blur(20px)',
        }} />
      </div>

      {/* ── Section label ── */}
      <div
        className="flex items-center justify-center gap-2 mb-10 relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
        }}
      >
        <div className="h-px w-16 bg-[#7ED321]/40" />
        <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[#7ED321] font-bold">
          E-Summit Moments
        </span>
        <div className="h-px w-16 bg-[#7ED321]/40" />
      </div>

      {/* ── Row 1: enters from right, scrolls left (slower) ── */}
      <div className="mb-4">
        <PhotoRow images={LOOP_1} duration={55} visible={visible} delay={0} />
      </div>

      {/* ── Speaker strip ── */}
      <div
        className="relative z-10 my-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.5s',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-10 bg-[#7ED321]/30" />
          <span className="font-mono-data text-[9px] uppercase tracking-[0.2em] text-[#7ED321]/60 font-bold">
            Featured Speakers
          </span>
          <div className="h-px w-10 bg-[#7ED321]/30" />
        </div>
        <SpeakerStrip />
      </div>

      {/* ── Row 2: enters from right (slight delay), scrolls left (faster) ── */}
      <div className="mt-4">
        <PhotoRow images={LOOP_2} duration={40} visible={visible} delay={0.18} />
      </div>
    </section>
  )
}
