import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import EsummitAbout from '@/components/EsummitAbout'

export const metadata: Metadata = {
  title: 'About — PEC E-Summit 2026',
  description:
    'Discover PEC E-Summit 2026: North India\'s premier entrepreneurship summit hosted by E-Cell Punjab Engineering College. Explore our mission, vision, prize pools, and innovation ecosystem.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About PEC E-Summit 2026 — Punjab Engineering College',
    description:
      'Learn about our legacy, ₹15L+ prize pool, 3,000+ attendees, and student innovation launchpad at PEC Chandigarh.',
    url: 'https://esummit.pec.ac.in/about',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function AboutPage() {
  return (
    <SectionPageShell>
      <EsummitAbout />
    </SectionPageShell>
  )
}
