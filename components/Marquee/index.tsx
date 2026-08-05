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
      className="py-6 relative overflow-hidden bg-[#070B08] border-t border-b border-[#7ED321]/15"
      aria-label="Partners and sponsors"
    >
      <div className="mb-3 flex items-center justify-center gap-2">
        <Zap size={12} className="text-[#7ED321] fill-[#7ED321]" />
        <span className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-[#7ED321] font-bold">
          Official Partners &amp; Ecosystem
        </span>
      </div>

      {/* Marquee Wrapper */}
      <div className="relative overflow-hidden flex items-center">
        {/* Left Fade Gradient */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r from-[#070B08] to-transparent" />
        {/* Right Fade Gradient */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l from-[#070B08] to-transparent" />

        {/* Continuous Horizontal Row Line */}
        <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused] py-2">
          {items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="inline-flex items-center justify-center px-6 py-2.5 mx-2 rounded-xl bg-[#0D140E] border border-[#7ED321]/20 text-[#8A9488] font-mono-data text-xs font-semibold hover:text-[#7ED321] hover:border-[#7ED321] hover:shadow-[0_0_15px_rgba(126,211,33,0.3)] transition-all shrink-0 cursor-pointer"
            >
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
