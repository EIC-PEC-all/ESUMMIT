'use client'

import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

import Nav from '@/components/Nav'
import NewHero from '@/components/Hero/NewHero'
import LimeEdgeMasks from '@/components/Common/LimeEdgeMasks'
import ScrollExpandLoader from '@/components/Common/ScrollExpandLoader'

// ── Below-the-fold sections loaded asynchronously to protect initial critical bundle ──
const FlipFlopTransition = dynamic(() => import('@/components/Common/FlipFlopTransition'), { ssr: false })
const Alumni = dynamic(() => import('@/components/Alumni'), { ssr: false })
const PassesSection = dynamic(() => import('@/components/Passes'), { ssr: false })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false })
const RegisterCTA = dynamic(() => import('@/components/Footer').then((m) => m.RegisterCTA), { ssr: false })
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false })

import { TOAST_STYLE } from '@/lib/constants'

export default function Home() {
  return (
    <main id="main-content" className="bg-void overflow-x-clip" suppressHydrationWarning>
      {/* Vantage Initial Page Loader */}
      <ScrollExpandLoader />

      {/* Fixed Page Top & Bottom Boundary Edge Masks */}
      <LimeEdgeMasks />

      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: TOAST_STYLE.style,
        }}
      />

      {/* Navigation */}
      <Nav />

      {/* ── 1. HERO — Grand Entrance & Frame Scrubbing ── */}
      <NewHero />

      {/* ── 2. FLIPFLOP PHOTO MARQUEE — Immediately after Hero ── */}
      <FlipFlopTransition />

      {/* ── 3. ALUMNI — Wall of fame ── */}
      <Alumni />

      {/* ── 4. STARTUP PACKAGES / PASSES — Diamond, Gold, Silver tiers ── */}
      <PassesSection />

      {/* ── 5. FAQ — Answers before registration ── */}
      <FAQ />

      {/* ── 6. REGISTER CTA — Conversion banner ── */}
      <RegisterCTA />

      {/* ── 7. FOOTER ── */}
      <Footer hideCTA={true} />
    </main>
  )
}
