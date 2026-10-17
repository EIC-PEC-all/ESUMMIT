import React from 'react'
import type { Metadata } from 'next'
import EventPortfolioShowcase from '@/components/EventPortfolio'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Flagship Events, Hackathons & Pitch Competitions | PEC E-Summit 2026',
  description:
    'Explore competitions, hackathons, and venture showcases at PEC E-Summit 2026. High-Stakes Pitch Competition, 36-Hour Hackathon, Startup Expo, and VC panel discussions at Punjab Engineering College, Chandigarh.',
  keywords: [
    'PEC E-Summit Events',
    'Startup Pitch Competition',
    'Chandigarh Hackathon 2026',
    'Startup Expo',
    'Punjab Engineering College Competitions',
    'Venture Showcase',
    'EIC PEC Events',
  ],
  alternates: {
    canonical: '/events',
  },
  openGraph: {
    title: 'Flagship Events, Hackathons & Pitch Competitions | PEC E-Summit 2026',
    description:
      'Compete, pitch, and build at North India’s premier entrepreneurship summit. 36-hour hackathon, startup pitching, and investor panels.',
    url: absoluteUrl('/events'),
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: getOgImageUrl('Flagship Events', 'HACKATHONS & PITCHES'),
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Events and Competitions',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026 Events & Hackathons',
    description: 'High-stakes pitch competition, 36-hour hackathon, and founder showcases.',
    images: [getOgImageUrl('Flagship Events', 'HACKATHONS & PITCHES')],
  },
}

const EVENTS_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
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
          name: 'Events',
          item: absoluteUrl('/events'),
        },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'PEC E-Summit 2026 Flagship Competitions & Events',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Event',
            name: 'High-Stakes Pitch Competition',
            description:
              'Founders pitch MVPs to seasoned VCs and angel investors for cash prizes and fast-tracked mentorship.',
            startDate: '2026-11-14T10:00:00+05:30',
            endDate: '2026-11-14T18:00:00+05:30',
            location: {
              '@type': 'Place',
              name: 'Punjab Engineering College, Sector 12, Chandigarh',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Event',
            name: '36-Hour Hackathon',
            description:
              'Rapid prototyping sprint solving problem statements in AI, FinTech, and Deep Tech with mentorship and cash rewards.',
            startDate: '2026-11-14T12:00:00+05:30',
            endDate: '2026-11-15T18:00:00+05:30',
            location: {
              '@type': 'Place',
              name: 'Punjab Engineering College, Sector 12, Chandigarh',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Event',
            name: 'Startup Expo & Baazar',
            description:
              '50+ startups showcase products to investors, corporate partners, and thousands of attendees.',
            startDate: '2026-11-14T09:00:00+05:30',
            endDate: '2026-11-15T18:00:00+05:30',
            location: {
              '@type': 'Place',
              name: 'Punjab Engineering College, Sector 12, Chandigarh',
            },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Event',
            name: 'Funding Conclave',
            description:
              'Curated 1-on-1 pitch and MoU readiness sessions between vetted startups and institutional venture funds.',
            startDate: '2026-11-15T11:00:00+05:30',
            endDate: '2026-11-15T17:00:00+05:30',
            location: {
              '@type': 'Place',
              name: 'Punjab Engineering College, Sector 12, Chandigarh',
            },
          },
        },
      ],
    },
  ],
}

export default function EventsPage() {
  return (
    <main className="bg-section-2 min-h-screen overflow-x-clip pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EVENTS_SCHEMA) }}
      />
      <Nav />
      <EventPortfolioShowcase />
      <Footer />
    </main>
  )
}
