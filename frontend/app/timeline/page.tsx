import React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import PageBanner from '@/components/Common/PageBanner'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function TimelinePage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12 text-primary">
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
                href="/register"
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
