import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import Alumni from '@/components/Alumni'

export const metadata: Metadata = {
  title: 'Alumni Wall of Fame — PEC E-Summit 2026',
  description:
    'Celebrate Punjab Engineering College\'s illustrious alumni network: aerospace legends, unicorn founders, and pioneering business leaders shaping world technology.',
  alternates: {
    canonical: '/alumni',
  },
  openGraph: {
    title: 'Alumni Wall of Fame — PEC E-Summit 2026',
    description:
      'Honoring PEC\'s visionary graduates from Kalpana Chawla to CARS24 founders and global industry changemakers.',
    url: 'https://esummit.pec.ac.in/alumni',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function AlumniPage() {
  return (
    <SectionPageShell>
      <Alumni />
    </SectionPageShell>
  )
}
