'use client'

import { useRef, useEffect } from 'react'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedText from '@/components/ui/AnimatedText'
import RegisterButton from '@/components/ui/RegisterButton'
import { useSummitData } from '@/hooks/useSummitData'
import GlassSurface from './GlassSurface'

const PILLARS = [
  {
    stat: '5K+',
    label: 'TOTAL FOOTFALL',
    desc: 'Record-breaking attendance from student builders, innovators, and industry leaders.',
  },
  {
    stat: '50+',
    label: 'STARTUPS ATTENDED',
    desc: 'Emerging ventures and deep-tech startups showcasing their products and raising capital.',
  },
  {
    stat: '50+',
    label: 'WORKSHOPS',
    desc: 'Hands-on learning sessions on validation, pitching, finance, and emerging tech.',
  },
  {
    stat: '30+',
    label: 'SPEAKER SESSIONS',
    desc: 'Insights from founders, market leaders, and VCs sharing non-textbook lessons.',
  },
  {
    stat: '3K+',
    label: 'EVENT PARTICIPATION',
    desc: 'Massive engagement in hackathons, B-quizzes, IPL auctions, and pitch competitions.',
  },
  {
    stat: '1K+',
    label: 'ALUMNI SUPPORT',
    desc: 'Backed by a formidable network of PEC alumni acting as mentors and angel investors.',
  },
]

/** Interactive ambient geometric node canvas background */
function GeometricNodesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (!canvas || !canvas.parentElement) return
        width = canvas.width = canvas.parentElement.clientWidth
        height = canvas.height = canvas.parentElement.clientHeight
      }, 200)
    }
    window.addEventListener('resize', handleResize, { passive: true })

    const count = width < 768 ? 16 : 28
    const nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
    }))

    let mouseX = width / 2
    let mouseY = height / 2

    let mouseTick = false
    let isVisible = true
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseTick && isVisible) {
        requestAnimationFrame(() => {
          if (canvas) {
            const rect = canvas.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
          }
          mouseTick = false
        })
        mouseTick = true
      }
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          cancelAnimationFrame(animId)
          animId = requestAnimationFrame(draw)
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(canvas)

    const maxDistSq = 140 * 140
    const mouseRadiusSq = 180 * 180
    const PI2 = Math.PI * 2

    const draw = () => {
      if (!isVisible) return

      ctx.clearRect(0, 0, width, height)

      ctx.beginPath()
      ctx.strokeStyle = 'rgba(138, 197, 63, 0.14)'
      ctx.lineWidth = 1

      const len = nodes.length
      for (let i = 0; i < len; i++) {
        const nodeI = nodes[i]
        for (let j = i + 1; j < len; j++) {
          const nodeJ = nodes[j]
          const dx = nodeI.x - nodeJ.x
          const dy = nodeI.y - nodeJ.y
          if (dx * dx + dy * dy < maxDistSq) {
            ctx.moveTo(nodeI.x, nodeI.y)
            ctx.lineTo(nodeJ.x, nodeJ.y)
          }
        }
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.fillStyle = 'rgba(138, 197, 63, 0.55)'

      for (let i = 0; i < len; i++) {
        const node = nodes[i]
        const mdx = mouseX - node.x
        const mdy = mouseY - node.y
        const mdistSq = mdx * mdx + mdy * mdy
        if (mdistSq < mouseRadiusSq && mdistSq > 0) {
          const mdist = Math.sqrt(mdistSq)
          node.x += (mdx / mdist) * 0.2
          node.y += (mdy / mdist) * 0.2
        }

        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.moveTo(node.x + node.radius, node.y)
        ctx.arc(node.x, node.y, node.radius, 0, PI2)
      }
      ctx.fill()

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-70"
    />
  )
}

export default function EsummitAbout() {
  const { data } = useSummitData()
  const summitDates = data?.siteConfig?.summitDates || 'November 14–15, 2026'
  const dynamicAboutText = `PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together 3,000+ student founders, seasoned venture capitalists, and technology leaders. From competitive pitching and an overnight hackathon to curated investor roundtables — it is North India's premier launchpad where ideas meet capital and build the future. Join us ${summitDates}.`

  return (
    <section
      id="esummit-about"
      className="esummit-section relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 bg-section-1 text-white border-t border-mint/20"
      aria-labelledby="esummit-about-heading"
    >
      {/* Interactive geometric node canvas background */}
      <GeometricNodesCanvas />

      {/* Decorative ambient mint radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(138,197,63,0.06) 0%, transparent 70%)' }}
      />

      {/* Top section divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(138,197,63,0.3) 50%, transparent)' }}
      />

      {/* ── Central content ── */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <FadeIn delay={0.05}>
          <h2
            id="esummit-about-heading"
            className="font-display font-black uppercase leading-none tracking-wider text-center select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            <span className="text-gradient-mint">ABOUT</span>
          </h2>
        </FadeIn>

        {/* Core Paragraph Text */}
        <AnimatedText
          text={dynamicAboutText}
          className="font-body font-medium text-center leading-relaxed max-w-[680px]"
          style={{
            color: '#D1D5DB',
            fontSize: 'clamp(0.95rem, 3.8vw, 1.35rem)',
          }}
        />

        {/* Spotlight Pillar Cards with GlassSurface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {PILLARS.map((pillar, idx) => (
            <FadeIn key={pillar.label} delay={0.15 + idx * 0.1} className="h-full">
              <GlassSurface
                borderRadius={24}
                distortionScale={-220}
                displace={0.5}
                backgroundOpacity={0.06}
                borderWidth={1}
                borderColor="rgba(0, 242, 178, 0.2)"
                brightness={100}
                opacity={0.96}
                blur={16}
                saturation={1.1}
                redOffset={0}
                greenOffset={28}
                blueOffset={56}
                refraction
                renderer="svg"
                className="group p-6 sm:p-7 md:p-8 h-full flex flex-col justify-between transition-all duration-300 hover:border-mint/60 hover:bg-mint/[0.03]"
              >
                <div>
                  {/* Big Bold Metric Stat */}
                  <div className="font-display font-black text-3xl sm:text-4xl text-mint tracking-tight leading-none mb-2.5 select-none group-hover:scale-105 transition-transform duration-300 origin-left">
                    {pillar.stat}
                  </div>

                  {/* Metric Label */}
                  <h3 className="font-display font-bold text-xs sm:text-sm uppercase mb-3 tracking-wider text-white/95 group-hover:text-white transition-colors">
                    {pillar.label}
                  </h3>

                  {/* Description */}
                  <p className="font-body text-xs sm:text-sm text-gray-300/85 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </GlassSurface>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn delay={0.45}>
          <div className="mt-4">
            <RegisterButton />
          </div>
        </FadeIn>
      </div>

      {/* Bottom section divider line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(138,197,63,0.35) 50%, transparent)' }}
      />
    </section>
  )
}
