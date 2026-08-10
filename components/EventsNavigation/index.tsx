'use client'

import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import { NavigationCard } from './NavigationCard'

export default function EventsNavigation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      id="events-navigation"
      ref={containerRef}
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#070B08', fontFamily: "'Kanit', sans-serif" }}
      aria-labelledby="events-navigation-heading"
    >
      {/* Green top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(126,211,33,0.5) 50%, transparent)' }}
      />

      <h2
        id="events-navigation-heading"
        className="hero-heading-green font-black uppercase leading-none tracking-tight text-center
          mb-16 sm:mb-20 md:mb-24"
        style={{
          fontFamily: "'Kanit', sans-serif",
          fontSize: 'clamp(3rem, 12vw, 160px)',
        }}
      >
        Events Navigation
      </h2>

      <div className="relative">
        <NavigationCard
          day="day1"
          index={0}
          scrollYProgress={scrollYProgress}
        />
        <NavigationCard
          day="day2"
          index={1}
          scrollYProgress={scrollYProgress}
        />
      </div>
    </section>
  )
}