import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import EsummitHighlights from '@/components/EsummitSpeakers'

export const metadata: Metadata = {
  title: 'Timeline & Schedule — PEC E-Summit 2026',
  description:
    'Full Day 1 and Day 2 schedule of keynotes, pitch battles, hackathons, and networking sessions at PEC E-Summit 2026 with interactive campus venue map.',
  alternates: {
    canonical: '/timeline',
  },
  openGraph: {
    title: 'Timeline & Schedule — PEC E-Summit 2026',
    description:
      'Plan your itinerary for PEC E-Summit 2026. Explore stage timings, speaker slots, and interactive campus map at Punjab Engineering College.',
    url: 'https://esummit.pec.ac.in/timeline',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function TimelinePage() {
  return (
    <SectionPageShell>
      <EsummitHighlights />
    </SectionPageShell>
  )
}
