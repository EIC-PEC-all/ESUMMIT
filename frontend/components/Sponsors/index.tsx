'use client'

import React from 'react'
import { Award, Building2, Handshake, Download, Mail } from 'lucide-react'
import PageBanner from '@/components/Common/PageBanner'
import { MASTER_CONTACTS } from '@/data/summitData'

import PreviousSponsorsGrid from './PreviousSponsorsGrid'
import UpcomingSponsorsComingSoon from './UpcomingSponsorsComingSoon'
import { BROCHURE_URL } from '@/lib/siteConfig'

export default function Sponsors() {
  return (
    <>
      <PageBanner
        title="SPONSORS"
        subtitle="NOVEMBER 14–15, 2026 · POWERED BY GLOBAL TECH & VENTURE INSTITUTIONS"
      />

      <section
        id="sponsors"
        className="relative bg-section-1 text-primary pt-10 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10"
        aria-labelledby="sponsors-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <UpcomingSponsorsComingSoon />

          <PreviousSponsorsGrid />

          <div className="mt-16 sm:mt-24 relative rounded-3xl bg-panel border border-border-panel p-6 sm:p-8 md:p-10 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
            <h3
              className="font-display font-black uppercase tracking-wider text-primary mb-3 leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.25rem)' }}
            >
              PARTNER WITH <span className="text-gradient-mint">E-SUMMIT &apos;26</span>
            </h3>

            <p className="text-xs sm:text-[13px] text-secondary font-body max-w-xl mx-auto leading-relaxed mb-6">
              Connect your brand with 5,000+ ambitious student engineers, 50+ emerging ventures, and tier-1 venture funds at North India&apos;s premier entrepreneurship summit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-7">
              <div className="p-3.5 rounded-xl bg-panel-alt border border-border-subtle text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Handshake size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">5,000+ Footfall</span>
                </div>
                <p className="text-[10px] text-muted font-body">Nationwide Student Delegation</p>
              </div>

              <div className="p-3.5 rounded-xl bg-panel-alt border border-border-subtle text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Building2 size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">50+ Startups</span>
                </div>
                <p className="text-[10px] text-muted font-body">Active Seed &amp; Deep-Tech Ventures</p>
              </div>

              <div className="p-3.5 rounded-xl bg-panel-alt border border-border-subtle text-center">
                <div className="flex items-center justify-center gap-1.5 text-mint mb-1">
                  <Award size={15} />
                  <span className="font-mono-data text-xs font-bold uppercase">100+ Years</span>
                </div>
                <p className="text-[10px] text-muted font-body">PEC Legacy &amp; 1K+ Alumni Network</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href={BROCHURE_URL}
                download="PEC-E-Summit-2026-Brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mint-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-mono-data text-xs font-black uppercase tracking-wider text-void shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Download size={15} strokeWidth={2.5} className="text-void" />
                <span>DOWNLOAD OFFICIAL BROCHURE (PDF)</span>
              </a>

              <a
                href={`mailto:${MASTER_CONTACTS.emails[0]}?subject=Partnership%20Inquiry%20-%20PEC%20E-Summit%202026`}
                className="btn-dark-gradient w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-primary font-mono-data text-xs font-bold uppercase tracking-wider border border-border-subtle hover:border-mint hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
              >
                <Mail size={15} className="text-mint stroke-[2.5]" />
                <span>PARTNER INQUIRY</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
