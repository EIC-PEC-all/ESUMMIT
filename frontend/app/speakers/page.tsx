import type { Metadata } from 'next'
import SectionPageShell from '@/components/Common/SectionPageShell'
import Speakers from '@/components/Speakers'

export const metadata: Metadata = {
  title: 'Keynote Speakers & Mentors — PEC E-Summit 2026',
  description:
    'Meet the visionary founders, enterprise leaders, venture capitalists, and keynote speakers gracing the stages at PEC E-Summit 2026.',
  alternates: {
    canonical: '/speakers',
  },
  openGraph: {
    title: 'Keynote Speakers & Mentors — PEC E-Summit 2026',
    description:
      'Learn from India\'s top entrepreneurs, unicorn founders, and investors at Punjab Engineering College, Chandigarh.',
    url: 'https://esummit.pec.ac.in/speakers',
    siteName: 'PEC E-Summit 2026',
  },
}

export default function SpeakersPage() {
  return (
    <SectionPageShell>
      <Speakers />
    </SectionPageShell>
  )
}
