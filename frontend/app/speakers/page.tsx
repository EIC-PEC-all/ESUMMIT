import React from 'react'
import SpeakersList from '@/components/SpeakersList'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function SpeakersPage() {
  return (
    <main className="bg-section-1 min-h-screen overflow-x-clip pb-12">
      <Nav />
      <SpeakersList />
      <Footer />
    </main>
  )
}
