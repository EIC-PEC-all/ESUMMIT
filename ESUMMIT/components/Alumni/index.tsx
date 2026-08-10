'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Linkedin, ExternalLink, Award, Building2, Sparkles, ArrowRight, Zap } from 'lucide-react'
import PixelTransition from '@/components/ui/PixelTransition'
import KineticText from '@/components/ui/KineticText'

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
    id: 'alumni-1',
    name: 'Ananya Sharma',
    batch: "PEC '17",
    role: 'Co-founder & CEO',
    company: 'Lumina AI',
    valuation: '$1.2B Unicorn',
    achievement: 'Forbes 30 Under 30 Tech',
    bio: 'Pioneered next-gen neural video models. Raised $120M from Sequoia & Andreessen Horowitz.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-2',
    name: 'Rohan Verma',
    batch: "PEC '15",
    role: 'VP of Engineering',
    company: 'Stripe',
    valuation: 'Global Fintech Leader',
    achievement: 'Ex-Google Brain Lead',
    bio: 'Architected Stripe scale infrastructure processing over $500B annually across 40+ countries.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-3',
    name: 'Divya Kapoor',
    batch: "PEC '19",
    role: 'Founder & CTO',
    company: 'CyberShield AI',
    valuation: '$450M Series B',
    achievement: 'PEC E-Cell Incubated',
    bio: 'Built real-time autonomous threat detection for Fortune 500 banks & enterprise clouds.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-4',
    name: 'Siddharth Mehta',
    batch: "PEC '14",
    role: 'General Partner',
    company: 'NextGen Ventures',
    valuation: '$300M AUM Fund',
    achievement: 'Backed 4 Unicorns',
    bio: 'Early investor in AI, Web3 & deep-tech startups. Mentors PEC E-Cell startup cohorts.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-5',
    name: 'Kavya Patel',
    batch: "PEC '18",
    role: 'Head of Product',
    company: 'OpenAI Multimodal',
    valuation: 'Frontier AI Leader',
    achievement: 'MIT Tech Review 35u35',
    bio: 'Directing product strategy for multimodal vision-language models & developer API suites.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-6',
    name: 'Aarav Singhania',
    batch: "PEC '16",
    role: 'Co-founder & CEO',
    company: 'HyperDrive Autonomous',
    valuation: '$850M Tech Giant',
    achievement: 'TechCrunch Disrupt Champion',
    bio: 'Pioneered electric autonomous freight logistics operating across major industrial corridors.',
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
]

export default function AlumniSection() {
  const containerRef = useRef<HTMLDivElement>(null)

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
            {ALUMNI_DATA.map((person, idx) => (
              <div key={person.id} className="w-[230px] sm:w-[270px] md:w-[290px] shrink-0">
                <PixelTransition
                  gridSize={10}
                  pixelColor="var(--accent-mint)"
                  animationStepDuration={0.4}
                  aspectRatio="105%"
                  className="rounded-2xl shadow-2xl bg-[#0B1712] transition-all duration-300 w-full overflow-hidden group/card isolate border-0 border-transparent outline-none"
                  style={{ border: 'none', outline: 'none' }}
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-[#0B1712] rounded-2xl">
                      {/* Image */}
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100 rounded-2xl"
                      />

                       {/* Gradient Scrim Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07130F] via-[#07130F]/40 to-transparent opacity-90 rounded-2xl" />

                      {/* Bottom Front Content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end rounded-2xl">
                        <span className="text-xs font-mono-data text-mint font-bold tracking-wide flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {person.company} &middot; {person.batch}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">{person.name}</h3>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0C1A14] p-6 flex flex-col justify-between rounded-2xl text-left select-none overflow-hidden text-white shadow-2xl border-0 border-transparent outline-none" style={{ border: 'none', outline: 'none' }}>
                      <div className="space-y-3">
                        {/* Header Details */}
                        <div className="flex items-center justify-end">
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-mint text-white hover:text-void transition-all border border-white/20 shrink-0"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
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
