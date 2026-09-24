import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import EventPortfolioShowcase from '@/components/EventPortfolio'

export const metadata: Metadata = {
  title: 'Competitions & Tracks — PEC E-Summit 2026',
  description:
    'Explore the official competitions, hackathons, pitch arena, and workshop tracks at PEC E-Summit 2026. Compete for cash prizes, grants, and investor backing.',
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Competitions & Tracks — PEC E-Summit 2026',
    description:
      'Participate in high-stakes startup pitch battles, overnight hackathons, IPL auctions, and business case competitions at PEC Chandigarh.',
    url: 'https://esummit.pec.ac.in/events',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function EventsPage() {
  return (
    <SectionPageShell>
      <EventPortfolioShowcase />
    </SectionPageShell>
  )
}
