'use client'
// components/About/index.tsx
// Fest description + animated stat counters

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useCountUp } from '@/hooks/useCountUp'
import { STATS } from '@/lib/data'

function StatCard({ stat, inView }: { stat: typeof STATS[0]; inView: boolean }) {
  const value = useCountUp(stat.value, 2200, inView)
  return (
    <div
      className="flex flex-col p-6 rounded-lg"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid rgba(138,144,166,0.08)',
      }}
      id={`stat-${stat.id}`}
    >
      <span
        className="font-mono-data font-bold mb-1 leading-none"
        style={{
          fontSize: 'clamp(40px, 5vw, 64px)',
          color: 'var(--accent-ignite)',
        }}
        aria-label={`${stat.prefix ?? ''}${stat.value}${stat.suffix} ${stat.label}`}
      >
        {stat.prefix}{value}{stat.suffix}
      </span>
      <span
        className="font-body text-sm tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        {stat.label}
      </span>
    </div>
  )
}

const ABOUT_TEXT = `PEC Summit is E-Cell PEC's annual two-day entrepreneurship summit, bringing together student founders, seasoned investors, and industry leaders on the campus of Punjab Engineering College, Chandigarh. From high-stakes pitch competitions to hands-on hackathons and curated networking, it's the tricity's most concentrated dose of startup energy in one place.`

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 lg:py-32"
      aria-labelledby="about-heading"
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Description */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="font-mono-data text-xs uppercase tracking-[0.2em] mb-4"
              style={{ color: 'var(--accent-signal)' }}
            >
              About the Summit
            </p>
            <h2
              id="about-heading"
              className="font-display mb-6 leading-none"
              style={{ fontSize: 'clamp(40px, 5vw, 72px)', color: 'var(--text-primary)' }}
            >
              IGNITE<br />YOUR IDEA
            </h2>
            <p
              className="font-body text-base leading-relaxed max-w-lg"
              style={{ color: 'var(--text-muted)' }}
            >
              {ABOUT_TEXT}
            </p>

            <div className="mt-8 flex items-start gap-3">
              <div
                className="w-1 self-stretch rounded-full"
                style={{ background: 'var(--accent-ignite)' }}
                aria-hidden="true"
              />
              <blockquote
                className="font-body text-sm italic leading-relaxed"
                style={{ color: 'var(--text-primary)', opacity: 0.7 }}
              >
                &ldquo;Every unicorn in India&apos;s startup ecosystem started with a conversation. PEC Summit is where those conversations happen.&rdquo;
                <cite className="not-italic block mt-2 font-mono-data text-xs" style={{ color: 'var(--text-muted)' }}>
                  — E-Cell PEC
                </cite>
              </blockquote>
            </div>
          </motion.div>

          {/* Right: Stats grid */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {STATS.map((stat) => (
              <StatCard key={stat.id} stat={stat} inView={inView} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
