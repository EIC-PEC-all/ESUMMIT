// app/page.tsx
// PEC E-Summit 2026 — Full-fledged landing page
// Section order:
//   1. EsummitHero        (creative full-viewport hero, Magnet + FadeIn)
//   2. EsummitMarquee     (scroll-parallax GIF showcase rows)
//   3. EsummitAbout       (char-by-char text reveal + 3D corner decor)
//   4. EsummitTracks      (white bg, numbered events list)
//   5. EsummitHighlights  (sticky card stacking — dark bg)
//   6. StatBurst          (animated stats counter)
//   7. Speakers           (speaker grid)
//   8. Timeline           (GSAP scroll schedule)
//   9. Sponsors           (partner logos marquee)
//  10. FAQ               (accordion)
//  11. Footer             (register CTA + links)
//  12. Concierge          (AI agent, floating)
'use client'

import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

import Nav from '@/components/Nav'
import NewHero from '@/components/Hero/NewHero'
import FlipFlopTransition from '@/components/Common/FlipFlopTransition'
import EsummitMarquee from '@/components/EsummitMarquee'
import EsummitAbout from '@/components/EsummitAbout'
import Vdo2Showcase from '@/components/Vdo2Showcase'
import LimeTransitionBanner from '@/components/Common/LimeTransitionBanner'

const MasonryShowcase = dynamic(() => import('@/components/MasonryShowcase'), {
  ssr: false,
})

// Dynamic (Framer Motion scroll hooks — better as client-only)
const EsummitHighlights = dynamic(() => import('@/components/EsummitSpeakers'), {
  ssr: false,
})

// ── Original detailed sections ─────────────────────────────────────────────
import Sponsors from '@/components/Sponsors'
import FAQ from '@/components/FAQ'
import Footer, { RegisterCTA } from '@/components/Footer'

const Timeline = dynamic(() => import('@/components/Timeline'), {
  ssr: false,
  loading: () => (
    <div className="section-container flex items-center justify-center py-32">
      <span className="font-mono-data text-sm text-muted">Loading schedule…</span>
    </div>
  ),
})

const Concierge = dynamic(() => import('@/components/Concierge'), { ssr: false })

const Alumni = dynamic(() => import('@/components/Alumni'), { ssr: false })

export default function Home() {
  return (
    <main id="main-content" className="bg-void" style={{ overflowX: 'clip' }}>
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

      {/* ── 1. NewHero 60fps Frame Scrubbing ───────────────────────────── */}
      <NewHero />

      {/* ── Flip-Flop 3D Slat Page Transition ──────────────────────────── */}
      <FlipFlopTransition />

      {/* ── 2. Scroll-Parallax GIF Marquee ──────────────────────────────── */}
      <EsummitMarquee />

      {/* ── 3. About — char-by-char reveal + 3D decor ───────────────────── */}
      <EsummitAbout />

      {/* ── 3b. React Bits Masonry — 2x Viewport Height Scroll Parallax ───── */}
      <MasonryShowcase />

      {/* ── Lime Transition Banner before Highlights ────────────────────── */}
      <LimeTransitionBanner />

      {/* ── 4. Highlights — sticky card stack, dark bg ──────────────────── */}
      <EsummitHighlights />

      {/* ── 5. Market Surge Video Showcase (vdo2 frame scrubber) ───────── */}
      <Vdo2Showcase />

      {/* ── 6. Alumni — horizontal scroll with PixelTransition ───────────── */}
      <Alumni />

      {/* ── 9. Schedule / Timeline ──────────────────────────────────────── */}
      <Timeline />

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
