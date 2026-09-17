'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useMotionValue } from 'framer-motion'
import BlurImage from '@/components/ui/BlurImage'

import { Linkedin, ExternalLink, Award, Building2, Sparkles, ArrowRight, Zap } from 'lucide-react'
import PixelTransition from '@/components/ui/PixelTransition'
import KineticText from '@/components/ui/KineticText'
import { useAlumni } from '@/hooks/useSummitData'
import type { CmsAlumni } from '@/lib/api-types'

interface AlumniMember {
  id: string
  name: string
  batch: string
  role: string
  company: string
  valuation?: string
  achievement: string
  bio: string
  imageUrl: string
  linkedin: string
}

const ALUMNI_DATA: AlumniMember[] = [
  {
    id: 'alumni-0a',
    name: 'Kalpana Chawla',
    batch: "PEC '82",
    role: 'Astronaut & Aerospace Pioneer',
    company: 'NASA',
    valuation: 'Congressional Space Medal of Honor',
    achievement: 'First Indian-Born Woman in Space',
    bio: 'Pioneering astronaut and aeronautical engineer who inspired generations of innovators and space explorers worldwide.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412303/esummit/gallery/pec_aerial_night.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-0b',
    name: 'Satish Dhawan',
    batch: "PEC '38",
    role: 'Former Chairman',
    company: 'ISRO',
    valuation: 'Father of Indian Fluid Dynamics',
    achievement: 'Architect of India’s Space Program',
    bio: 'Legendary aerospace scientist who spearheaded India’s indigenous space launch vehicle and satellite programs.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412307/esummit/gallery/pec_auditorium_facade.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-1',
    name: 'Gajendra Jangid',
    batch: "PEC '05",
    role: 'Co-Founder & CMO',
    company: 'CARS24',
    valuation: '$3.3B Unicorn',
    achievement: 'Forbes Global Entrepreneur',
    bio: 'Pioneered auto-tech logistics in India, scaling CARS24 from a seed idea to a multi-billion dollar international marketplace.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412326/esummit/gallery/pec_pitch.jpg',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-2',
    name: 'Padmasree Warrior',
    batch: "PEC '82",
    role: 'Founder & CEO, Fable',
    company: 'Ex-CTO Cisco & Motorola',
    valuation: 'Fortune Most Powerful Women',
    achievement: 'Microsoft & Spotify Board Member',
    bio: 'Global technology icon. Served as Chief Technology Officer at Cisco and Motorola, currently leading digital reading platform Fable.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412321/esummit/gallery/pec_keynote_speaker.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-3',
    name: 'Steve Sanghi',
    batch: "PEC '75",
    role: 'Executive Chairman',
    company: 'Microchip Technology',
    valuation: '$40B+ Nasdaq Giant',
    achievement: 'Semiconductor Executive of the Decade',
    bio: 'Transformed Microchip Technology from near-bankruptcy into a global semiconductor leader with 30+ consecutive years of profitability.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412327/esummit/gallery/pec_pitch_table.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-4',
    name: 'Kunwar Sachdev',
    batch: "PEC '84",
    role: 'Founder & Innovator',
    company: 'Su-Kam Power Systems',
    valuation: 'Solar Man of India',
    achievement: 'Ernst & Young Entrepreneur of the Year',
    bio: 'Revolutionized power backup and solar renewable systems across South Asia, Africa, and the Middle East.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412302/esummit/gallery/pec_admin_building.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-5',
    name: 'Dr. Ritesh Malik',
    batch: 'Mentor & Partner',
    role: 'Founder',
    company: 'Innov8 Coworking',
    valuation: 'Angel Investor in 80+ Startups',
    achievement: 'Forbes 30 Under 30 Asia',
    bio: 'Doctor turned serial entrepreneur and startup ecosystem builder. Scaled Innov8 to exit and actively mentors student founders across India.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412331/esummit/gallery/pec_senate_roundtable.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-6',
    name: 'Jaspal Bhatti',
    batch: "PEC '78",
    role: 'Satirist & Media Pioneer',
    company: 'Flop Show & Media Studio',
    valuation: 'Padma Bhushan Awardee',
    achievement: 'PEC Electrical Engineering Alum',
    bio: 'Legendary satirist, filmmaker, and cultural icon who pioneered independent broadcast television and creative media production in India.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412309/esummit/gallery/pec_centenary_hall.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-7',
    name: 'Prof. Vijay K. Dhir',
    batch: "PEC '65",
    role: 'Former Dean of Engineering',
    company: 'UCLA Samueli School',
    valuation: 'National Academy of Engineering',
    achievement: 'Distinguished Academic Leader',
    bio: 'Renowned researcher in thermal sciences and space shuttle heat-shield physics. Led UCLA Engineering to top-tier global research ranking.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412317/esummit/gallery/pec_innovation_stage.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
  {
    id: 'alumni-8',
    name: 'D.C. Anand',
    batch: "PEC '52",
    role: 'Founder & Chairman',
    company: 'ANAND Group India',
    valuation: 'Automotive Industry Titan',
    achievement: 'Pioneer of Auto Tier-1 in India',
    bio: 'Pioneered precision automotive component manufacturing in India, building a conglomerate of 19 companies partnering with global OEMs.',
    imageUrl: 'https://res.cloudinary.com/dxtvq5s2x/image/upload/v1787412333/esummit/gallery/pec_startup_fair.png',
    linkedin: 'https://linkedin.com/company/ecell-pec',
  },
]

export default function AlumniSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xMotion = useMotionValue(0)

  const { alumni: cmsAlumni } = useAlumni()

  // Merge: CMS entries (real data) override static entries by index for real names/companies;
  // static fallback entries fill the rest so the carousel always has rich imagery.
  const displayData: AlumniMember[] =
    Array.isArray(cmsAlumni) && cmsAlumni.length > 0
      ? ALUMNI_DATA.map((staticEntry, i) => {
        const cmsEntry: CmsAlumni | undefined = cmsAlumni[i]
        if (!cmsEntry) return staticEntry
        return {
          ...staticEntry,
          name: cmsEntry.name,
          batch: cmsEntry.batch,
          role: cmsEntry.role,
          company: cmsEntry.company,
          valuation: cmsEntry.valuation ?? staticEntry.valuation,
          achievement: cmsEntry.achievement,
          bio: cmsEntry.bio || staticEntry.bio,
          imageUrl: cmsEntry.imageUrl ?? staticEntry.imageUrl,
          linkedin: cmsEntry.linkedin ?? staticEntry.linkedin,
        }
      })
    : ALUMNI_DATA

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
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-20 pb-12 px-4 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center z-10">
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center select-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            <span className="text-gradient-mint">ALUMNI</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-body max-w-xl leading-relaxed mt-2 sm:mt-4">
            Pioneers, founders, and venture leaders who emerged from PEC E-Cell to build tech giants and shape global ecosystems.
          </p>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full z-10 py-4 mt-6 sm:mt-8 md:mt-12 shrink-0">
          <motion.div 
            ref={trackRef} 
            style={{ x: xMotion }} 
            className="flex gap-3 sm:gap-5 md:gap-6 w-max pl-3 md:pl-16 pr-8 md:pr-16"
          >
            {displayData.map((person, idx) => (
              <div 
                key={person.id} 
                className="w-[180px] sm:w-[260px] md:w-[290px] shrink-0 snap-center rounded-2xl focus-within:ring-2 focus-within:ring-mint outline-none"
                tabIndex={0}
              >
                <PixelTransition
                  gridSize={6}
                  pixelColor="var(--accent-mint)"
                  animationStepDuration={0.4}
                  aspectRatio="105%"
                  className="rounded-2xl shadow-2xl bg-[#0B1712] transition-transform duration-150 active:scale-[0.98] w-full overflow-hidden group/card isolate border-0 border-transparent outline-none cursor-pointer"
                  style={{ border: 'none', outline: 'none' }}
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-[#0B1712] rounded-2xl">
                      {/* Image with progressive blur loading */}
                      <BlurImage
                        src={person.imageUrl}
                        alt={person.name}
                        fill
                        sizes="(max-width: 768px) 270px, 290px"
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100 rounded-2xl"
                      />


                       {/* Gradient Scrim Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07130F] via-[#07130F]/40 to-transparent opacity-90 rounded-2xl" />

                      {/* Bottom Front Content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end rounded-2xl">
                        <span className="text-xs font-mono-data text-mint font-bold tracking-wide flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {person.company} &middot; {person.batch}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display tracking-tight">
                          <span className="text-gradient-white">{person.name}</span>
                        </h3>
                        
                        {/* Mobile Tap Hint */}
                        <div className="mt-2 sm:hidden flex items-center gap-1.5 text-white/60 text-[10px] uppercase font-mono-data font-bold tracking-wider">
                          <Zap size={10} className="text-mint" /> Tap to read
                        </div>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0A110D] p-6 flex flex-col justify-between rounded-2xl text-left select-none text-white shadow-2xl relative border border-white/5 outline-none" style={{ border: '1px solid rgba(255,255,255,0.05)', outline: 'none' }}>
                      
                      {/* Top Section */}
                      <div className="flex flex-col gap-4 relative z-10">
                        {/* Name & LinkedIn Row */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-2xl font-bold font-display tracking-tight text-white leading-tight">
                            {person.name}
                          </h3>
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#B5F23D] text-white/70 hover:text-black transition-all border border-white/10 shrink-0 cursor-pointer"
                            title={`${person.name}'s LinkedIn Profile`}
                            aria-label={`${person.name}'s LinkedIn Profile`}
                          >
                            <Linkedin size={15} strokeWidth={2} />
                          </a>
                        </div>

                        {/* Role & Company */}
                        <div className="flex items-start gap-2 text-neutral-400">
                          <Building2 size={14} strokeWidth={2} className="text-[#B5F23D] shrink-0 mt-0.5" />
                          <span className="text-[10px] font-mono-data uppercase tracking-wider leading-relaxed">
                            {person.role} <span className="mx-1 opacity-50">•</span> <span className="text-white/90 font-bold">{person.company}</span>
                          </span>
                        </div>

                        {/* Milestone Badge */}
                        {person.valuation && (
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                            <Award size={16} strokeWidth={2} className="text-[#B5F23D] shrink-0 mt-0.5" />
                            <span className="text-[11px] font-mono-data font-bold tracking-wider text-white uppercase leading-snug">
                              {person.valuation}
                            </span>
                          </div>
                        )}

                        {/* Bio */}
                        <p className="text-xs text-neutral-400 leading-relaxed font-body line-clamp-3">
                          {person.bio}
                        </p>
                      </div>

                      {/* Footer Badge (Pushed to bottom properly) */}
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
                        <span className="text-[10px] font-mono-data font-bold text-[#B5F23D] uppercase tracking-[0.15em] flex items-center gap-2 truncate pr-2">
                          <Sparkles size={14} strokeWidth={2} className="shrink-0" /> 
                          <span className="truncate">{person.achievement}</span>
                        </span>
                        <ExternalLink size={14} strokeWidth={2} className="shrink-0 text-neutral-500" />
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
