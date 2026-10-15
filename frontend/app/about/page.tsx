import React from 'react'
import type { Metadata } from 'next'
import About from '@/components/About'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: "About | PEC E-Summit '26",
  description:
    'Discover the legacy, mission, and impact of PEC E-Summit 2026, hosted by the Entrepreneurship & Incubation Cell (EIC) at Punjab Engineering College, Chandigarh.',
}

export default function AboutPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12">
      <Nav />
      <About />
      <Footer />
    </main>
  )
}

