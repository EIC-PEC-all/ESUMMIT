'use client'
// components/EsummitAbout/index.tsx
// High-end About section with interactive geometric node canvas, clean typography,
// and cursor-tracking spotlight pillar cards.

import { useRef, useEffect } from 'react'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedText from '@/components/ui/AnimatedText'
import RegisterButton from '@/components/ui/RegisterButton'
import { Rocket, ShieldCheck, Users } from 'lucide-react'

const ABOUT_TEXT =
  'PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together 3,000+ student founders, seasoned venture capitalists, and industry leaders. From high-stakes pitching to overnight hackathons and exclusive VIP investor networking — it is North India\'s premier launchpad where ideas raise capital and compound into impact. Join us March 15–16, 2026.'

const PILLARS = [
  {
    icon: Rocket,
    title: '₹15L+ Venture Pool',
    desc: 'Direct equity, non-dilutive grants, and cloud credits for top student pitches.',
  },
  {
    icon: Users,
    title: '3,000+ Founders & VCs',
    desc: 'High-density networking across seed-stage founders, angels, and tier-1 VC funds.',
  },
  {
    icon: ShieldCheck,
    title: '7th Legacy Edition',
    desc: 'A decade-long track record of incubating high-impact tech ventures at PEC.',
  },
]

/** Interactive ambient geometric node canvas background */
function GeometricNodesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth)
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600)

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return
      width = canvas.width = canvas.parentElement.clientWidth
      height = canvas.height = canvas.parentElement.clientHeight
    }
    window.addEventListener('resize', handleResize)

    // Node particle array
    const nodes = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
    }))

    let mouseX = width / 2
    let mouseY = height / 2

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(126, 211, 33, ${0.15 * (1 - dist / 140)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Draw nodes & move
      nodes.forEach((node) => {
        // Subtle mouse pull
        const mdx = mouseX - node.x
        const mdy = mouseY - node.y
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 180) {
          node.x += (mdx / mdist) * 0.2
          node.y += (mdy / mdist) * 0.2
        }

        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(126, 211, 33, 0.5)'
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
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
      className="esummit-section relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 overflow-hidden rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 bg-[#07150E] text-white border-t border-mint/20"
      aria-labelledby="esummit-about-heading"
    >
      {/* Interactive geometric node canvas background */}
      <GeometricNodesCanvas />

      {/* Decorative ambient green radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(126,211,33,0.07) 0%, transparent 70%)' }}
      />

      {/* Top section divider line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.4) 50%, transparent)' }}
      />

      {/* ── Central content ── */}
      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-16 max-w-5xl mx-auto px-5 sm:px-8">
        {/* Section Heading */}
        <FadeIn delay={0.05}>
          <h2
            id="esummit-about-heading"
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-lg"
            style={{ fontSize: 'clamp(2.5rem, 10vw, 160px)' }}
          >
            ABOUT
          </h2>
        </FadeIn>

        {/* Core Paragraph Text */}
        <AnimatedText
          text={ABOUT_TEXT}
          className="font-body font-medium text-center leading-relaxed max-w-[680px]"
          style={{
            color: 'var(--text-secondary)',
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

                  <h3 className="font-display font-bold text-lg text-primary uppercase mb-2">
                    {pillar.title}
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
