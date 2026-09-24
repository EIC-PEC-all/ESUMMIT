import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import FAQ from '@/components/FAQ'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions — PEC E-Summit 2026',
  description:
    'Find answers to common questions about passes, eligibility, accommodation, competition rules, and registration for PEC E-Summit 2026.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'FAQ — PEC E-Summit 2026',
    description:
      'Got questions? Everything you need to know about attending, competing, and pitching at North India\'s premier entrepreneurship summit.',
    url: 'https://esummit.pec.ac.in/faq',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function FAQPage() {
  return (
    <SectionPageShell>
      <FAQ />
    </SectionPageShell>
  )
}
