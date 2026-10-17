import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import PageBanner from '@/components/Common/PageBanner'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Summit Schedule & 2-Day Timeline | PEC E-Summit 2026',
  description:
    'Complete event timetable for PEC E-Summit 2026 on November 14–15, 2026. Keynote timings, pitch rounds, networking slots, hackathon milestones, and panel sessions at Punjab Engineering College, Chandigarh.',
  keywords: [
    'PEC E-Summit Schedule',
    'E-Summit 2026 Dates',
    'Chandigarh Startup Event Timeline',
    'PEC Hackathon Schedule',
    'Pitch Competition Timings',
  ],
  alternates: {
    canonical: '/timeline',
  },
  openGraph: {
    title: 'Schedule & 2-Day Timeline | PEC E-Summit 2026',
    description:
      'Detailed agenda for November 14–15, 2026. Explore speaker slots, hackathon schedules, and investor pitching rounds.',
    url: absoluteUrl('/timeline'),
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: getOgImageUrl('Summit Timeline', 'NOVEMBER 14-15'),
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Official Timeline',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026 Timeline & Schedule',
    description: 'Detailed agenda for November 14–15, 2026 at Punjab Engineering College.',
    images: [getOgImageUrl('Summit Timeline', 'NOVEMBER 14-15')],
  },
}

const TIMELINE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl(),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Timeline',
      item: absoluteUrl('/timeline'),
    },
  ],
}

export default function TimelinePage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12 text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TIMELINE_SCHEMA) }}
      />
      <Nav />
      <PageBanner
        title="TIMELINE"
        subtitle="NOVEMBER 14–15, 2026 · OFFICIAL SUMMIT TIMETABLE & TRACK AGENDA"
      />

      <section
        id="timeline-content"
        className="relative bg-section-1 text-primary pt-10 pb-20 sm:pb-24 px-4 sm:px-6 md:px-12 overflow-hidden z-10"
        aria-labelledby="timeline-heading"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="w-full rounded-2xl sm:rounded-3xl bg-panel border border-border-panel p-10 sm:p-16 md:p-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-panel-alt border border-border-subtle text-mint flex items-center justify-center mx-auto mb-6">
              <Calendar size={26} />
            </div>

            <h2
              id="timeline-heading"
              className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-primary tracking-wide uppercase mb-4"
            >
              SCHEDULE <span className="text-gradient-mint">COMING SOON</span>
            </h2>

            <p className="text-sm sm:text-base text-secondary font-body leading-relaxed max-w-lg mx-auto mb-8">
              The official summit timetable, speaker sessions, and track agenda will be announced soon.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/passes"
                className="btn-mint-gradient inline-flex items-center gap-2 px-7 py-3 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider text-void hover:scale-105 transition-all cursor-pointer"
              >
                <span>Book Passes</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/events"
                className="btn-dark-gradient inline-flex items-center gap-2 px-7 py-3 rounded-full font-mono-data text-xs font-bold uppercase tracking-wider text-primary border border-border-subtle hover:border-mint transition-all cursor-pointer"
              >
                <span>Explore Events</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
