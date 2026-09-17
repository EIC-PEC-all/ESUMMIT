import { Toaster } from 'react-hot-toast'
import dynamic from 'next/dynamic'

import Nav from '@/components/Nav'
import NewHero from '@/components/Hero/NewHero'
import LimeTransitionBanner from '@/components/Common/LimeTransitionBanner'
import LimeEdgeMasks from '@/components/Common/LimeEdgeMasks'
import ScrollExpandLoader from '@/components/Common/ScrollExpandLoader'
import LazySection from '@/components/Common/LazySection'
// ── Below-the-fold sections loaded asynchronously to protect initial critical bundle ──
const FlipFlopTransition = dynamic(() => import('@/components/Common/FlipFlopTransition'), { ssr: false })
const EsummitAbout = dynamic(() => import('@/components/EsummitAbout'), { ssr: false })
const EventPortfolioShowcase = dynamic(() => import('@/components/EventPortfolio'), { ssr: false })
const EsummitHighlights = dynamic(() => import('@/components/EsummitSpeakers'), { ssr: false })
const MasonryShowcase = dynamic(() => import('@/components/MasonryShowcase'), { ssr: false })
const Vdo2Showcase = dynamic(() => import('@/components/Vdo2Showcase'), { ssr: false })
const Alumni = dynamic(() => import('@/components/Alumni'), { ssr: false })
const Sponsors = dynamic(() => import('@/components/Sponsors'), { ssr: false })
const RegisterCTA = dynamic(() => import('@/components/Footer').then((m) => m.RegisterCTA), { ssr: false })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: false })
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

      {/* ── 2. LIME TRANSITION BANNER & FLIPFLOP MARQUEE — Immediately after Hero ── */}
      <LimeTransitionBanner />
      <FlipFlopTransition />

      {/* ── 3. ABOUT — Mission, vision & core pillars ── */}
      <LazySection minHeight="800px">
        <EsummitAbout />
      </LazySection>

      {/* ── 4. COMPETITIONS & TRACKS — Event portfolio ── */}
      <LazySection minHeight="1200px">
        <EventPortfolioShowcase />
      </LazySection>

      {/* ── 5. SPEAKERS — Keynote guests ── */}
      <LazySection minHeight="900px">
        <EsummitHighlights />
      </LazySection>

      {/* ── 6. MASONRY GALLERY — 5-column vertical scroll gallery kept in place ── */}
      <LazySection minHeight="1000px">
        <MasonryShowcase />
      </LazySection>

      {/* ── 7. VIDEO SCRUBBER — Market surge video ── */}
      <LazySection minHeight="800px">
        <Vdo2Showcase />
      </LazySection>

      {/* ── 8. ALUMNI — Wall of fame ── */}
      <LazySection minHeight="800px">
        <Alumni />
      </LazySection>

      {/* ── 9. SPONSORS — Ecosystem & title partners ── */}
      <LazySection minHeight="1000px">
        <Sponsors />
      </LazySection>

      {/* ── 10. REGISTER CTA — Conversion banner ── */}
      <LazySection minHeight="400px">
        <RegisterCTA />
      </LazySection>

      {/* ── 11. FAQ — Attendee questions ── */}
      <LazySection minHeight="800px">
        <FAQ />
      </LazySection>

      {/* ── 12. FOOTER ── */}
      <LazySection minHeight="600px">
        <Footer hideCTA={true} />
      </LazySection>
    </main>
  )
}
