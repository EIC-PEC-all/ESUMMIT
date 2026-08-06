'use client'

import { useEffect, useRef } from 'react'
import { Zap } from 'lucide-react'
import CircuitBoard from '../Hero/CircuitBoard'

const SCROLL_WORDS = [
  'PEC', 'Summit', 'is', 'E-Cell', 'PEC’s', 'flagship', 'entrepreneurship', 'summit',
  'bringing', 'together', '3,000+', 'student', 'founders,', 'seasoned', 'venture', 'capitalists,',
  'and', 'industry', 'leaders', 'at', 'Punjab', 'Engineering', 'College,', 'Chandigarh.',
  'From', 'high-stakes', 'pitching', 'to', 'overnight', 'hackathons', 'and', 'exclusive',
  'VIP', 'investor', 'networking,', 'it', 'is', 'North', 'India’s', 'premier', 'launchpad',
  'where', 'ideas', 'raise', 'capital', 'and', 'compound', 'into', 'impact.'
]

export default function About() {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ScrollTriggerInstance: any = null

    const initGSAP = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      try {
        const { gsap } = await import('gsap')
        const { ScrollTrigger } = await import('gsap/ScrollTrigger')
        gsap.registerPlugin(ScrollTrigger)
        ScrollTriggerInstance = ScrollTrigger

        if (!textRef.current) return

        const words = textRef.current.querySelectorAll('.word-reveal')

        gsap.fromTo(
          words,
          { color: '#9CA3AF', opacity: 0.35 },
          {
            color: 'var(--accent-mint)',
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 75%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        )
      } catch (err) {
        console.warn('GSAP Text Reveal initialization failed:', err)
      }
    }

    initGSAP()

    return () => {
      if (ScrollTriggerInstance) {
        ScrollTriggerInstance.getAll().forEach((st: any) => st.kill())
      }
    }
  }, [])

  return (
    <section
      id="about"
      className="py-32 relative overflow-hidden bg-[#111A12] border-t border-b border-[var(--accent-mint)]/15"
      aria-labelledby="about-heading"
    >
      {/* Circuit Pattern Overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Divider */}
      <div className="absolute top-0 left-0 right-0 current-line-horizontal pointer-events-none" />

      {/* Radial Green Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[var(--accent-mint)]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={14} className="text-[var(--accent-mint)] fill-[var(--accent-mint)]" />
            <p className="font-mono-data text-xs uppercase tracking-[0.25em] text-[var(--accent-mint)] font-bold">
              Official E-Cell PEC Platform
            </p>
          </div>

          <h2
            id="about-heading"
            className="font-display leading-none mb-10"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: 'var(--text-primary)' }}
          >
            WHERE IDEAS RAISE CAPITAL &amp; <br />
            <span className="text-stroke-green">COMPOUND INTO IMPACT</span>
          </h2>

          {/* Neon Green GSAP Word Illuminate */}
          <div ref={textRef} className="font-body text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed mb-12">
            {SCROLL_WORDS.map((word, idx) => (
              <span key={idx} className="word-reveal inline-block mr-2 transition-colors">
                {word}
              </span>
            ))}
          </div>

          <blockquote
            className="p-6 rounded-2xl bg-panel border border-[var(--accent-mint)]/25 font-body text-base italic leading-relaxed text-muted"
          >
            &ldquo;Every venture in India&apos;s startup ecosystem started with a single bold idea. PEC Summit is where high-growth founders and capital align.&rdquo;
            <cite className="not-italic block mt-3 font-mono-data text-xs text-[var(--accent-mint)] font-bold">
              — E-Cell PEC Board
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
