import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import PassesSection from '@/components/Passes'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Official Passes & Packages | PEC E-Summit '26",
  description:
    "Explore official Student and Startup passes for PEC E-Summit 2026. Pitch to marquee investors, secure premium expo stalls, and participate in hackathons at Punjab Engineering College, Chandigarh.",
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
}

export default function PassesPage() {
  return (
    <main className="bg-[#071511] min-h-screen overflow-x-clip pb-12" id="passes-page">
      <Nav />
      <Suspense fallback={<div className="min-h-[600px] bg-[#071511]" />}>
        <PassesSection isStandalonePage={true} />
      </Suspense>
      <Footer hideCTA />
    </main>
  )
}

