import React from 'react'
import type { Metadata } from 'next'
import About from '@/components/About'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { absoluteUrl, getOgImageUrl } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: "About Us — Legacy & Mission | PEC E-Summit '26",
  description:
    "Discover the 100+ year legacy, mission, and entrepreneurial impact of PEC E-Summit 2026, hosted by the Entrepreneurship & Incubation Cell (EIC) at Punjab Engineering College, Chandigarh.",
  keywords: [
    'About PEC E-Summit',
    'EIC PEC',
    'Entrepreneurship and Incubation Cell',
    'Punjab Engineering College Heritage',
    'PEC Chandigarh Centenary',
    'Student Startups Chandigarh',
    'Kalpana Chawla PEC',
    'Innovation Cell PEC',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About Us — Legacy & Mission | PEC E-Summit '26",
    description:
      "Discover the 100+ year legacy, mission, and entrepreneurial impact of PEC E-Summit 2026, hosted by EIC at Punjab Engineering College, Chandigarh.",
    url: absoluteUrl('/about'),
    siteName: "PEC E-Summit '26",
    images: [
      {
        url: getOgImageUrl('Legacy & Mission', 'PUNJAB ENGINEERING COLLEGE'),
        width: 1200,
        height: 630,
        alt: "PEC E-Summit '26 Legacy & Mission",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About Us — Legacy & Mission | PEC E-Summit '26",
    description: '100+ years of legacy and innovation at Punjab Engineering College.',
    images: [getOgImageUrl('Legacy & Mission', 'PUNJAB ENGINEERING COLLEGE')],
  },
}

const ABOUT_SCHEMA = {
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
      name: 'About',
      item: absoluteUrl('/about'),
    },
  ],
}

export default function AboutPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12" id="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_SCHEMA) }}
      />
      <Nav />
      <About />
      <Footer />
    </main>
  )
}
