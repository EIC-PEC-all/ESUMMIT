import React from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PageBanner from '@/components/Common/PageBanner'
import EsummitAbout from '@/components/EsummitAbout'

export const metadata: Metadata = {
  title: "About Us | PEC E-Summit '26",
  description:
    "Learn about PEC E-Summit 2026, organized by the Entrepreneurship and Incubation Cell (EIC), Punjab Engineering College, Chandigarh. Discover our mission, core pillars, and leadership.",
  keywords: [
    'About PEC E-Summit',
    'EIC PEC',
    'Entrepreneurship and Incubation Cell',
    'Punjab Engineering College',
    'PEC Chandigarh',
    'Student Startups',
    'Innovation Cell',
  ],
}

export default function AboutPage() {
  return (
    <main className="bg-void min-h-screen overflow-x-clip" id="about-page">
      <Nav />

      {/* Top Banner */}
      <PageBanner
        title="ABOUT E-SUMMIT"
        subtitle="14–15 NOVEMBER 2026 · FOSTERING VENTURE BUILDING & INNOVATION AT PEC"
      />

      {/* Core Mission & Pillars Section */}
      <div className="pt-6 sm:pt-10 pb-16">
        <EsummitAbout />
      </div>

      {/* Footer */}
      <Footer hideCTA />
    </main>
  )
}
