import React from 'react'
import type { Metadata } from 'next'
import SpeakersList from '@/components/SpeakersList'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Keynote Speakers, Founders & Investors | PEC E-Summit 2026',
  description:
    'Meet the startup founders, unicorn builders, angel investors, and industry captains headlining PEC E-Summit 2026 at Punjab Engineering College, Chandigarh.',
  keywords: [
    'PEC E-Summit Speakers',
    'Startup Keynote Speakers',
    'Venture Capitalists Chandigarh',
    'Angel Investors India',
    'PEC Alumni Founders',
    'Entrepreneurship Sessions',
  ],
  alternates: {
    canonical: '/speakers',
  },
  openGraph: {
    title: 'Keynote Speakers & Investors | PEC E-Summit 2026',
    description:
      'Learn from leading founders, VCs, and innovators at Punjab Engineering College on November 14–15, 2026.',
    url: absoluteUrl('/speakers'),
    siteName: 'PEC E-Summit 2026',
    images: [
      {
        url: getOgImageUrl('Keynote Speakers', 'FOUNDERS & INVESTORS'),
        width: 1200,
        height: 630,
        alt: 'PEC E-Summit 2026 Featured Speakers and Mentors',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEC E-Summit 2026 Keynote Speakers',
    description: 'Learn directly from unicorn founders and top tier venture capitalists.',
    images: [getOgImageUrl('Keynote Speakers', 'FOUNDERS & INVESTORS')],
  },
}

const SPEAKERS_SCHEMA = {
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
          name: 'Speakers',
          item: absoluteUrl('/speakers'),
        },
      ],
    },
    {
      '@type': 'ItemList',
      name: 'PEC E-Summit 2026 Keynote Speakers & Venture Mentors',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Person',
            name: 'Sandeep Jain',
            jobTitle: 'Founder & CEO',
            worksFor: { '@type': 'Organization', name: 'GeeksforGeeks' },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Person',
            name: 'Saurabh Munjal',
            jobTitle: 'Co-Founder & CEO',
            worksFor: { '@type': 'Organization', name: 'Lahori Zeera' },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Person',
            name: 'Aditi Bhutia Madan',
            jobTitle: 'Founder',
            worksFor: { '@type': 'Organization', name: 'Momo Mami (Shark Tank India)' },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Person',
            name: 'Varun Singla',
            jobTitle: 'Founder',
            worksFor: { '@type': 'Organization', name: 'Gate Smashers' },
          },
        },
        {
          '@type': 'ListItem',
          position: 5,
          item: {
            '@type': 'Person',
            name: 'Nandu Nandkishore',
            jobTitle: 'Former Global CEO',
            worksFor: { '@type': 'Organization', name: 'Nestle Nutrition' },
          },
        },
        {
          '@type': 'ListItem',
          position: 6,
          item: {
            '@type': 'Person',
            name: 'Kailash Nath',
            jobTitle: 'AVP - Seed',
            worksFor: { '@type': 'Organization', name: 'Chiratae Ventures' },
          },
        },
        {
          '@type': 'ListItem',
          position: 7,
          item: {
            '@type': 'Person',
            name: 'Sarvjeet Singh',
            jobTitle: 'Founder',
            worksFor: { '@type': 'Organization', name: 'Finvasia' },
          },
        },
        {
          '@type': 'ListItem',
          position: 8,
          item: {
            '@type': 'Person',
            name: 'Aseem Ghavri',
            jobTitle: 'Co-Founder',
            worksFor: { '@type': 'Organization', name: 'Third Unicorn' },
          },
        },
      ],
    },
  ],
}

export default function SpeakersPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SPEAKERS_SCHEMA) }}
      />
      <Nav />
      <SpeakersList />
      <Footer />
    </main>
  )
}
