'use client'

import React from 'react'
import { Sparkles, Building2, Handshake, Download, Phone, Mail } from 'lucide-react'
import PageBanner from '@/components/Common/PageBanner'
import { MASTER_CONTACTS } from '@/data/summitData'
import WhyPartnerGrid from './WhyPartnerGrid'
import PreviousSponsorsGrid from './PreviousSponsorsGrid'

export default function Sponsors() {
  return (
    <>
      <PageBanner
        title="SPONSORS"
        subtitle="14–15 NOVEMBER 2026 · POWERED BY GLOBAL TECH & VENTURE INSTITUTIONS"
      />

      <section
        id="sponsors"
        className="relative bg-section-1 text-white pt-10 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10"
        aria-labelledby="sponsors-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Hero / Partner Proposition Box */}
          <div className="relative rounded-3xl bg-[#071711]/90 border border-mint/20 p-6 sm:p-8 md:p-10 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 text-mint font-mono-data text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
              </span>
              <span>Partnership Alliances 2026</span>
            </div>

            {/* Main Title */}
            <h3
              className="font-display font-black uppercase tracking-wider text-white mb-3 leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)' }}
            >
              PARTNER WITH <span className="text-gradient-mint">E-SUMMIT &apos;26</span>
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-gray-300 font-body max-w-xl mx-auto leading-relaxed mb-6">
              Connect your brand with 5,000+ ambitious student engineers, 50+ emerging ventures, and tier-1 venture funds at North India&apos;s premier entrepreneurship summit.
            </p>

            {/* Key Stats / Impact Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-7">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Handshake size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">5,000+ Footfall</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body">Nationwide Student Delegation</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Building2 size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">50+ Startups</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body">Active Seed &amp; Deep-Tech Ventures</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Sparkles size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">100+ Years</span>
                </div>
                <p className="text-[10px] text-gray-400 font-body">PEC Legacy &amp; 1K+ Alumni Network</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/e-summit-brochure.pdf"
                download="PEC-E-Summit-2026-Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-mint text-[#06110D] font-mono-data text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,178,0.25)] hover:scale-105 active:scale-95"
              >
                <Download size={14} strokeWidth={2.5} />
                <span>DOWNLOAD OFFICIAL BROCHURE (PDF)</span>
              </a>

              <a
                href={`mailto:${MASTER_CONTACTS.emails[0]}?subject=Partnership%20Inquiry%20-%20PEC%20E-Summit%202026`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs font-bold uppercase tracking-wider border border-white/20 transition-all hover:border-mint"
              >
                <Mail size={14} />
                <span>PARTNER INQUIRY</span>
              </a>
            </div>
          </div>

          {/* ── 1. Why Partner Grid (Brochure Page 24) ── */}
          <WhyPartnerGrid />

          {/* ── 2. Organizations that Backed the Journey (Brochure Page 27) ── */}
          <PreviousSponsorsGrid />

          {/* ── 4. Connect With Leadership (Brochure Page 28) ── */}
          <div className="mt-16 sm:mt-24 rounded-3xl bg-[#091812]/80 border border-mint/20 p-6 sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono-data text-mint font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-mint/10 border border-mint/20">
                LET&apos;S BUILD WHAT COMES NEXT
              </span>
              <h3
                className="font-display font-black uppercase tracking-wider text-white mt-3 mb-2"
                style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}
              >
                CONVENER &amp; COORDINATOR <span className="text-gradient-mint">CONTACTS</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MASTER_CONTACTS.faculty.map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono-data text-mint uppercase tracking-wider block mb-1">
                    {f.role}
                  </span>
                  <p className="font-display font-bold text-sm text-white">{f.name}</p>
                </div>
              ))}

              {MASTER_CONTACTS.studentLeadership.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono-data text-mint uppercase tracking-wider block mb-1">
                    {s.role}
                  </span>
                  <p className="font-display font-bold text-sm text-white mb-1.5">{s.name}</p>
                  <a
                    href={`tel:${s.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-mono-data text-gray-300 hover:text-mint transition-colors"
                  >
                    <Phone className="w-3 h-3 text-mint" />
                    <span>{s.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
