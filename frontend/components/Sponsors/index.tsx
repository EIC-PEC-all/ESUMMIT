'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight, Sparkles, Building2, Handshake, Download } from 'lucide-react'

import PageBanner from '@/components/Common/PageBanner'

export default function Sponsors() {
  return (
    <>
      <PageBanner 
        title="SPONSORS" 
        subtitle="POWERED BY GLOBAL TECH & VENTURE INSTITUTIONS"
      />
      <section
        id="sponsors"
        className="relative bg-section-1 text-white pt-12 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10 scroll-mt-20 sm:scroll-mt-24"
        aria-labelledby="sponsors-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">

        {/* Coming Soon Glassmorphic Showcase */}
        <div
          className="relative rounded-3xl bg-[#071711]/90 border border-mint/20 p-6 sm:p-8 md:p-10 text-center shadow-2xl overflow-hidden backdrop-blur-xl"
        >

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/30 text-mint font-mono-data text-[10px] font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
            </span>
            <span>Partnership Directory</span>
          </div>

          {/* Main Title */}
          <h3
            className="font-display font-black uppercase tracking-wider text-white mb-3 leading-tight"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)' }}
          >
            COMING SOON
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-gray-300 font-body max-w-lg mx-auto leading-relaxed mb-6">
            We are finalizing strategic alliances with global tech enterprises, venture capital institutions, and ecosystem enablers. The official 2026 partner directory will be unveiled shortly.
          </p>

          {/* Highlights / Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 max-w-xl mx-auto mb-7">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-mint mb-0.5">
                <Handshake size={14} />
                <span className="font-mono-data text-[11px] font-bold uppercase tracking-wider">Tier-1 Partners</span>
              </div>
              <p className="text-[10px] text-gray-400 font-body">Global Tech &amp; Cloud Giants</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-mint mb-0.5">
                <Building2 size={14} />
                <span className="font-mono-data text-[11px] font-bold uppercase tracking-wider">Venture Funds</span>
              </div>
              <p className="text-[10px] text-gray-400 font-body">Leading Seed &amp; Series A VCs</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="flex items-center justify-center gap-1.5 text-mint mb-0.5">
                <Sparkles size={14} />
                <span className="font-mono-data text-[11px] font-bold uppercase tracking-wider">10,000+ Reach</span>
              </div>
              <p className="text-[10px] text-gray-400 font-body">Nationwide Delegation</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/sponsors"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#00F2B2] text-[#06110D] font-mono-data text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,242,178,0.25)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Partner With Us</span>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>

            <a
              href="/e-summit-brochure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono-data text-xs font-bold uppercase tracking-wider border border-white/20 transition-all hover:border-[#00F2B2] cursor-pointer"
            >
              <Download size={14} strokeWidth={2.5} />
              <span>Download Brochure</span>
            </a>
          </div>
        </div>

        {/* Sponsorship Roles from Brochure */}
        <div className="mt-16 sm:mt-24 relative z-10">
          <div className="text-center mb-10">
            <h3 className="font-display font-black uppercase tracking-wider text-white mb-2" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
              SPONSORSHIP <span className="text-gradient-mint">ROLES</span>
            </h3>
            <p className="font-mono-data text-[11px] text-gray-400 uppercase tracking-widest">
              Partnerships shaped around your objectives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
            {[
              { role: 'PRESENTING PARTNER', desc: 'Summit-wide association and highest-visibility integration.' },
              { role: 'PROGRAMME PARTNER', desc: 'Own a defined property such as capital, talent or workshops.' },
              { role: 'ECOSYSTEM PARTNER', desc: 'Participate through networks, expertise, mentoring or venture access.' },
              { role: 'EXPERIENCE PARTNER', desc: 'Create a useful product, culture or attendee experience.' },
              { role: 'MEDIA PARTNER', desc: 'Extend stories and visibility before, during and after the summit.' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#07130F] border border-white/5 hover:border-mint/30 transition-all flex flex-col justify-center">
                <h4 className="font-mono-data text-xs font-bold text-mint uppercase tracking-wider mb-2">
                  {item.role}
                </h4>
                <p className="text-sm text-gray-300 font-body leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
