// app/page.tsx
// Main page — all sections assembled in order (Momentum Direction)
'use client'

import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

// Static sections
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import StatBurst from '@/components/StatBurst'
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
      <span className="font-mono-data text-sm text-muted">
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
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            background: 'var(--bg-panel)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(199, 208, 222, 0.15)',
          },
        }}
      />

      {/* Navigation */}
      <Nav />

      {/* 1. Hero with 3D Crystal */}
      <Hero />

      {/* 2. StatBurst Transition */}
      <StatBurst />

      {/* 3. Marquee */}
      <Marquee />

      {/* 4. About with Scroll-Pinned Text Reveal */}
      <About />

      {/* 5. Tracks / Events */}
      <Tracks />

      {/* 6. Speakers */}
      <Speakers />

      {/* 7. Schedule / Timeline */}
      <Timeline />

      {/* 8. Sponsors */}
      <Sponsors />

      {/* 9. FAQ */}
      <FAQ />

      {/* 10. Register / Footer CTA */}
      <Footer />

      {/* 11. AI Summit Agent (floating) + My Plan Drawer */}
      <Concierge />
    </main>
  )
}
