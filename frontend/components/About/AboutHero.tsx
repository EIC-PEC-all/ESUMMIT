'use client'

import React from 'react'
import Link from 'next/link'
import { Download, ArrowRight } from 'lucide-react'
import FadeIn from '@/components/ui/FadeIn'
import AnimatedText from '@/components/ui/AnimatedText'
import GlassSurface from '@/components/ui/GlassSurface'
import { useSummitData } from '@/hooks/useSummitData'
import GeometricNodesCanvas from './GeometricNodesCanvas'

const SPOTLIGHT_PILLARS = [
  {
    stat: '5K+',
    label: 'TOTAL FOOTFALL',
    desc: 'Record-breaking attendance from student builders, innovators, and industry leaders.',
  },
  {
    stat: '50+',
    label: 'STARTUPS ATTENDED',
    desc: 'Emerging ventures and deep-tech startups showcasing products and raising capital.',
  },
  {
    stat: '50+',
    label: 'WORKSHOPS',
    desc: 'Hands-on learning sessions on validation, pitching, finance, and emerging tech.',
  },
  {
    stat: '30+',
    label: 'SPEAKER SESSIONS',
    desc: 'Insights from founders, market leaders, and VCs sharing non-textbook lessons.',
  },
  {
    stat: '3K+',
    label: 'EVENT PARTICIPATION',
    desc: 'Massive engagement in hackathons, B-quizzes, IPL auctions, and pitch competitions.',
  },
  {
    stat: '1K+',
    label: 'ALUMNI SUPPORT',
    desc: 'Backed by a formidable network of PEC alumni acting as mentors and angel investors.',
  },
]

export default function AboutHero() {
  const { data } = useSummitData()
  const summitDates = data?.siteConfig?.summitDates || 'November 14–15, 2026'
  const dynamicAboutText = `PEC E-Summit is the flagship entrepreneurship summit of E-Cell Punjab Engineering College, bringing together 3,000+ student founders, seasoned venture capitalists, and technology leaders. From competitive pitching and an overnight hackathon to curated investor roundtables — it is North India's premier launchpad where ideas meet capital and build the future. Join us ${summitDates}.`

  return (
    <div className="relative overflow-hidden py-4 sm:py-6">
      <GeometricNodesCanvas />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, var(--accent-green-dim) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 max-w-5xl mx-auto">
        <FadeIn delay={0.05}>
          <h2
            id="about-heading"
            className="font-display font-black uppercase tracking-wider text-center text-primary leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}
          >
            WHERE AMBITION MEETS <span className="text-gradient-mint">EXECUTION</span>
          </h2>
        </FadeIn>

        <AnimatedText
          text={dynamicAboutText}
          className="font-body font-medium text-center leading-relaxed max-w-[760px]"
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)',
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full mt-2">
          {SPOTLIGHT_PILLARS.map((pillar, idx) => (
            <FadeIn key={pillar.label} delay={0.1 + idx * 0.08} className="h-full">
              <GlassSurface
                borderRadius={20}
                distortionScale={-220}
                displace={0.5}
                backgroundOpacity={0.06}
                borderWidth={1}
                borderColor="var(--border-glow)"
                brightness={100}
                opacity={0.96}
                blur={16}
                saturation={1.1}
                redOffset={0}
                greenOffset={28}
                blueOffset={56}
                refraction
                renderer="svg"
                className="group p-5 sm:p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-mint/60 hover:bg-mint/[0.03]"
              >
                <div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-mint tracking-tight leading-none mb-2 select-none group-hover:scale-105 transition-transform duration-300 origin-left">
                    {pillar.stat}
                  </div>
                  <h3 className="font-display font-bold text-xs uppercase mb-2 tracking-wider text-primary group-hover:text-primary transition-colors">
                    {pillar.label}
                  </h3>
                  <p className="font-body text-xs text-secondary leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </GlassSurface>
            </FadeIn>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-4">
          <a
            href="/e-summit-brochure.pdf"
            download="PEC-E-Summit-2026-Brochure.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-mint text-[#06110D] font-mono-data text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Download size={14} strokeWidth={2.5} />
            <span>DOWNLOAD OFFICIAL BROCHURE (PDF)</span>
          </a>

          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-panel-alt hover:bg-panel text-primary font-mono-data text-xs font-bold uppercase tracking-wider border border-border-subtle transition-all hover:border-mint"
          >
            <span>REGISTER FOR PASSES</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
