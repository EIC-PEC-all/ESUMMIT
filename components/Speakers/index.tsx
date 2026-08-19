'use client'
// components/Speakers/index.tsx
// 3D Tilt Wheel effect for the VISIONARIES speakers section.
// Speaker tiles rotate around a circle in 3D space that tilts with the mouse pointer.

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Zap, Linkedin, Twitter } from 'lucide-react'
import { SPEAKERS } from '@/lib/data'
import Link from 'next/link'
import CircuitBoard from '../Hero/CircuitBoard'

// Unsplash entrepreneurship images for the wheel tiles
const TILE_IMAGES = [
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80&auto=format&fit=crop',
]

const COLORS = [
  '#FF4D3D',
  '#3DD9FF',
  '#FF8C42',
  '#9B5CFF',
  '#7ED321',
  '#FFD700',
  '#FF4D3D',
  '#3DD9FF',
]

/** 3D Tilt Wheel — tiles orbiting a circle, ring tilts with mouse */
function TiltWheel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const rafRef = useRef<number>()
  const [tiles, setTiles] = useState<
    { angle: number; img: string; speaker: (typeof SPEAKERS)[0]; color: string }[]
  >([])

  // Spring-damped mouse tilt
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const [tiltX, setTiltX] = useState(0)
  const [tiltY, setTiltY] = useState(0)

  // Sync spring values to state for use in style
  useEffect(() => {
    const unsubX = springX.on('change', setTiltX)
    const unsubY = springY.on('change', setTiltY)
    return () => {
      unsubX()
      unsubY()
    }
  }, [springX, springY])

  // Build tile data
  useEffect(() => {
    const count = SPEAKERS.length
    setTiles(
      SPEAKERS.map((speaker, i) => ({
        angle: (360 / count) * i,
        img: TILE_IMAGES[i % TILE_IMAGES.length],
        speaker,
        color: COLORS[i % COLORS.length],
      }))
    )
  }, [])

  // Auto-rotate
  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const delta = now - last
      last = now
      angleRef.current = (angleRef.current + delta * 0.018) % 360
      setTiles((prev) =>
        prev.map((t, i) => ({
          ...t,
          angle: (angleRef.current + (360 / SPEAKERS.length) * i) % 360,
        }))
      )
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Mouse tracking for tilt
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      // Map mouse to ±25° tilt
      mouseX.set(((e.clientY - cy) / (rect.height / 2)) * -22)
      mouseY.set(((e.clientX - cx) / (rect.width / 2)) * 22)
    },
    [mouseX, mouseY]
  )

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const RADIUS = 320 // px — orbit radius

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ height: '680px', perspective: '1200px', cursor: 'grab' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* The rotating ring — tilts with mouse */}
      <div
        className="relative"
        style={{
          width: '1px',
          height: '1px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transition: 'transform 0.05s linear',
        }}
      >
        {tiles.map((tile, i) => {
          const rad = (tile.angle * Math.PI) / 180
          const x = Math.sin(rad) * RADIUS
          const z = Math.cos(rad) * RADIUS
          // Depth-based opacity & scale for realism
          const depth = (z + RADIUS) / (2 * RADIUS) // 0..1
          const scale = 0.72 + depth * 0.38
          const opacity = 0.45 + depth * 0.55

          return (
            <div
              key={tile.speaker.id}
              className="group absolute"
              style={{
                width: '160px',
                height: '210px',
                transform: `translateX(${x - 80}px) translateZ(${z}px) rotateY(${-tile.angle}deg)`,
                transformOrigin: 'center center',
                opacity,
                scale: String(scale),
                zIndex: Math.round(depth * 100),
                pointerEvents: depth > 0.7 ? 'auto' : 'none',
              }}
            >
              {/* Card */}
              <div
                className="relative h-full w-full overflow-hidden rounded-2xl"
                style={{
                  boxShadow:
                    depth > 0.85
                      ? `0 0 0 2px ${tile.color}80, 0 8px 40px rgba(0,0,0,0.7), 0 0 24px ${tile.color}30`
                      : '0 4px 20px rgba(0,0,0,0.6)',
                  transition: 'box-shadow 0.3s',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center bottom',
                }}
              >
                {/* Photo */}
                <img
                  src={tile.img}
                  alt={tile.speaker.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                {/* Bottom gradient */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(0deg, rgba(7,11,8,0.95) 0%, rgba(7,11,8,0.3) 50%, transparent 100%)',
                  }}
                />
                {/* Glow border on front tile */}
                {depth > 0.85 && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                    style={{ boxShadow: `0 0 0 2px ${tile.color}` }}
                  />
                )}
                {/* Speaker name + title */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p
                    className="text-xs font-bold leading-tight text-white"
                    style={{ fontFamily: "'Kanit', sans-serif" }}
                  >
                    {tile.speaker.name}
                  </p>
                  <p
                    className="mt-0.5 text-[10px] leading-tight"
                    style={{ color: tile.color, fontFamily: "'Kanit', sans-serif" }}
                  >
                    {tile.speaker.title.split(',')[0]}
                  </p>
                  {/* Track badge */}
                  <span
                    className="mt-1.5 inline-block rounded px-1.5 py-0.5 font-mono-data text-[8px] font-bold uppercase tracking-widest"
                    style={{
                      background: `${tile.color}22`,
                      color: tile.color,
                      border: `1px solid ${tile.color}44`,
                    }}
                  >
                    ⚡ {tile.speaker.track}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {/* Orbit ring — decorative circle in 3D space */}
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: `${RADIUS * 2}px`,
            height: `${RADIUS * 2}px`,
            left: `-${RADIUS}px`,
            top: `-${RADIUS}px`,
            border: '1px solid rgba(126,211,33,0.12)',
            transformStyle: 'preserve-3d',
            transform: 'rotateX(90deg)',
          }}
        />
      </div>

      {/* Center label — sits in the middle of the wheel */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{ textAlign: 'center' }}
      >
        <p className="mb-2 font-mono-data text-[10px] font-bold uppercase tracking-[0.25em] text-[#7ED321] opacity-70">
          ⚡ Drag to explore
        </p>
        <h2
          className="text-stroke-green select-none font-display font-black uppercase leading-none"
          style={{
            fontSize: 'clamp(48px, 7vw, 110px)',
            WebkitTextStroke: '1.5px rgba(126,211,33,0.6)',
            color: 'transparent',
            textShadow: '0 0 60px rgba(126,211,33,0.15)',
            fontFamily: "'Kanit', sans-serif",
          }}
        >
          VISION
          <br />
          ARIES
        </h2>
      </div>

      {/* Hint: mouse instruction fade */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 font-mono-data text-[10px] uppercase tracking-widest text-[#8A9488]">
        Move cursor to tilt · Auto-rotating
      </div>
    </div>
  )
}

export default function Speakers() {
  return (
    <section
      id="speakers"
      className="relative overflow-hidden border-b border-t border-[#7ED321]/15 bg-[#111A12] py-24 lg:py-32"
      aria-labelledby="speakers-heading"
    >
      {/* Circuit overlay */}
      <CircuitBoard prefersReduced={false} />
      <div className="current-line-horizontal pointer-events-none absolute left-0 right-0 top-0" />

      <div className="section-container relative z-10">
        {/* Header row */}
        <motion.div
          className="mb-6 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Zap size={14} className="fill-[#7ED321] text-[#7ED321]" />
              <p className="font-mono-data text-xs font-bold uppercase tracking-[0.2em] text-[#7ED321]">
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
            className="inline-flex items-center gap-2 border-b border-[#7ED321]/40 pb-1 font-mono-data text-xs uppercase tracking-wider text-[#7ED321] transition-colors hover:text-white"
          >
            View All Speakers &rarr;
          </Link>
        </motion.div>

        {/* 3D Tilt Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <TiltWheel />
        </motion.div>
      </div>
    </section>
  )
}
