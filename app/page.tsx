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
const Sponsors = dynamic(() => import('@/components/Sponsors'))
const FAQ = dynamic(() => import('@/components/FAQ'))
const Alumni = dynamic(() => import('@/components/Alumni'))
const Footer = dynamic(() => import('@/components/Footer'))
const RegisterCTA = dynamic(() => import('@/components/Footer').then((m) => m.RegisterCTA))

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

      {/* ── 2. LIME TRANSITION BANNER & FLIPFLOP MARQUEE — Immediately after Hero ── */}
      <LimeTransitionBanner />
      <FlipFlopTransition />

      {/* ── 3. ABOUT — Mission, vision & core pillars ── */}
      <EsummitAbout />

      {/* ── 4. COMPETITIONS & TRACKS — Event portfolio ── */}
      <EventPortfolioShowcase />

      {/* ── 5. SPEAKERS — Keynote guests ── */}
      <EsummitHighlights />

      {/* ── 6. MASONRY GALLERY — 5-column vertical scroll gallery kept in place ── */}
      <MasonryShowcase />

      {/* ── 7. VIDEO SCRUBBER — Market surge video ── */}
      <Vdo2Showcase />

      {/* ── 8. ALUMNI — Wall of fame ── */}
      <Alumni />

      {/* ── 9. SPONSORS — Ecosystem & title partners ── */}
      <Sponsors />

      {/* ── 10. REGISTER CTA — Conversion banner ── */}
      <RegisterCTA />

      {/* ── 11. FAQ — Attendee questions ── */}
      <FAQ />

      {/* ── 12. FOOTER ── */}
      <Footer hideCTA={true} />
    </main>
  )
}
