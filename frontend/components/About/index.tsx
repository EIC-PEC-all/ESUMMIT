'use client'

import React from 'react'
import PageBanner from '@/components/Common/PageBanner'
import AboutHero from './AboutHero'
import AboutHeritage from './AboutHeritage'

export default function About() {
  return (
    <>
      <PageBanner
        title="ABOUT"
        subtitle="MARCH 19–21, 2026 · 100+ YEARS OF PEC LEGACY · FOSTERING TOMORROW'S FOUNDERS"
        bgImage="/pec-campus-vintage.jpg"
      />

      <section
        id="about-content"
        className="relative bg-section-1 text-white pt-10 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10"
        aria-labelledby="about-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10 space-y-16 sm:space-y-24">
          <AboutHero />
          <AboutHeritage />
        </div>
      </section>
    </>
  )
}
