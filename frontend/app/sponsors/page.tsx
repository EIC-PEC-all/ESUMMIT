import React from 'react'
import Sponsors from '@/components/Sponsors'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function SponsorsPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12">
      <Nav />
      <Sponsors />
      <Footer />
    </main>
  )
}
