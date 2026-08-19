import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Delegate Registration & E-Badge — PEC E-Summit 2026',
  description: 'Register as an official delegate for PEC E-Summit 2026. Instant digital E-Badge generation with QR check-in credentials for keynotes, pitch arena, and hackathon.',
  openGraph: {
    title: 'Register for PEC E-Summit 2026',
    description: 'Claim your delegate pass for North India\'s premier entrepreneurship summit at Punjab Engineering College, Chandigarh.',
    url: 'https://esummit.pec.ac.in/register',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}