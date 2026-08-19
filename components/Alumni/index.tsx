'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Linkedin, ExternalLink, Award, Building2, User } from 'lucide-react'
import PixelTransition from '@/components/ui/PixelTransition'

export interface AlumniMember {
  id: string
  name: string
  batch: string
  role: string
  company: string
  valuation?: string
  achievement: string
  bio: string
  imageUrl?: string | null
  linkedin?: string | null
}

const DEFAULT_ALUMNI_SLOTS: AlumniMember[] = [
  {
    id: 'slot-1',
    name: 'Alumni Founder Slot 1',
    batch: "PEC '17",
    role: 'Co-Founder & CEO',
    company: 'Unicorn Venture',
    valuation: '$1B+ Unicorn',
    achievement: 'Forbes 30 Under 30',
    bio: 'Pioneering breakthrough frontier technology and venture scale enterprise ecosystems.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'slot-2',
    name: 'Alumni Founder Slot 2',
    batch: "PEC '15",
    role: 'VP of Engineering',
    company: 'Fintech Global',
    valuation: 'Series C Scale',
    achievement: 'Global Tech Leader',
    bio: 'Architecting high-throughput financial infrastructure and distributed systems.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'slot-3',
    name: 'Alumni Founder Slot 3',
    batch: "PEC '19",
    role: 'Founder & CTO',
    company: 'Cyber Security AI',
    valuation: '$400M+ Series B',
    achievement: 'PEC E-Cell Incubated',
    bio: 'Autonomous threat detection for enterprise clouds and deep-tech protocols.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'slot-4',
    name: 'Alumni Founder Slot 4',
    batch: "PEC '14",
    role: 'General Partner',
    company: 'Venture Capital Fund',
    valuation: '$250M+ AUM',
    achievement: 'Backed 4 Unicorns',
    bio: 'Venture investor supporting early-stage deep-tech, AI and climate tech founders.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'slot-5',
    name: 'Alumni Founder Slot 5',
    batch: "PEC '18",
    role: 'Head of Product',
    company: 'Frontier AI Lab',
    valuation: 'Global AI Leader',
    achievement: 'MIT Tech Review 35u35',
    bio: 'Directing product strategy for multimodal foundation models and developer APIs.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'slot-6',
    name: 'Alumni Founder Slot 6',
    batch: "PEC '16",
    role: 'Co-Founder & CEO',
    company: 'Robotics & Autonomous',
    valuation: '$800M+ Tech Leader',
    achievement: 'TechCrunch Disrupt',
    bio: 'Autonomous hardware systems operating across high-scale industrial corridors.',
    imageUrl: null,
    linkedin: 'https://linkedin.com',
  },
]

export default function AlumniSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [alumniList, setAlumniList] = useState<AlumniMember[]>(DEFAULT_ALUMNI_SLOTS)

  useEffect(() => {
    let mounted = true
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    
    fetch(`${apiUrl}/alumni`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AlumniMember[] | null) => {
        if (mounted && data && data.length > 0) {
          setAlumniList(data)
        }
      })
      .catch(() => {
        // graceful fallback to slots
      })

    return () => {
      mounted = false
    }
  }, [])

  // Scroll progress for horizontal animation starting precisely when section pins at top
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map vertical scroll progress [0, 1] to horizontal translation percentage (starting cleanly at 0%)
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-68%'])

  return (
    <section
      ref={containerRef}
      className="relative h-[220vh] bg-[#07130F] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-mint/20"
    >
      {/* Ambient background lighting radial glows */}
      <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-mint/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#3DD9FF]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start pt-16 sm:pt-20 pb-8 px-4 sm:px-8 md:px-12">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center z-10">
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-center text-mint drop-shadow-[0_4px_25px_rgba(126,211,33,0.35)]"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 140px)' }}
          >
            ALUMNI
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-body max-w-xl leading-relaxed mt-4">
            Pioneers, founders, and venture leaders who emerged from PEC E-Cell to build tech giants and shape global ecosystems.
          </p>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full overflow-hidden z-10 py-2 mt-6 sm:mt-8 md:mt-10 mb-auto">
          <motion.div style={{ x: xTransform }} className="flex gap-4 sm:gap-5 md:gap-6 w-max pl-4 sm:pl-8 md:pl-16 pr-16">
            {alumniList.map((person) => (
              <div key={person.id} className="w-[230px] sm:w-[270px] md:w-[290px] shrink-0">
                <PixelTransition
                  gridSize={10}
                  pixelColor="var(--accent-mint)"
                  animationStepDuration={0.4}
                  aspectRatio="105%"
                  className="rounded-2xl shadow-2xl bg-[#0B1712] transition-all duration-300 w-full overflow-hidden group/card isolate border border-white/10 outline-none"
                  style={{ border: 'none', outline: 'none' }}
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-gradient-to-b from-[#101F15] via-[#0B150E] to-[#07130F] rounded-2xl flex flex-col justify-between p-5 border border-mint/20">
                      {/* Image or Holographic Avatar Placeholder */}
                      {person.imageUrl ? (
                        <img
                          src={person.imageUrl}
                          alt={person.name}
                          className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100 rounded-2xl"
                        />
                      ) : (
                        <div className="my-auto flex flex-col items-center justify-center text-center space-y-3 z-10 py-6">
                          <div className="h-20 w-20 rounded-2xl bg-mint/10 border border-mint/40 flex items-center justify-center text-mint font-display text-2xl font-bold shadow-[0_0_20px_rgba(126,211,33,0.25)]">
                            {person.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <span className="text-[10px] font-mono-data text-mint/80 uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-mint/5 border border-mint/20">
                            ALUMNI SPOTLIGHT SLOT
                          </span>
                        </div>
                      )}

                      {/* Gradient Scrim Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07130F] via-[#07130F]/40 to-transparent opacity-90 rounded-2xl pointer-events-none" />

                      {/* Bottom Front Content */}
                      <div className="relative bottom-0 inset-x-0 z-10 flex flex-col justify-end">
                        <span className="text-xs font-mono-data text-mint font-bold tracking-wide flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {person.company} &middot; {person.batch}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">{person.name}</h3>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0C1A14] p-6 flex flex-col justify-between rounded-2xl text-left select-none overflow-hidden text-white shadow-2xl border border-mint/30 outline-none" style={{ border: 'none', outline: 'none' }}>
                      <div className="space-y-3">
                        {/* Header Details */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono-data text-mint uppercase font-bold tracking-wider">
                            {person.batch}
                          </span>
                          {person.linkedin && (
                            <a
                              href={person.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-white/10 hover:bg-mint text-white hover:text-void transition-all border border-white/20 shrink-0"
                              title="LinkedIn Profile"
                            >
                              <Linkedin className="w-4 h-4" />
                            </a>
                          )}
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">{person.name}</h3>
                          <div className="text-xs font-mono-data text-mint font-bold flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {person.role} • {person.company}
                          </div>
                        </div>

                        {/* Valuation / Milestone Badge */}
                        {person.valuation && (
                          <div className="px-3 py-2 rounded-xl bg-white/5 border border-mint/20 flex items-center gap-2 text-xs font-mono-data text-gray-200">
                            <Award className="w-4 h-4 text-mint shrink-0" />
                            <span className="font-bold text-white">{person.valuation}</span>
                          </div>
                        )}

                        {/* Bio */}
                        <p className="text-xs text-gray-300 leading-relaxed font-body line-clamp-3">{person.bio}</p>
                      </div>

                      {/* Footer Badge */}
                      <div className="pt-3 border-t border-mint/30 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono-data font-bold text-mint uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" /> {person.achievement}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300" />
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
