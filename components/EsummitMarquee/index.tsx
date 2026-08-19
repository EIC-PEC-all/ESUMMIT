'use client'

import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'

/** Single image card with hover glow */
function PhotoCard({ src, slotNum }: { src?: string; slotNum: number }) {
  return (
    <div
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-void/20 shadow-2xl transition-all duration-300 hover:scale-105 hover:border-void bg-[#0B150E]"
      style={{ width: '400px', height: '250px' }}
    >
      {src ? (
        <img
          src={src}
          alt="E-Summit event photo"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center space-y-2 bg-gradient-to-b from-[#101F15] via-[#0B150E] to-[#07130F]">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mint/10 border border-mint/30 text-mint">
            <ImagePlus className="h-6 w-6" />
          </div>
          <span className="font-mono-data text-xs font-bold uppercase tracking-widest text-mint">
            SUMMIT PHOTO #{slotNum}
          </span>
          <span className="font-mono-data text-[10px] text-gray-400">
            Upload from CMS Control Panel
          </span>
        </div>
      )}
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      {/* Border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-void opacity-0 shadow-[0_0_20px_rgba(7,11,8,0.4)] transition-all duration-300 group-hover:opacity-100" />
    </div>
  )
}

/** One infinite-scroll photo row — smooth reveal when transition completes */
function PhotoRow({
  images,
  duration,
  visible,
  delay,
  direction = 'left',
  offset = 0,
}: {
  images: (string | undefined)[]
  duration: number
  visible: boolean
  delay: number
  direction?: 'left' | 'right'
  offset?: number
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
      {/* Inner infinite-scroll strip */}
      <div
        className="flex w-max gap-4"
        style={{
          animation: `${direction === 'right' ? 'marqueeScrollReverse' : 'marqueeScroll'} ${duration}s linear infinite`,
          willChange: 'transform',
        }}
      >
        {images.map((src, i) => (
          <PhotoCard key={i} src={src} slotNum={(i % 8) + 1 + offset} />
        ))}
      </div>
    </div>
  )
}

export default function EsummitMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

    fetch(`${apiUrl}/gallery`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { imageUrl: string }[]) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setGalleryImages(data.map((d) => d.imageUrl))
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  const row1 = galleryImages.slice(0, 8)
  const row2 = galleryImages.slice(8, 16)

  const loop1 = Array.from({ length: 8 }, (_, i) => row1[i] || undefined)
  const loop2 = Array.from({ length: 8 }, (_, i) => row2[i] || undefined)

  const fullLoop1 = [...loop1, ...loop1, ...loop1, ...loop1]
  const fullLoop2 = [...loop2, ...loop2, ...loop2, ...loop2]

  // Trigger entry animation ONLY when section is sufficiently scrolled past transition
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.55 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="esummit-marquee"
      className="esummit-section relative z-10 -mt-24 sm:-mt-28 md:-mt-32 overflow-hidden rounded-t-[40px] bg-mint pb-32 pt-16 sm:pt-20 text-void sm:rounded-t-[50px] md:rounded-t-[60px]"
      aria-label="E-Summit moments"
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
      `}</style>

      {/* ── Row 1: enters smoothly, scrolls LEFT ── */}
      <div className="mb-4">
        <PhotoRow images={fullLoop1} duration={50} visible={visible} delay={0} direction="left" offset={0} />
      </div>

      {/* ── Row 2: enters smoothly, scrolls RIGHT (opposite to Row 1) ── */}
      <div className="mt-4">
        <PhotoRow images={fullLoop2} duration={45} visible={visible} delay={0.15} direction="right" offset={8} />
      </div>
    </section>
  )
}
