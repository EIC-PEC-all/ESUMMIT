'use client'
// components/EsummitTracks/index.tsx
// High-craft Events section with interactive expandable event rows, smooth Framer Motion transitions,
// tags, and rich event metadata.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '@/components/ui/FadeIn'
import { ArrowUpRight, ChevronDown, Trophy, Users, Code, Sparkles, Handshake } from 'lucide-react'
import Link from 'next/link'

const EVENTS = [
  {
    num: '01',
    name: 'Pitch Competition',
    icon: Trophy,
    prize: '₹5.0L Pool',
    tags: ['Pre-Revenue', 'Growth Stage', 'Social Impact'],
    description:
      'Present your startup idea directly to a panel of active VCs and angel investors. Walk in with a deck, walk out with term sheets and advisory commitments.',
    details: 'Top 10 finalists get 1-on-1 pitch coaching before the final grand stage presentation.',
  },
  {
    num: '02',
    name: 'Panel Discussions',
    icon: Sparkles,
    prize: 'VIP Access',
    tags: ['AI & DeepTech', 'Fundraising', 'Playbooks'],
    description:
      'Unfiltered conversations with founders, CXOs, and policymakers on fundraising in tough climates, frontier AI, and scaling from campus project to market leader.',
    details: 'Includes interactive live Q&A sessions and post-panel speaker meet & greets.',
  },
  {
    num: '03',
    name: 'Startup Expo',
    icon: Users,
    prize: '30+ Stalls',
    tags: ['EdTech', 'AgriTech', 'HealthTech', 'SaaS'],
    description:
      'A live exhibition floor showcasing 30+ high-potential student and early-stage startups to 3,000+ attendees, corporate partners, and media.',
    details: 'Stalls include power, high-speed WiFi, demo screens, and dedicated investor slot passes.',
  },
  {
    num: '04',
    name: '24-Hour Hackathon',
    icon: Code,
    prize: '₹3.5L Pool',
    tags: ['AI Agents', 'Web3 & Infra', 'Open Tech'],
    description:
      '24 hours of non-stop building. Tackle real-world problem statements or architect novel software tools. Mentors from Microsoft & Google on floor.',
    details: 'Free food, energy drinks, sleeping bays, and instant API credits provided.',
  },
  {
    num: '05',
    name: 'Networking Mixer',
    icon: Handshake,
    prize: 'Invite Only',
    tags: ['Speed Networking', 'VC Office Hours', 'VIP Dinner'],
    description:
      'Structured networking sessions: 5-min speed rotations, 1-on-1 15-min investor office hours, and an exclusive VIP dinner with keynote speakers.',
    details: 'Connect directly with angel syndicates, alumni founders, and ecosystem enablers.',
  },
]

export default function EsummitTracks() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)

  return (
    <section
      id="esummit-tracks"
      className="esummit-section rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ background: '#FFFFFF', fontFamily: "'Kanit', sans-serif" }}
      aria-labelledby="tracks-heading"
    >
      {/* Heading */}
      <FadeIn>
        <h2
          id="tracks-heading"
          className="font-black uppercase text-center mb-16 sm:mb-20 md:mb-24"
          style={{
            color: '#070B08',
            fontFamily: "'Kanit', sans-serif",
            fontSize: 'clamp(3rem, 12vw, 150px)',
            lineHeight: 1,
          }}
        >
          Events
        </h2>
      </FadeIn>

      {/* Numbered expandable event list */}
      <div className="max-w-5xl mx-auto space-y-4">
        {EVENTS.map((event, i) => {
          const isExpanded = expandedIndex === i
          const Icon = event.icon

          return (
            <FadeIn key={event.num} delay={i * 0.08}>
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className={`group rounded-2xl p-6 sm:p-8 transition-all duration-300 cursor-pointer border ${
                  isExpanded
                    ? 'bg-[#070B08] text-white border-[#070B08] shadow-2xl scale-[1.01]'
                    : 'bg-[#F7F9F6] text-[#070B08] border-gray-200 hover:border-[#7ED321]'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-8">
                    {/* Number */}
                    <span
                      className={`font-black leading-none select-none transition-colors duration-300 ${
                        isExpanded ? 'text-[#7ED321]' : 'text-gray-400 group-hover:text-[#7ED321]'
                      }`}
                      style={{
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: 'clamp(2rem, 5vw, 64px)',
                        lineHeight: 0.9,
                      }}
                    >
                      {event.num}
                    </span>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3
                          className="font-black uppercase tracking-tight"
                          style={{
                            fontFamily: "'Kanit', sans-serif",
                            fontSize: 'clamp(1.2rem, 2.5vw, 2.2rem)',
                          }}
                        >
                          {event.name}
                        </h3>
                        <span
                          className={`hidden sm:inline-flex items-center gap-1 px-3 py-0.5 rounded-full font-mono-data text-xs font-bold ${
                            isExpanded
                              ? 'bg-[#7ED321]/20 text-[#7ED321] border border-[#7ED321]/40'
                              : 'bg-black/5 text-[#070B08]'
                          }`}
                        >
                          <Icon size={12} />
                          <span>{event.prize}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expand Chevron Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 ${
                      isExpanded
                        ? 'bg-[#7ED321] text-[#070B08] rotate-180'
                        : 'bg-black/5 text-[#070B08] group-hover:bg-[#7ED321] group-hover:text-[#070B08]'
                    }`}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>

                {/* Expandable Body */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                        <p className="font-body text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
                          {event.description}
                        </p>

                        <p className="font-body text-xs sm:text-sm text-[#7ED321] font-semibold">
                          💡 {event.details}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {event.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 rounded-full font-mono-data text-xs bg-white/10 text-white border border-white/15"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Register for Track CTA */}
                        <div className="pt-4 flex items-center gap-4">
                          <Link
                            href="/register"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider bg-[#7ED321] text-[#070B08] hover:bg-[#8fe62e] transition-all"
                          >
                            <span>Register for {event.name}</span>
                            <ArrowUpRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          )
        })}
      </div>
    </section>
  )
}

