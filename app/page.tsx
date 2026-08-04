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

// ── Creative landing sections ──────────────────────────────────────────────
import EsummitHero from '@/components/EsummitHero'
import EsummitMarquee from '@/components/EsummitMarquee'
import EsummitAbout from '@/components/EsummitAbout'
import EsummitTracks from '@/components/EsummitTracks'

// Dynamic (Framer Motion scroll hooks — better as client-only)
const EsummitHighlights = dynamic(() => import('@/components/EsummitSpeakers'), {
  ssr: false,
})

// ── Original detailed sections ─────────────────────────────────────────────
import StatBurst from '@/components/StatBurst'
import Speakers from '@/components/Speakers'
import Sponsors from '@/components/Sponsors'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

const Timeline = dynamic(() => import('@/components/Timeline'), {
  ssr: false,
  loading: () => (
    <div className="py-32 flex items-center justify-center section-container">
      <span className="font-mono-data text-sm text-muted">Loading schedule…</span>
    </div>
  ),
})

const Concierge = dynamic(() => import('@/components/Concierge'), { ssr: false })

export default function Home() {
  return (
    <main style={{ overflowX: 'clip', background: '#070B08' }}>
      <Toaster
        position="top-center"
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Kanit', sans-serif",
            fontSize: '0.875rem',
            background: '#0D140E',
            color: '#F5F5F0',
            border: '1px solid rgba(126, 211, 33, 0.2)',
          },
        }}
      />

      {/* ── 1. Creative Hero ─────────────────────────────────────────────── */}
      <EsummitHero />

      {/* ── 2. Scroll-Parallax GIF Marquee ──────────────────────────────── */}
      <EsummitMarquee />

      {/* ── 3. About — char-by-char reveal + 3D decor ───────────────────── */}
      <EsummitAbout />

      {/* ── 4. Events — white bg, numbered list ─────────────────────────── */}
      <EsummitTracks />

      {/* ── 5. Highlights — sticky card stack, dark bg ──────────────────── */}
      <EsummitHighlights />

      {/* ── 6. Stats counter ────────────────────────────────────────────── */}
      <StatBurst />

      {/* ── 7. Speakers grid ────────────────────────────────────────────── */}
      <Speakers />

      {/* ── 8. Schedule / Timeline ──────────────────────────────────────── */}
      <Timeline />

      {/* ── 9. Sponsors marquee ─────────────────────────────────────────── */}
      <Sponsors />

      {/* ── 10. FAQ accordion ───────────────────────────────────────────── */}
      <FAQ />

      {/* ── 11. Footer / CTA ────────────────────────────────────────────── */}
      <Footer />

      {/* ── 12. AI Concierge (floating) ─────────────────────────────────── */}
      <Concierge />
    </main>
  )
}
