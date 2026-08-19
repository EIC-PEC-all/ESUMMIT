'use client'

import { useEffect, useRef } from 'react'
import { Zap } from 'lucide-react'
import CircuitBoard from '../Hero/CircuitBoard'

const SCROLL_WORDS = [
  'PEC',
  'Summit',
  'is',
  'E-Cell',
  'PEC’s',
  'flagship',
  'entrepreneurship',
  'summit',
  'bringing',
  'together',
  '3,000+',
  'student',
  'founders,',
  'seasoned',
  'venture',
  'capitalists,',
  'and',
  'industry',
  'leaders',
  'at',
  'Punjab',
  'Engineering',
  'College,',
  'Chandigarh.',
  'From',
  'high-stakes',
  'pitching',
  'to',
  'overnight',
  'hackathons',
  'and',
  'exclusive',
  'VIP',
  'investor',
  'networking,',
  'it',
  'is',
  'North',
  'India’s',
  'premier',
  'launchpad',
  'where',
  'ideas',
  'raise',
  'capital',
  'and',
  'compound',
  'into',
  'impact.',
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
      className="border-[var(--accent-mint)]/15 relative overflow-hidden border-b border-t bg-[#111A12] py-32"
      aria-labelledby="about-heading"
    >
      {/* Circuit Pattern Overlay */}
      <CircuitBoard prefersReduced={false} />

      {/* Top Divider */}
      <div className="current-line-horizontal pointer-events-none absolute left-0 right-0 top-0" />

      {/* Radial Green Glow */}
      <div className="bg-[var(--accent-mint)]/10 pointer-events-none absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-[140px]" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          <h2
            id="about-heading"
            className="mb-10 font-display leading-none"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: 'var(--text-primary)' }}
          >
            WHERE IDEAS RAISE CAPITAL &amp; <br />
            <span className="text-stroke-green">COMPOUND INTO IMPACT</span>
          </h2>

          {/* Neon Green GSAP Word Illuminate */}
          <div
            ref={textRef}
            className="mb-12 font-body text-xl font-medium leading-relaxed sm:text-2xl lg:text-3xl"
          >
            {SCROLL_WORDS.map((word, idx) => (
              <span key={idx} className="word-reveal mr-2 inline-block transition-colors">
                {word}
              </span>
            ))}
          </div>

          <blockquote className="border-[var(--accent-mint)]/25 rounded-2xl border bg-panel p-6 font-body text-base italic leading-relaxed text-muted">
            &ldquo;Every venture in India&apos;s startup ecosystem started with a single bold idea.
            E-Summit is where high-growth founders and capital align.&rdquo;
            <cite className="mt-3 block font-mono-data text-xs font-bold not-italic text-[var(--accent-mint)]">
              — E-Cell PEC Board
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
