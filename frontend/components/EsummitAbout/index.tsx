'use client'
// components/EsummitAbout/index.tsx
// High-end About section with interactive geometric node canvas, clean typography,
// and cursor-tracking spotlight pillar cards.

import { useRef, useEffect } from 'react'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedText from '@/components/ui/AnimatedText'
import RegisterButton from '@/components/ui/RegisterButton'
import { Rocket, ShieldCheck, Users } from 'lucide-react'
import { useSummitData } from '@/hooks/useSummitData'

const ABOUT_TEXT =
  'PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together student founders, seasoned venture capitalists, and technology leaders. From competitive pitching and a 24-hour hackathon to curated investor roundtables — it is North India\'s premier launchpad where ideas meet capital and build the future. Join us September 26–27, 2026.'

const PILLARS = [
  {
    icon: Rocket,
    title: '₹15L+ Prize & Grant Pool',
    desc: 'Non-dilutive cash grants, cloud infrastructure credits, and incubation support for top student pitches.',
  },
  {
    icon: Users,
    title: '3,000+ Attendees & VCs',
    desc: 'Direct networking across student builders, active angel syndicates, and leading venture funds.',
  },
  {
    icon: ShieldCheck,
    title: '7th Edition of PEC E-Summit',
    desc: 'A decade-long legacy of nurturing high-growth technology and engineering ventures at PEC.',
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

    let isVisible = true
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
    const PI2 = Math.PI * 2 // Memoize Math.PI * 2

    const draw = () => {
      if (!isVisible) return

      ctx.clearRect(0, 0, width, height)

      // Batch all connection lines into 1 single stroke call
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(126, 211, 33, 0.12)'
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

      // Batch all node circles into 1 single fill call
      ctx.beginPath()
      ctx.fillStyle = 'rgba(126, 211, 33, 0.5)'

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
  const summitDates = data?.siteConfig?.summitDates || 'September 26–27, 2026'
  const dynamicAboutText = `PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together 3,000+ student founders, seasoned venture capitalists, and technology leaders. From competitive pitching and an overnight hackathon to curated investor roundtables — it is North India's premier launchpad where ideas meet capital and build the future. Join us ${summitDates}.`

  const handleSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <section
      id="esummit-about"
      className="esummit-section relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 bg-section-1 text-white border-t border-mint/20"
      aria-labelledby="esummit-about-heading"
    >
      {/* Interactive geometric node canvas background */}
      <GeometricNodesCanvas />

      {/* Decorative ambient green radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(181,242,61,0.05) 0%, transparent 70%)' }}
      />

      {/* Top section divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(181,242,61,0.3) 50%, transparent)' }}
      />

      {/* ── Central content ── */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <FadeIn delay={0.05}>
          <h2
            id="esummit-about-heading"
            className="font-display font-black uppercase leading-none tracking-tight text-center select-none"
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

        {/* Spotlight Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <FadeIn key={pillar.title} delay={0.15 + idx * 0.1}>
                <div
                  onMouseMove={handleSpotlight}
                  className="relative group rounded-2xl p-6 sm:p-8 bg-panel transition-all duration-300 overflow-hidden shadow-xl"
                >
                  {/* Mouse spotlight overlay */}
                  <div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent-green-glow), transparent 40%)',
                    }}
                  />

                  <div className="w-12 h-12 rounded-xl bg-mint/10 border border-mint/30 flex items-center justify-center mb-5 text-mint group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} />
                  </div>

                  <h3 className="font-display font-bold text-lg uppercase mb-2">
                    <span className="text-gradient-white">{pillar.title}</span>
                  </h3>

                  <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </FadeIn>
            )
          })}
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
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.4) 50%, transparent)' }}
      />
    </section>
  )
}
