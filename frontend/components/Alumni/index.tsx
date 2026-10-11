'use client'

import React, { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useMotionValue } from 'framer-motion'
import { useAlumni } from '@/hooks/useSummitData'
import AlumniCard from './AlumniCard'
import AlumniDetailModal, { type AlumniMember } from './AlumniDetailModal'
import { FALLBACK_ALUMNI_LIST } from './alumniData'

export default function AlumniSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xMotion = useMotionValue(0)
  const [selectedPerson, setSelectedPerson] = useState<AlumniMember | null>(null)

  const { alumni: cmsAlumni } = useAlumni()

  // Clean CMS records by removing any test QR duplicates, then map with static fallbacks
  const validCmsList = Array.isArray(cmsAlumni)
    ? cmsAlumni.filter(
        (a) =>
          !a.name?.toLowerCase().includes('jangide') &&
          !a.batch?.includes('15') &&
          !a.imageUrl?.includes('alumni_gajendra_jangide')
      )
    : []

  const displayData: AlumniMember[] =
    validCmsList.length > 0
      ? validCmsList.map((cmsEntry, i) => {
          const fallback =
            FALLBACK_ALUMNI_LIST.find(
              (f) => f.name.toLowerCase() === cmsEntry.name.toLowerCase()
            ) || FALLBACK_ALUMNI_LIST[i]

          return {
            id: cmsEntry.id || fallback?.id || `alumni-${i + 1}`,
            name: cmsEntry.name,
            batch: cmsEntry.batch || fallback?.batch || '',
            role: cmsEntry.role || fallback?.role || '',
            company: cmsEntry.company || fallback?.company || '',
            valuation: cmsEntry.valuation ?? fallback?.valuation,
            achievement: cmsEntry.achievement || fallback?.achievement || '',
            bio: cmsEntry.bio || fallback?.bio || '',
            imageUrl: cmsEntry.imageUrl || fallback?.imageUrl || '',
            linkedin: cmsEntry.linkedin || fallback?.linkedin || 'https://linkedin.com/company/ecell-pec',
          }
        })
      : FALLBACK_ALUMNI_LIST

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const maxScrollRef = useRef(0)

  useEffect(() => {
    const updateMaxScroll = () => {
      if (trackRef.current) {
        maxScrollRef.current = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
      }
    }

    updateMaxScroll()
    window.addEventListener('resize', updateMaxScroll, { passive: true })

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      xMotion.set(-progress * maxScrollRef.current)
    })

    return () => {
      window.removeEventListener('resize', updateMaxScroll)
      unsubscribe()
    }
  }, [scrollYProgress, xMotion])

  return (
    <section
      id="alumni"
      ref={containerRef}
      className="relative h-[380vh] bg-section-2 text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-mint/20"
    >
      {/* Cyber Geometric Capsule Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-25"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%2300F2B2' fill-opacity='0.08'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Sticky Fullscreen Container with safe top clearance from navbar */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-16 sm:pt-18 md:pt-20 pb-6 px-4 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="max-w-2xl mx-auto w-full flex flex-col items-center text-center z-10 shrink-0">
          <h2
            className="font-display font-black uppercase leading-tight tracking-wider text-center select-none"
            style={{ fontSize: 'clamp(1.75rem, 3.8vw, 2.75rem)' }}
          >
            <span className="text-gradient-mint">ALUMNI</span>
          </h2>

          <p className="text-[11px] sm:text-xs text-gray-300 font-body max-w-lg leading-relaxed mt-1 sm:mt-1.5">
            Pioneers, founders, and venture leaders who emerged from PEC E-Cell to build tech giants and shape global ecosystems.
          </p>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full z-10 py-2 mt-3 sm:mt-4 md:mt-5 shrink-0">
          <motion.div 
            ref={trackRef} 
            style={{ x: xMotion }} 
            className="flex gap-4 sm:gap-6 md:gap-8 w-max pl-4 md:pl-16 pr-8 md:pr-16 items-start"
          >
            {displayData.map((person) => (
              <AlumniCard
                key={person.id}
                person={person}
                onSelect={setSelectedPerson}
              />
            ))}
          </motion.div>
        </div>

        {/* Full Details Modal on Click */}
        <AlumniDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
        />
      </div>
    </section>
  )
}
