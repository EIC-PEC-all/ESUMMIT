'use client'
// components/EsummitMarquee/index.tsx
// Two rows of GIF images driven by scroll position + a speaker name marquee strip in between.

import { useEffect, useRef, useState } from 'react'

const ALL_GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
]

const ROW_1 = ALL_GIFS.slice(0, 11)
const ROW_2 = ALL_GIFS.slice(11)
const TRIPLED_1 = [...ROW_1, ...ROW_1, ...ROW_1]
const TRIPLED_2 = [...ROW_2, ...ROW_2, ...ROW_2]

// All speakers for the marquee strip
const SPEAKERS = [
  { name: 'Priya Nair', title: 'Partner, Surge Ventures', initials: 'PN', color: '#FF4D3D' },
  { name: 'Arjun Mehta', title: 'Co-founder & CTO, Kira.ai', initials: 'AM', color: '#3DD9FF' },
  { name: 'Deepika Rangi', title: 'Head of Startup Ecosystem, Nasscom', initials: 'DR', color: '#FF8C42' },
  { name: 'Sameer Khanna', title: 'Angel Investor & ex-Sequoia EIR', initials: 'SK', color: '#9B5CFF' },
  { name: 'Ritu Sharma', title: 'Founder, GreenMile Logistics', initials: 'RS', color: '#FF4D3D' },
  { name: 'Vikram Bose', title: 'VP Product, Razorpay', initials: 'VB', color: '#3DD9FF' },
  { name: 'Ananya Joshi', title: 'Founder, MindBloom EdTech', initials: 'AJ', color: '#FF8C42' },
  { name: 'Kabir Singh', title: 'CTO, Stealth Agri-Startup', initials: 'KS', color: '#9B5CFF' },
]

// Speaker card for the marquee strip
function SpeakerCard({ speaker }: { speaker: (typeof SPEAKERS)[0] }) {
  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl shrink-0 mx-2"
      style={{
        background: 'rgba(13, 20, 14, 0.95)',
        border: '1px solid rgba(126, 211, 33, 0.25)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Avatar */}
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
      {/* Name & title */}
      <div className="flex flex-col leading-tight">
        <span
          className="font-semibold text-sm whitespace-nowrap"
          style={{ color: '#F5F5F0', fontFamily: "'Kanit', sans-serif" }}
        >
          {speaker.name}
        </span>
        <span
          className="font-light text-xs whitespace-nowrap"
          style={{ color: '#7ED321', fontFamily: "'Kanit', sans-serif", opacity: 0.75 }}
        >
          {speaker.title}
        </span>
      </div>
    </div>
  )
}

// Infinitely scrolling speaker strip
function SpeakerStrip() {
  // Triplicate for seamless loop
  const items = [...SPEAKERS, ...SPEAKERS, ...SPEAKERS]

  return (
    <div className="relative overflow-hidden py-2">
      {/* Left/right fade masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #070B08 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #070B08 0%, transparent 100%)' }}
      />

      <div
        className="flex"
        style={{
          animation: 'speakerScroll 28s linear infinite',
          willChange: 'transform',
        }}
      >
        {items.map((speaker, i) => (
          <SpeakerCard key={`${speaker.name}-${i}`} speaker={speaker} />
        ))}
      </div>

      <style jsx>{`
        @keyframes speakerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}

export default function EsummitMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(200)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const sectionTop = sectionRef.current.getBoundingClientRect().top + window.scrollY
      const scrollOffset = (window.scrollY - sectionTop + window.innerHeight) * 0.3
      setOffset(scrollOffset)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const GifRow = ({ images, direction }: { images: string[]; direction: 'right' | 'left' }) => (
    <div
      className="flex gap-3"
      style={{
        transform:
          direction === 'right'
            ? `translateX(${offset - 200}px)`
            : `translateX(${-(offset - 200)}px)`,
        willChange: 'transform',
      }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative shrink-0 rounded-2xl overflow-hidden group">
          <img
            src={src}
            alt=""
            loading="lazy"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ width: '420px', height: '270px' }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: 'rgba(126, 211, 33, 0.10)' }}
          />
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: '1px solid rgba(126, 211, 33, 0.15)' }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <section
      ref={sectionRef}
      id="esummit-marquee"
      className="esummit-section overflow-hidden pt-24 sm:pt-32 md:pt-40 pb-12 relative"
      style={{ background: '#070B08', fontFamily: "'Kanit', sans-serif" }}
      aria-label="Design showcase and speakers"
    >
      {/* Edge fade masks for GIF rows */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #070B08 0%, transparent 100%)' }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #070B08 0%, transparent 100%)' }}
      />

      {/* Section label */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="h-px w-16 bg-[#7ED321]/40" />
        <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[#7ED321] font-bold">
          Design Showcase
        </span>
        <div className="h-px w-16 bg-[#7ED321]/40" />
      </div>

      {/* Row 1 — moves right */}
      <GifRow images={TRIPLED_1} direction="right" />

      {/* ── Speaker Names Strip ── */}
      <div className="relative z-20 my-5">
        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-10 bg-[#7ED321]/30" />
          <span className="font-mono-data text-[9px] uppercase tracking-[0.2em] text-[#7ED321]/60 font-bold">
            Featured Speakers
          </span>
          <div className="h-px w-10 bg-[#7ED321]/30" />
        </div>
        <SpeakerStrip />
      </div>

      {/* Row 2 — moves left */}
      <GifRow images={TRIPLED_2} direction="left" />
    </section>
  )
}
