'use client'
// components/Marquee/index.tsx
// Seamless horizontal scrolling partner marquee strip with Money/Fintech theme

import { SPONSORS } from '@/lib/data'
import { Zap } from 'lucide-react'

const ALL_LOGOS = [
  ...SPONSORS.title,
  ...SPONSORS.gold,
  ...SPONSORS.silver,
  ...SPONSORS.media,
]

export default function Marquee() {
  const items = [...ALL_LOGOS, ...ALL_LOGOS, ...ALL_LOGOS]

  return (
    <section
      className="py-6 relative overflow-hidden bg-void border-t border-b border-[var(--accent-mint)]/15"
      aria-label="Partners and sponsors"
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        <Zap size={12} className="text-[var(--accent-mint)] fill-[var(--accent-mint)]" />
        <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[var(--accent-mint)] font-bold">
          Official Partners &amp; Ecosystem
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative overflow-hidden flex items-center">
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-void to-transparent" />
        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-void to-transparent" />

        {/* Continuous Horizontal Row Line */}
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] py-2">
          {items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="inline-flex items-center justify-center px-6 py-2.5 mx-2 rounded-xl bg-panel border border-[var(--accent-mint)]/20 text-muted font-mono-data text-xs font-semibold hover:text-[var(--accent-mint)] hover:border-[var(--accent-mint)] hover:shadow-[0_0_15px_rgba(126,211,33,0.3)] transition-all shrink-0 cursor-pointer"
            >
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
