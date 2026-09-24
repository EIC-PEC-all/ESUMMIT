import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import Sponsors from '@/components/Sponsors'

export const metadata: Metadata = {
  title: 'Partners & Sponsors — PEC E-Summit 2026',
  description:
    'Our esteemed partners, venture funds, corporate leaders, and ecosystem sponsors supporting student entrepreneurship at PEC E-Summit 2026.',
  alternates: {
    canonical: '/sponsors',
  },
  openGraph: {
    title: 'Partners & Sponsors — PEC E-Summit 2026',
    description:
      'Backed by India\'s leading financial institutions, venture firms, and technology giants supporting PEC E-Summit 2026.',
    url: 'https://esummit.pec.ac.in/sponsors',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function SponsorsPage() {
  return (
    <SectionPageShell>
      <Sponsors />
    </SectionPageShell>
  )
}
