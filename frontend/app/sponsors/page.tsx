import React from 'react'
import type { Metadata } from 'next'
import Sponsors from '@/components/Sponsors'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Official Partners, Sponsors & Ecosystem Enablers | PEC E-Summit 2026',
  description:
    'Explore the corporate sponsors, institutional partners, venture funds, and media houses supporting PEC E-Summit 2026 at Punjab Engineering College, Chandigarh.',
  keywords: [
    'PEC E-Summit Sponsors',
    'Startup Partners Chandigarh',
    'Corporate Sponsorship E-Summit',
    'EIC PEC Partners',
    'Venture Ecosystem North India',
  ],
  alternates: {
    canonical: '/sponsors',
  },
  openGraph: {
    title: 'Partners & Sponsors | PEC E-Summit 2026',
    description:
      'Backed by forward-thinking organizations, industry leaders, and ecosystem builders.',
    url: absoluteUrl('/sponsors'),
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: getOgImageUrl('Partners & Sponsors', 'ECOSYSTEM ENABLERS'),
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Sponsors and Partners',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026 Official Sponsors',
    description: 'Backed by forward-thinking organizations and industry ecosystem enablers.',
    images: [getOgImageUrl('Partners & Sponsors', 'ECOSYSTEM ENABLERS')],
  },
}

const SPONSORS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: absoluteUrl(),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Sponsors',
      item: absoluteUrl('/sponsors'),
    },
  ],
}

export default function SponsorsPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SPONSORS_SCHEMA) }}
      />
      <Nav />
      <Sponsors />
      <Footer />
    </main>
  )
}
