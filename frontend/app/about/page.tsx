import React from 'react'
import type { Metadata } from 'next'
import About from '@/components/About'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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
  openGraph: {
    title: "About Us — Legacy & Mission | PEC E-Summit '26",
    description:
      "Discover the 100+ year legacy, mission, and entrepreneurial impact of PEC E-Summit 2026, hosted by EIC at Punjab Engineering College, Chandigarh.",
    url: 'https://esummit.pec.ac.in/about',
    siteName: "PEC E-Summit '26",
    images: [{ url: '/esummit-logo.png' }],
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12" id="about-page">
      <Nav />
      <About />
      <Footer />
    </main>
  )
}
