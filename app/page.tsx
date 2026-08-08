'use client'

import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

import Nav from '@/components/Nav'
import NewHero from '@/components/Hero/NewHero'
import FlipFlopTransition from '@/components/Common/FlipFlopTransition'
import EsummitAbout from '@/components/EsummitAbout'
import Vdo2Showcase from '@/components/Vdo2Showcase'
import LimeTransitionBanner from '@/components/Common/LimeTransitionBanner'
import LimeEdgeMasks from '@/components/Common/LimeEdgeMasks'

const ScrollExpandLoader = dynamic(() => import('@/components/Common/ScrollExpandLoader'), { ssr: false })

const MasonryShowcase = dynamic(() => import('@/components/MasonryShowcase'), { ssr: false })
const EventPortfolioShowcase = dynamic(() => import('@/components/EventPortfolio'), { ssr: false })
const EsummitHighlights = dynamic(() => import('@/components/EsummitSpeakers'), { ssr: false })
const Sponsors = dynamic(() => import('@/components/Sponsors'), { ssr: false })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false })
const Alumni = dynamic(() => import('@/components/Alumni'), { ssr: false })
const Concierge = dynamic(() => import('@/components/Concierge'), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })
const RegisterCTA = dynamic(() => import('@/components/Footer').then((m) => m.RegisterCTA), { ssr: false })

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <main id="main-content" className="bg-void" style={{ overflowX: 'clip' }} suppressHydrationWarning>
      {/* Vantage Initial Page Loader (Auto Expands & Unmounts after 3.5s) */}
      <ScrollExpandLoader />

      {/* ── Fixed Page Top & Bottom Boundary-to-Center Lime Tinted Edge Masks ── */}
      <LimeEdgeMasks />

      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: '0.875rem',
            background: '#0A110E',
            color: '#FFFFFF',
            border: '1px solid rgba(126, 211, 33, 0.2)',
          },
        }}
      />

      {/* Navigation */}
      <Nav />

      {/* ── 1. NewHero 60fps Frame Scrubbing (100% Original & Untouched) ── */}
      <NewHero />

      {/* ── 2. Strip Collapse Transition Revealing Marquee Gallery ───── */}
      <FlipFlopTransition />

      {/* ── 3. About — char-by-char reveal + 3D decor ───────────────────── */}
      <EsummitAbout />

      {/* ── 3b. React Bits Masonry — 2x Viewport Height Scroll Parallax ───── */}
      <MasonryShowcase />

      {/* ── Lime Transition Banner before Highlights ────────────────────── */}
      <LimeTransitionBanner />

      {/* ── 4. Timeline / Highlights — sticky card stack, dark bg ─────────── */}
      <EsummitHighlights />

      {/* ── Trionn-inspired Event Portfolio Horizontal Showcase ──────────── */}
      <EventPortfolioShowcase />

      {/* ── 5. Market Surge Video Showcase (vdo2 frame scrubber) ───────── */}
      <Vdo2Showcase />

      {/* ── 6. Alumni — horizontal scroll with PixelTransition ───────────── */}
      <Alumni />

      {/* ── 10. Sponsors marquee ─────────────────────────────────────────── */}
      <Sponsors />

      {/* ── 11. Register CTA ────────────────────────────────────────────── */}
      <RegisterCTA />

      {/* ── 12. FAQ accordion ───────────────────────────────────────────── */}
      <FAQ />

      {/* ── 13. Corporate EIC Footer ────────────────────────────────────── */}
      <Footer hideCTA={true} />

      {/* ── 14. AI Concierge (floating) ─────────────────────────────────── */}
      <Concierge />
    </main>
  )
}
