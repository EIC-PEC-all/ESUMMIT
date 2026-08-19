import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visionary Speakers & Investors — PEC E-Summit 2026',
  description: 'Meet the founders, venture capitalists, unicorn builders, and industry executives speaking at PEC E-Summit 2026.',
  openGraph: {
    title: 'PEC E-Summit 2026 — Keynote Speakers & Visionaries',
    description: 'Venture leaders, angel investors, and tech founders sharing playbook insights in Chandigarh.',
    url: 'https://esummit.pec.ac.in/speakers',
  },
}

export default function SpeakersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}