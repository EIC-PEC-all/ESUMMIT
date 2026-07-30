'use client'
// components/Marquee/index.tsx
// Auto-scrolling partner/sponsor strip with pause-on-hover

import { useRef, useState } from 'react'
import { SPONSORS } from '@/lib/data'

const ALL_LOGOS = [
  ...SPONSORS.title,
  ...SPONSORS.gold,
  ...SPONSORS.silver,
  ...SPONSORS.media,
]

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center px-8 py-3 rounded"
      style={{
        background: 'rgba(138,144,166,0.06)',
        border: '1px solid rgba(138,144,166,0.1)',
        minWidth: '140px',
        height: '52px',
      }}
      aria-label={name}
    >
      {/* TODO: replace with real logo <img src={logo} alt={name} /> */}
      <span
        className="font-body font-semibold text-sm whitespace-nowrap tracking-wide"
        style={{ color: 'var(--text-muted)' }}
      >
        {name}
      </span>
    </div>
  )
}

export default function Marquee() {
  const [paused, setPaused] = useState(false)
  // Double the items for seamless loop
  const items = [...ALL_LOGOS, ...ALL_LOGOS]

  return (
    <section
      className="py-10 overflow-hidden"
      style={{
        borderTop: '1px solid rgba(138,144,166,0.08)',
        borderBottom: '1px solid rgba(138,144,166,0.08)',
        background: 'rgba(19,24,41,0.4)',
      }}
      aria-label="Partners and sponsors"
    >
      <div className="mb-4 flex items-center justify-center">
        <span
          className="font-mono-data text-[10px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--text-muted)' }}
        >
          Partners &amp; Media
        </span>
      </div>

      <div
        className="marquee-wrapper relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-roledescription="marquee"
        aria-label="Scrolling list of partners"
      >
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 w-24 h-full z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--bg-void), transparent)' }}
        />
        <div
          className="absolute right-0 top-0 w-24 h-full z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--bg-void), transparent)' }}
        />

        <div
          className={`marquee-track ${paused ? 'paused' : ''}`}
          aria-hidden="true"
        >
          {items.map((item, i) => (
            <LogoPlaceholder key={`${item.id}-${i}`} name={item.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
