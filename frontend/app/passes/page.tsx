import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PassesUnifiedView from './PassesUnifiedView'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: "Official Student & Startup Passes | PEC E-Summit '26",
  description:
    "Explore official Student and Startup passes for PEC E-Summit 2026. Pitch to marquee investors, secure premium expo stalls, and apply for the Funding Conclave at Punjab Engineering College, Chandigarh.",
  keywords: [
    'PEC E-Summit Passes',
    'Student Pass',
    'Hackathon Pass',
    'Silver Pass',
    'Gold Pass',
    'Diamond Pass',
    'Startup Packages',
    'Startup Pitching',
    'Funding Conclave',
    'Chandigarh Startup Expo',
  ],
  alternates: {
    canonical: '/passes',
  },
  openGraph: {
    title: "Official Student & Startup Passes | PEC E-Summit '26",
    description:
      'Pitch to marquee investors, enter the 36-hour hackathon, and secure startup expo booths at PEC E-Summit 2026.',
    url: absoluteUrl('/passes'),
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: getOgImageUrl('Official Passes', 'STUDENTS & STARTUPS'),
        width: 1200,
        height: 630,
        alt: "PEC E-Summit '26 Passes",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "PEC E-Summit '26 Official Passes",
    description: 'Claim your delegate, hackathon, or startup package today.',
    images: [getOgImageUrl('Official Passes', 'STUDENTS & STARTUPS')],
  },
}

const PASSES_SCHEMA = {
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
          name: 'Passes',
          item: absoluteUrl('/passes'),
        },
      ],
    },
    {
      '@type': 'AggregateOffer',
      name: 'PEC E-Summit 2026 Passes',
      description:
        'Official Student Delegate, Hackathon Builder, and Startup Funding Conclave Passes for PEC E-Summit 2026.',
      url: absoluteUrl('/passes'),
      priceCurrency: 'INR',
      lowPrice: 0,
      highPrice: 5000,
      offerCount: 6,
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Delegate Pass',
          price: 0,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
        {
          '@type': 'Offer',
          name: 'Hackathon Builder Pass',
          price: 149,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
        {
          '@type': 'Offer',
          name: 'All-Access Pass',
          price: 299,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
        {
          '@type': 'Offer',
          name: 'Startup Silver Pass',
          price: 2500,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
        {
          '@type': 'Offer',
          name: 'Startup Gold Pass',
          price: 3500,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
        {
          '@type': 'Offer',
          name: 'Startup Diamond Pass',
          price: 5000,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: absoluteUrl('/passes'),
        },
      ],
    },
  ],
}

export default function PassesPage() {
  return (
    <main
      className="bg-deep min-h-screen text-primary flex flex-col"
      id="passes-page"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PASSES_SCHEMA) }}
      />
      <Nav />
      <div className="flex-1 pt-14 sm:pt-16">
        <Suspense
          fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-mint border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <PassesUnifiedView />
        </Suspense>
      </div>
      <Footer hideCTA />
    </main>
  )
}
