import React from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import PassesSection from '@/components/Passes'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "Official Passes & Packages | PEC E-Summit '26",
  description:
    "Explore official Silver, Gold, and Diamond passes for PEC E-Summit 2026. Pitch to marquee investors, secure premium expo stalls, and connect with top talent at Punjab Engineering College, Chandigarh.",
  keywords: [
    'PEC E-Summit Passes',
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
      <PassesSection isStandalonePage={true} />
      <Footer hideCTA />
    </main>
  )
}
