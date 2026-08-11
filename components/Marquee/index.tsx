'use client'
// components/Marquee/index.tsx
// Seamless horizontal scrolling partner marquee strip with Money/Fintech theme

import { SPONSORS } from '@/lib/data'
import { Zap } from 'lucide-react'

const ALL_LOGOS = [...SPONSORS.title, ...SPONSORS.gold, ...SPONSORS.silver, ...SPONSORS.media]

export default function Marquee() {
  const items = [...ALL_LOGOS, ...ALL_LOGOS, ...ALL_LOGOS]

  return (
    <section
      className="border-[var(--accent-mint)]/15 relative overflow-hidden border-b border-t bg-void py-6"
      aria-label="Partners and sponsors"
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        <Zap size={12} className="fill-[var(--accent-mint)] text-[var(--accent-mint)]" />
        <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--accent-mint)]">
          Summit Partners &amp; Sponsors
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative flex items-center overflow-hidden">
        {/* Left Fade Gradient */}
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
        {/* Right Fade Gradient */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />

        {/* Continuous Horizontal Row Line */}
        <div className="flex animate-marquee whitespace-nowrap py-2 hover:[animation-play-state:paused]">
          {items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="border-[var(--accent-mint)]/20 mx-2 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border bg-panel px-6 py-2.5 font-mono-data text-xs font-semibold text-muted transition-all hover:border-[var(--accent-mint)] hover:text-[var(--accent-mint)] hover:shadow-[0_0_15px_rgba(126,211,33,0.3)]"
            >
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
