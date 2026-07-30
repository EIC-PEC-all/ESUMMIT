// app/page.tsx
// Main page — all sections assembled in order
'use client'

import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

// Static sections
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import About from '@/components/About'
import Tracks from '@/components/Tracks'
import Speakers from '@/components/Speakers'
import Sponsors from '@/components/Sponsors'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

// Timeline uses GSAP — dynamically loaded to avoid SSR issues
const Timeline = dynamic(() => import('@/components/Timeline'), {
  ssr: false,
  loading: () => (
    <div className="py-32 flex items-center justify-center section-container">
      <span className="font-mono-data text-sm" style={{ color: 'var(--text-muted)' }}>
        Loading schedule…
      </span>
    </div>
  ),
})

// Concierge is client-only
const Concierge = dynamic(() => import('@/components/Concierge'), { ssr: false })

export default function Home() {
  return (
    <main>
      {/* Toast provider */}
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
          },
        }}
      />

      {/* Navigation */}
      <Nav />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Marquee */}
      <Marquee />

      {/* 3. About / Stats */}
      <About />

      {/* 4. Tracks / Events */}
      <Tracks />

      {/* 5. Speakers */}
      <Speakers />

      {/* 6. Schedule / Timeline */}
      <Timeline />

      {/* 7. Sponsors */}
      <Sponsors />

      {/* 9. FAQ */}
      <FAQ />

      {/* 10. Register / Footer CTA */}
      <Footer />

      {/* 8. AI Concierge (floating) */}
      <Concierge />
    </main>
  )
}
