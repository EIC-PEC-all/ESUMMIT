'use client'

import React, { useRef, useEffect } from 'react'
import { motion, useScroll, useMotionValue } from 'framer-motion'
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
  {
    id: 'alumni-7',
    name: 'Ishaan Chaudhary',
    batch: "PEC '20",
    role: 'Research Scientist',
    company: 'DeepMind',
    valuation: 'Frontier AI Research',
    achievement: 'NeurIPS Best Paper Award',
    bio: 'Published breakthrough work on reinforcement learning from human feedback. Core contributor to Gemini research team.',
    imageUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-8',
    name: 'Priya Nair',
    batch: "PEC '17",
    role: 'Co-founder & CRO',
    company: 'ClearSkye Health',
    valuation: '$220M Series C',
    achievement: 'WHO Young Leader 2024',
    bio: 'Democratizing affordable diagnostics for Tier-2 & Tier-3 India using AI-powered mobile health kits.',
    imageUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-9',
    name: 'Aditya Bhatt',
    batch: "PEC '13",
    role: 'Director of Engineering',
    company: 'SpaceX Starlink',
    valuation: 'Orbital Scale Infrastructure',
    achievement: 'IEEE Young Engineer of Year',
    bio: 'Led ground station software for global Starlink rollout, enabling broadband for 3M+ underserved users.',
    imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-10',
    name: 'Shreya Menon',
    batch: "PEC '19",
    role: 'Founder & CEO',
    company: 'Arbor Finance',
    valuation: '$180M Climate Fintech',
    achievement: 'G20 Young Climate Leader',
    bio: 'Building carbon credit infrastructure for SMEs across South & South-East Asia, backed by Tiger Global.',
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-11',
    name: 'Karan Joshi',
    batch: "PEC '15",
    role: 'Chief Product Officer',
    company: 'Zepto',
    valuation: '$5B Unicorn',
    achievement: 'India 40 Under 40 — Fortune',
    bio: 'Scaled quick commerce from 10 to 700+ dark stores. Architected Zepto Cafe and the 10-min grocery model.',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 'alumni-12',
    name: 'Meera Iyer',
    batch: "PEC '18",
    role: 'Founding Engineer',
    company: 'Perplexity AI',
    valuation: '$9B Answer Engine',
    achievement: 'YC Alumni — W23 Batch',
    bio: 'Core engineer behind Perplexity Pro search ranking and real-time web grounding pipeline for 15M+ daily users.',
    imageUrl: 'https://images.unsplash.com/photo-1546961342-ea5f62d5a27b?auto=format&fit=crop&w=800&q=80',
    linkedin: 'https://linkedin.com',
  },
]

export default function AlumniSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const xMotion = useMotionValue(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    // Subscribe directly to scroll progress so we always read the live scrollWidth,
    // avoiding the stale-closure issue with state-based useTransform
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      if (!trackRef.current) return
      const maxScroll = Math.max(0, trackRef.current.scrollWidth - window.innerWidth)
      xMotion.set(-progress * maxScroll)
    })
    return unsubscribe
  }, [scrollYProgress, xMotion])

  return (
    <section
      id="alumni"
      ref={containerRef}
      className="relative h-[380vh] bg-[#081C16] text-white rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 z-10 border-t border-[#7ED321]/20"
    >
      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-8 md:px-12">
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
        <div className="w-full overflow-hidden z-10 py-4 mt-6 sm:mt-8 md:mt-10 mb-auto">
          <motion.div 
            ref={trackRef} 
            style={{ x: xMotion }} 
            className="flex gap-4 sm:gap-5 md:gap-6 w-max pl-4 sm:pl-8 md:pl-16 pr-16"
          >
            {ALUMNI_DATA.map((person, idx) => (
              <div 
                key={person.id} 
                className="w-[230px] sm:w-[270px] md:w-[290px] shrink-0 snap-center rounded-2xl focus-within:ring-2 focus-within:ring-mint outline-none"
                tabIndex={0}
              >
                <PixelTransition
                  gridSize={10}
                  pixelColor="var(--accent-mint)"
                  animationStepDuration={0.4}
                  aspectRatio="105%"
                  className="rounded-2xl shadow-2xl bg-[#0B1712] transition-transform duration-150 active:scale-[0.98] w-full overflow-hidden group/card isolate border-0 border-transparent outline-none cursor-pointer"
                  style={{ border: 'none', outline: 'none' }}
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-[#0B1712] rounded-2xl">
                      {/* Image */}
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        loading="lazy"
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
                        
                        {/* Mobile Tap Hint */}
                        <div className="mt-2 sm:hidden flex items-center gap-1.5 text-white/60 text-[10px] uppercase font-mono-data font-bold tracking-wider">
                          <Zap size={10} className="text-mint" /> Tap to read
                        </div>
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
