import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import Vdo2Showcase from '@/components/Vdo2Showcase'

export const metadata: Metadata = {
  title: 'Summit Passes & Tiers — PEC E-Summit 2026',
  description:
    'Choose your pass tier for PEC E-Summit 2026. Student Delegate, Startup Founder Pitch, and Hackathon Builder passes available now at Punjab Engineering College.',
  alternates: {
    canonical: '/passes',
  },
  openGraph: {
    title: 'Summit Passes & Tiers — PEC E-Summit 2026',
    description:
      'Unlock 2 days of pitch battles, 24-hr hackathons, keynotes, and 1-on-1 VC deal-making at PEC Chandigarh.',
    url: 'https://esummit.pec.ac.in/passes',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function PassesPage() {
  return (
    <SectionPageShell>
      <Vdo2Showcase />
    </SectionPageShell>
  )
}
