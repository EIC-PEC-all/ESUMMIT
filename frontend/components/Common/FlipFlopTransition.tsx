'use client'
// components/Common/FlipFlopTransition.tsx
// 3D Liquid Lens FlexCarousel section driven by window scroll across all 12 cards

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FlexCarouselItem } from '@/components/ui/flexCarouselConstants'

const FlexCarousel = dynamic(() => import('@/components/ui/FlexCarousel'), { ssr: false })

const CAROUSEL_ITEMS: FlexCarouselItem[] = [
  {
    src: '/gallery/pec_admin_building.jpg',
    alt: 'PEC Historic Administrative Building',
    title: 'Heritage Campus',
    subtitle: 'Punjab Engineering College',
  },
  {
    src: '/gallery/pec_centenary_hall.jpg',
    alt: 'Centenary Hall Convocation & Keynotes',
    title: 'Centenary Hall',
    subtitle: 'Keynote Auditorium',
  },
  {
    src: '/gallery/pec_mig21.jpg',
    alt: 'IAF MiG-21 Supersonic Memorial',
    title: 'Aero Legacy',
    subtitle: 'MiG-21 Monument',
  },
  {
    src: '/gallery/pec_aerial_night.jpg',
    alt: 'PEC Campus Night Aerial View',
    title: 'Campus Aerial',
    subtitle: 'Sector 12, Chandigarh',
  },
  {
    src: '/gallery/pec_auditorium_facade.jpg',
    alt: 'Auditorium Facade Grand Entrance',
    title: 'Summit Stage',
    subtitle: 'Main Auditorium',
  },
  {
    src: '/gallery/pec_iaf_helicopter.jpg',
    alt: 'IAF Mi-8 Helicopter Display',
    title: 'Engineering Roots',
    subtitle: 'IAF Memorial',
  },
  {
    src: '/gallery/pec_pitch.jpg',
    alt: 'Live Venture Pitching to Investors',
    title: 'Pitch Arena',
    subtitle: 'Founders & Angels',
  },
  {
    src: '/gallery/pec_startup_fair.png',
    alt: 'Startup Expo Exhibition Booths',
    title: 'Startup Expo',
    subtitle: '50+ High-Growth Ventures',
  },
  {
    src: '/gallery/pec_senate_roundtable.png',
    alt: 'Senate Hall Closed-Door Roundtables',
    title: 'Senate Conclave',
    subtitle: 'Ecosystem Leaders',
  },
  {
    src: '/gallery/pec_keynote_speaker.png',
    alt: 'Distinguished Keynote Address',
    title: 'Keynote Arena',
    subtitle: 'Industry Visionaries',
  },
  {
    src: '/gallery/pec_innovation_stage.png',
    alt: 'Innovation Stage 24H Hackathon',
    title: 'Hackathon Sprint',
    subtitle: 'Builders & Coders',
  },
  {
    src: '/gallery/pec_team.png',
    alt: 'EIC PEC Organizing Committee',
    title: 'EIC Leadership',
    subtitle: 'Organizing Committee',
  },
]

export default function FlipFlopTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    let rafId: number
    const updateScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const totalScrollable = rect.height - window.innerHeight
        if (totalScrollable <= 0) return
        const raw = -rect.top / totalScrollable
        const progress = Math.min(Math.max(raw, 0), 1)
        setScrollProgress(progress)
      })
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll, { passive: true })
    updateScroll()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [])

  return (
    <section
      id="flip-flop-transition"
      ref={sectionRef}
      className="relative z-20 bg-[#071511] select-none border-y border-mint/20 h-[280vh] sm:h-[320vh] md:h-[360vh]"
      aria-label="PEC E-Summit visual gallery"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* Subtle ambient lighting */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,242,178,0.06)_0%,transparent_75%)]" />

        {/* ── FlexCarousel 3D WebGL Liquid Lens Carousel ── */}
        <div className="relative w-full h-[460px] sm:h-[540px] md:h-[600px] max-h-[85vh]">
          <FlexCarousel
            items={CAROUSEL_ITEMS}
            preset="liquid"
            intro="rise"
            scrollProgress={scrollProgress}
            cardHeight={0.52}
            gap={14}
            radius={16}
            squeeze={0.22}
            focusOnClick={true}
            captions={true}
            autoplay={false}
            captureWheel={false}
            infinite={false}
          />
        </div>

        {/* Edge gradient fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-[#071511] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-[#071511] to-transparent z-10" />
      </div>
    </section>
  )
}
