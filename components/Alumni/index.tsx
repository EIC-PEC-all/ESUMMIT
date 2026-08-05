'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Linkedin, ExternalLink, Award, Building2, Sparkles, ArrowRight } from 'lucide-react'
import PixelTransition from '@/components/ui/PixelTransition'

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

  // Scroll progress for horizontal animation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Map vertical scroll progress [0, 1] to horizontal translation percentage
  const xTransform = useTransform(scrollYProgress, [0, 1], ['0%', '-65%'])

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-[#070B08] text-[#F5F5F0]">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[#7ED321]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center py-10 px-4 md:px-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto w-full mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7ED321]/10 border border-[#7ED321]/30 text-[#7ED321] text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hall of Fame</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-kanit tracking-tight text-white uppercase">
              Distinguished <span className="text-[#7ED321]">Alumni</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-sans max-w-xl mt-2">
              Pioneers, founders, and leaders who emerged from PEC E-Cell to shape global technology and venture ecosystems.
            </p>
          </div>

          {/* Scroll hint indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-gray-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span>SCROLL DOWN TO EXPLORE</span>
            <ArrowRight className="w-4 h-4 text-[#7ED321] animate-pulse" />
          </div>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full overflow-hidden z-10 py-4">
          <motion.div style={{ x: xTransform }} className="flex gap-6 md:gap-8 w-max pl-4 md:pl-12 pr-12">
            {ALUMNI_DATA.map((person) => (
              <div key={person.id} className="w-[310px] sm:w-[350px] shrink-0">
                <PixelTransition
                  gridSize={10}
                  pixelColor="#7ED321"
                  animationStepDuration={0.4}
                  aspectRatio="135%"
                  className="rounded-2xl border-2 border-[#7ED321]/30 hover:border-[#7ED321] transition-colors shadow-xl bg-[#0D140E] w-full"
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-slate-900">
                      {/* Image */}
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                      />

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070B08] via-[#070B08]/40 to-transparent" />

                      {/* Top Batch Tag */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-md bg-[#070B08]/80 backdrop-blur-md border border-white/15 text-white font-mono text-xs font-semibold tracking-wider">
                          {person.batch}
                        </span>
                      </div>

                      {/* Bottom Front Content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                        <span className="text-xs font-mono text-[#7ED321] font-medium tracking-wide flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {person.company}
                        </span>
                        <h3 className="text-2xl font-bold font-kanit text-white tracking-tight">{person.name}</h3>
                        <p className="text-xs text-gray-300 font-sans mt-0.5 line-clamp-1">{person.role}</p>

                        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
                          <span className="flex items-center gap-1 text-[#7ED321]">
                            <Sparkles className="w-3 h-3" /> Hover to reveal profile
                          </span>
                          <span className="text-gray-400">⚡ GSAP Pixel Reveal</span>
                        </div>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#0D140E] p-6 flex flex-col justify-between border border-[#7ED321]/40 text-left select-none">
                      <div>
                        {/* Header Details */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded bg-[#7ED321]/15 text-[#7ED321] text-[11px] font-mono font-semibold">
                              {person.batch}
                            </span>
                            <h3 className="text-2xl font-black font-kanit text-white mt-1.5">{person.name}</h3>
                          </div>
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-white/5 hover:bg-[#7ED321] text-gray-300 hover:text-black transition-all"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </div>

                        {/* Position & Company */}
                        <div className="mb-4">
                          <div className="text-sm font-semibold text-white">{person.role}</div>
                          <div className="text-xs font-mono text-[#7ED321] flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {person.company}
                          </div>
                        </div>

                        {/* Valuation / Milestone Badge */}
                        {person.valuation && (
                          <div className="mb-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono text-gray-200">
                            <Award className="w-4 h-4 text-[#7ED321]" />
                            <span>{person.valuation}</span>
                          </div>
                        )}

                        {/* Bio */}
                        <p className="text-xs text-gray-300 leading-relaxed font-sans mt-2">{person.bio}</p>
                      </div>

                      {/* Footer Badge */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#7ED321] uppercase tracking-wider flex items-center gap-1">
                          <Award className="w-3 h-3" /> {person.achievement}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
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
