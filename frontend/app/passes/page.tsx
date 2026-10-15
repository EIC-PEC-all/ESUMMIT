import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PassesUnifiedView from './PassesUnifiedView'

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
}

export default function PassesPage() {
  return (
    <main
      className="bg-[#060D0B] min-h-screen text-[#FAFAFA] flex flex-col"
      id="passes-page"
    >
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

