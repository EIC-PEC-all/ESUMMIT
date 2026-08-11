'use client'
// components/EsummitMarquee/index.tsx
// Dynamic Random Shuffling on Mount with 19 Authentic PEC Campus & Event Photos

import { useEffect, useRef, useState } from 'react'

const ALL_IMGS = [
  '/gallery/pec_admin_building.jpg',
  '/gallery/pec_centenary_hall.jpg',
  '/gallery/pec_mig21.jpg',
  '/gallery/pec_aerial_night.jpg',
  '/gallery/pec_auditorium_facade.jpg',
  '/gallery/pec_iaf_helicopter.jpg',
  '/gallery/pec_pitch.jpg',
  '/gallery/pec_team.png',
  '/gallery/pec_group.png',
  '/gallery/pec_auditorium.png',
  '/gallery/pec_startup_fair.png',
  '/gallery/pec_senate_roundtable.png',
  '/gallery/pec_keynote_speaker.png',
  '/gallery/pec_innovation_stage.png',
  '/gallery/pec_pitch_table.png',
  '/gallery/pec_investor_poster.png',
  '/gallery/pec_funding_conclave.png',
  '/gallery/pec_lawn_mosaic.png',
  '/gallery/pec_senate_hall.png',
]

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** Single image card with hover glow */
function PhotoCard({ src }: { src: string }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-void/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-void"
      style={{ width: '400px', height: '250px' }}
    >
      <img
        src={src}
        alt="PEC E-Summit photo"
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-void opacity-0 shadow-[0_0_20px_rgba(7,11,8,0.4)] transition-all duration-300 group-hover:opacity-100" />
    </div>
  )
}

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
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(70px) scale(0.95)',
        opacity: visible ? 1 : 0,
        transition: `transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 0.8s ease ${delay}s`,
        willChange: 'transform, opacity',
      }}
    >
      <div
        className="flex w-max gap-4"
        style={{
          animation: `${direction === 'right' ? 'marqueeScrollReverse' : 'marqueeScroll'} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={`${src}-${i}`} src={src} />
        ))}
      </div>
    </div>
  )
}

export default function EsummitMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [loop1, setLoop1] = useState<string[]>(() => {
    const row1 = ALL_IMGS.slice(0, 9)
    return [...row1, ...row1, ...row1, ...row1]
  })
  const [loop2, setLoop2] = useState<string[]>(() => {
    const row2 = ALL_IMGS.slice(9)
    return [...row2, ...row2, ...row2, ...row2]
  })

  // Dynamic randomization on client mount
  useEffect(() => {
    const shuffled = shuffleArray(ALL_IMGS)
    const mid = Math.ceil(shuffled.length / 2)
    const r1 = shuffled.slice(0, mid)
    const r2 = shuffled.slice(mid)
    setLoop1([...r1, ...r1, ...r1, ...r1])
    setLoop2([...r2, ...r2, ...r2, ...r2])
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="esummit-marquee"
      className="esummit-section relative z-10 -mt-24 sm:-mt-28 md:-mt-32 overflow-hidden rounded-t-[40px] bg-[#081C16] pb-32 pt-16 sm:pt-20 text-white sm:rounded-t-[50px] md:rounded-t-[60px] border-t border-[#7ED321]/20"
      aria-label="E-Summit moments"
    >
      <style>{`
        @keyframes marqueeScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeScrollReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
      `}</style>

      <div className="mb-4">
        <PhotoRow images={loop1} duration={50} visible={visible} delay={0} direction="left" />
      </div>

      <div className="mt-4">
        <PhotoRow images={loop2} duration={45} visible={visible} delay={0.15} direction="right" />
      </div>
    </section>
  )
}
