import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funding Partners & Sponsors — PEC E-Summit 2026',
  description: 'Our partners, venture sponsors, ecosystem incubators, and tech supporters making PEC E-Summit 2026 possible.',
  openGraph: {
    title: 'PEC E-Summit 2026 — Funding Partners & Ecosystem Sponsors',
    description: 'Explore the global ventures, companies, and organizations powering student entrepreneurship at PEC.',
    url: 'https://esummit.pec.ac.in/sponsors',
  },
}

export default function SponsorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}