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
    <section ref={containerRef} className="relative h-[320vh] bg-void text-primary">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-[var(--accent-mint)]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Sticky Fullscreen Container */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-24 md:pt-28 pb-8 px-4 md:px-12">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto w-full mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-primary uppercase">
              Distinguished <span className="text-mint">Alumni</span>
            </h2>
            <p className="text-sm md:text-base text-secondary font-sans max-w-xl mt-2">
              Pioneers, founders, and leaders who emerged from PEC E-Cell to shape global technology and venture ecosystems.
            </p>
          </div>

          {/* Scroll hint indicator */}
          <div className="hidden md:flex items-center gap-3 text-xs font-mono text-secondary bg-panel px-4 py-2 rounded-full border border-border-subtle">
            <span>SCROLL DOWN TO EXPLORE</span>
            <ArrowRight className="w-4 h-4 text-mint animate-pulse" />
          </div>
        </div>

        {/* Horizontal Motion Track */}
        <div className="w-full overflow-hidden z-10 py-2">
          <motion.div style={{ x: xTransform }} className="flex gap-6 md:gap-8 w-max pl-4 md:pl-12 pr-12">
            {ALUMNI_DATA.map((person) => (
              <div key={person.id} className="w-[310px] sm:w-[350px] shrink-0">
                <PixelTransition
                  gridSize={10}
                  pixelColor="var(--accent-mint)"
                  animationStepDuration={0.4}
                  aspectRatio="145%"
                  className="rounded-2xl border border-border-subtle hover:border-mint transition-colors shadow-xl bg-panel w-full"
                  firstContent={
                    <div className="relative w-full h-full group overflow-hidden bg-panel">
                      {/* Image */}
                      <img
                        src={person.imageUrl}
                        alt={person.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                      />

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Top Batch Tag */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-md bg-panel/80 backdrop-blur-md border border-border-subtle text-primary font-mono text-xs font-semibold tracking-wider">
                          {person.batch}
                        </span>
                      </div>

                      {/* Bottom Front Content */}
                      <div className="absolute bottom-0 inset-x-0 p-5 z-10 flex flex-col justify-end">
                        <span className="text-xs font-mono text-mint font-medium tracking-wide flex items-center gap-1.5 mb-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {person.company}
                        </span>
                        <h3 className="text-2xl font-bold font-display text-white tracking-tight">{person.name}</h3>
                        <p className="text-xs text-gray-200 font-sans mt-0.5 line-clamp-1">{person.role}</p>

                        <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-secondary">
                          <span className="flex items-center gap-1 text-mint font-medium">
                            <Sparkles className="w-3 h-3" /> Hover to reveal profile
                          </span>
                          <span className="text-secondary font-medium">⚡ Pixel Reveal</span>
                        </div>
                      </div>
                    </div>
                  }
                  secondContent={
                    <div className="w-full h-full bg-[#18230F] p-6 flex flex-col justify-between border border-[#4E6527]/70 rounded-2xl text-left select-none overflow-hidden text-white shadow-2xl">
                      <div className="space-y-3">
                        {/* Header Details */}
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-md bg-[#C8E696]/20 border border-[#C8E696]/40 text-[#C8E696] font-mono text-xs font-bold tracking-wider">
                            {person.batch}
                          </span>
                          <a
                            href={person.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-white/10 hover:bg-[#C8E696] text-white hover:text-[#0A110E] transition-all border border-white/20 shrink-0"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </div>

                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">{person.name}</h3>
                          <div className="text-xs font-mono text-[#C8E696] font-medium flex items-center gap-1.5 mt-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {person.role} • {person.company}
                          </div>
                        </div>

                        {/* Valuation / Milestone Badge */}
                        {person.valuation && (
                          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono text-gray-200">
                            <Award className="w-4 h-4 text-[#C8E696] shrink-0" />
                            <span className="font-semibold text-white">{person.valuation}</span>
                          </div>
                        )}

                        {/* Bio */}
                        <p className="text-xs text-gray-200 leading-relaxed font-sans line-clamp-3">{person.bio}</p>
                      </div>

                      {/* Footer Badge */}
                      <div className="pt-3 border-t border-[#4E6527]/40 flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono font-bold text-[#C8E696] uppercase tracking-wider flex items-center gap-1.5">
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
