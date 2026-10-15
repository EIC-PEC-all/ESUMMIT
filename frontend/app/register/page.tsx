import { Suspense } from 'react'
import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Register & Passes — PEC E-Summit 2026',
  description:
    'Claim your official pass for PEC E-Summit 2026. Silver, Gold, and Diamond passes available now at Punjab Engineering College, Chandigarh.',
  alternates: {
    canonical: '/register',
  },

  openGraph: {
    title: 'Register for PEC E-Summit 2026 — Delegate Passes',
    description:
      'Join 3,000+ delegates, innovators, and investors at North India\'s premier entrepreneurship summit.',
    url: 'https://esummit.pec.ac.in/register',
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: '/api/og/pass?tier=ALL+ACCESS+DELEGATE+PASS',
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Official Delegate Pass',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026 Passes — Register Now',
    description:
      'Claim your student, founder, or hacker delegate pass for PEC E-Summit 2026.',
    images: ['/api/og/pass?tier=ALL+ACCESS+DELEGATE+PASS'],
  },
}

import { redirect } from 'next/navigation'

export default function RegisterPage() {
  redirect('/passes')
}


